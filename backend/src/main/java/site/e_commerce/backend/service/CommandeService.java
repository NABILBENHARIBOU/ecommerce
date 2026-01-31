package site.e_commerce.backend.service;

import site.e_commerce.backend.dto.CommandeDTO;
import site.e_commerce.backend.dto.CreateCommandeDTO;
import site.e_commerce.backend.dto.CreateLigneCommandeDTO;
import site.e_commerce.backend.dto.LigneCommandeDTO;
import site.e_commerce.backend.dto.PaiementDTO;
import site.e_commerce.backend.model.*;
import site.e_commerce.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommandeService {
    
    @Autowired
    private CommandeRepository commandeRepository;
    
    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    @Autowired
    private AdresseRepository adresseRepository;
    
    @Autowired
    private ProduitRepository produitRepository;
    
    @Autowired
    private StatutCommandeRepository statutCommandeRepository;
    
    @Autowired
    private PaiementRepository paiementRepository;
    
    @Autowired
    private ModePaiementRepository modePaiementRepository;
    
    /**
     * Crée une nouvelle commande à partir du panier
     */
    public Commande creerCommande(CreateCommandeDTO createCommandeDTO) {
        // Récupérer l'utilisateur
        Utilisateur utilisateur = utilisateurRepository.findById(createCommandeDTO.getIdUtilisateur())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Récupérer l'adresse
        Adresse adresse = adresseRepository.findById(createCommandeDTO.getIdAdresse())
                .orElseThrow(() -> new RuntimeException("Adresse non trouvée"));
        
        // Récupérer le statut initial (En attente)
        StatutCommande statut = statutCommandeRepository.findByLibelle("En attente")
                .orElseGet(() -> {
                    StatutCommande newStatut = new StatutCommande();
                    newStatut.setLibelle("En attente");
                    return statutCommandeRepository.save(newStatut);
                });
        
        // Créer la commande
        Commande commande = new Commande();
        commande.setUtilisateur(utilisateur);
        commande.setAdresse(adresse);
        commande.setStatutCommande(statut);
        commande.setTotal(createCommandeDTO.getTotal());
        
        // Sauvegarder la commande
        Commande commandeSauvegardee = commandeRepository.save(commande);
        
        // Créer les lignes de commande
        if (createCommandeDTO.getLignesCommande() != null) {
            for (CreateLigneCommandeDTO createLigneDTO : createCommandeDTO.getLignesCommande()) {
                Produit produit = produitRepository.findById(createLigneDTO.getIdProduit())
                        .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
                
                LigneCommande ligneCommande = new LigneCommande();
                ligneCommande.setCommande(commandeSauvegardee);
                ligneCommande.setProduit(produit);
                ligneCommande.setQuantite(createLigneDTO.getQuantite());
                ligneCommande.setPrixUnitaire(createLigneDTO.getPrixUnitaire());
                
                ligneCommandeRepository.save(ligneCommande);
            }
        }
        
        return commandeSauvegardee;
    }
    
    /**
     * Crée une commande (ancienne méthode)
     */
    public Commande creerCommande(Commande commande) {
        return commandeRepository.save(commande);
    }
    
    public Optional<Commande> obtenirCommandeParId(Integer id) {
        return commandeRepository.findById(id);
    }
    
    public List<Commande> obtenirToutesLesCommandes() {
        return commandeRepository.findAllOrderByDateDesc();
    }
    
    public List<Commande> obtenirCommandesParUtilisateur(Integer idUtilisateur) {
        return commandeRepository.findUserOrdersOrderByDateDesc(idUtilisateur);
    }
    
    /**
     * Récupère les commandes d'un utilisateur avec un statut spécifique
     */
    public List<Commande> obtenirCommandesParUtilisateurEtStatut(Integer idUtilisateur, Integer idStatut) {
        return commandeRepository.findByUtilisateur_IdUtilisateurAndStatutCommande_IdStatut(idUtilisateur, idStatut);
    }
    
    /**
     * Récupère toutes les commandes avec un statut spécifique
     */
    public List<Commande> obtenirCommandesParStatut(Integer idStatut) {
        return commandeRepository.findByStatutCommande_IdStatut(idStatut);
    }
    
    /**
     * Met à jour le statut d'une commande
     */
    public Commande mettreAJourStatut(Integer idCommande, Integer idNouvauStatut) {
        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        
        StatutCommande nouveauStatut = statutCommandeRepository.findById(idNouvauStatut)
                .orElseThrow(() -> new RuntimeException("Statut non trouvé"));
        
        commande.setStatutCommande(nouveauStatut);
        return commandeRepository.save(commande);
    }
    
    public Commande mettreAJourCommande(Integer id, Commande commandeMisAJour) {
        Optional<Commande> commandeExistante = commandeRepository.findById(id);
        
        if (commandeExistante.isPresent()) {
            Commande commande = commandeExistante.get();
            if (commandeMisAJour.getTotal() != null) commande.setTotal(commandeMisAJour.getTotal());
            if (commandeMisAJour.getStatutCommande() != null) commande.setStatutCommande(commandeMisAJour.getStatutCommande());
            if (commandeMisAJour.getAdresse() != null) commande.setAdresse(commandeMisAJour.getAdresse());
            
            return commandeRepository.save(commande);
        }
        return null;
    }
    
    public boolean supprimerCommande(Integer id) {
        if (commandeRepository.existsById(id)) {
            commandeRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Convertir Commande en CommandeDTO
     */
    public CommandeDTO convertToDTO(Commande commande) {
        CommandeDTO dto = new CommandeDTO();
        dto.setIdCommande(commande.getIdCommande());
        dto.setDate(commande.getDate());
        dto.setTotal(commande.getTotal());
        
        if (commande.getUtilisateur() != null) {
            dto.setIdUtilisateur(commande.getUtilisateur().getIdUtilisateur());
            dto.setNomUtilisateur(commande.getUtilisateur().getNom() + " " + commande.getUtilisateur().getPrenom());
            dto.setEmailUtilisateur(commande.getUtilisateur().getEmail());
        }
        
        if (commande.getAdresse() != null) {
            dto.setIdAdresse(commande.getAdresse().getIdAdresse());
            String adresseComplete = commande.getAdresse().getRue() + ", " + 
                                    commande.getAdresse().getCodePostal() + " " + 
                                    commande.getAdresse().getVille() + ", " + 
                                    commande.getAdresse().getPays();
            dto.setAdresseComplete(adresseComplete);
        }
        
        if (commande.getStatutCommande() != null) {
            dto.setIdStatut(commande.getStatutCommande().getIdStatut());
            dto.setLibelleStatut(commande.getStatutCommande().getLibelle());
        }
        
        if (commande.getLignesCommande() != null && !commande.getLignesCommande().isEmpty()) {
            List<LigneCommandeDTO> ligneDTOs = commande.getLignesCommande().stream()
                    .map(ligne -> {
                        LigneCommandeDTO ligneDTO = new LigneCommandeDTO();
                        ligneDTO.setIdLigne(ligne.getIdLigne());
                        ligneDTO.setQuantite(ligne.getQuantite());
                        ligneDTO.setPrixUnitaire(ligne.getPrixUnitaire());
                        ligneDTO.setSousTotal(ligne.getPrixUnitaire().multiply(new BigDecimal(ligne.getQuantite())));
                        if (ligne.getProduit() != null) {
                            ligneDTO.setIdProduit(ligne.getProduit().getIdProduit());
                            ligneDTO.setNomProduit(ligne.getProduit().getNom());
                        }
                        return ligneDTO;
                    })
                    .collect(Collectors.toList());
            dto.setLignesCommande(ligneDTOs);
        }
        
        if (commande.getPaiement() != null) {
            Paiement paiement = commande.getPaiement();
            PaiementDTO paiementDTO = new PaiementDTO();
            paiementDTO.setIdPaiement(paiement.getIdPaiement());
            paiementDTO.setMontant(paiement.getMontant());
            paiementDTO.setDatePaiement(paiement.getDatePaiement());
            if (paiement.getModePaiement() != null) {
                paiementDTO.setIdMode(paiement.getModePaiement().getIdMode());
                paiementDTO.setLibelleMode(paiement.getModePaiement().getLibelle());
            }
            dto.setPaiement(paiementDTO);
        }
        
        return dto;
    }
}
