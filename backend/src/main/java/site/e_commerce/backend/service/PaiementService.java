package site.e_commerce.backend.service;

import site.e_commerce.backend.dto.PaiementDTO;
import site.e_commerce.backend.model.Commande;
import site.e_commerce.backend.model.ModePaiement;
import site.e_commerce.backend.model.Paiement;
import site.e_commerce.backend.model.StatutCommande;
import site.e_commerce.backend.repository.CommandeRepository;
import site.e_commerce.backend.repository.ModePaiementRepository;
import site.e_commerce.backend.repository.PaiementRepository;
import site.e_commerce.backend.repository.StatutCommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaiementService {
    
    @Autowired
    private PaiementRepository paiementRepository;
    
    @Autowired
    private CommandeRepository commandeRepository;
    
    @Autowired
    private ModePaiementRepository modePaiementRepository;
    
    @Autowired
    private StatutCommandeRepository statutCommandeRepository;
    
    /**
     * Crée un paiement pour une commande
     */
    public Paiement creerPaiement(Integer idCommande, Integer idModePaiement) {
        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        
        ModePaiement modePaiement = modePaiementRepository.findById(idModePaiement)
                .orElseThrow(() -> new RuntimeException("Mode de paiement non trouvé"));
        
        // Vérifier qu'il n'y a pas déjà de paiement
        Optional<Paiement> paiementExistant = paiementRepository.findByCommande_IdCommande(idCommande);
        if (paiementExistant.isPresent()) {
            throw new RuntimeException("Un paiement existe déjà pour cette commande");
        }
        
        // Créer le paiement
        Paiement paiement = new Paiement();
        paiement.setCommande(commande);
        paiement.setMontant(commande.getTotal());
        paiement.setModePaiement(modePaiement);
        paiement.setDatePaiement(LocalDateTime.now());
        
        Paiement paiementSauvegarde = paiementRepository.save(paiement);
        
        // Mettre à jour le statut de la commande à "En cours"
        StatutCommande statutEnCours = statutCommandeRepository.findByLibelle("En cours")
                .orElseGet(() -> {
                    StatutCommande newStatut = new StatutCommande();
                    newStatut.setLibelle("En cours");
                    return statutCommandeRepository.save(newStatut);
                });
        
        commande.setStatutCommande(statutEnCours);
        commandeRepository.save(commande);
        
        return paiementSauvegarde;
    }
    
    public Paiement creerPaiement(Paiement paiement) {
        return paiementRepository.save(paiement);
    }
    
    public Optional<Paiement> obtenirPaiementParId(Integer id) {
        return paiementRepository.findById(id);
    }
    
    public List<Paiement> obtenirTousLesPaiements() {
        return paiementRepository.findAll();
    }
    
    public Optional<Paiement> obtenirPaiementParCommande(Integer idCommande) {
        return paiementRepository.findByCommande_IdCommande(idCommande);
    }
    
    public Paiement mettreAJourPaiement(Integer id, Paiement paiementMisAJour) {
        Optional<Paiement> paiementExistant = paiementRepository.findById(id);
        
        if (paiementExistant.isPresent()) {
            Paiement paiement = paiementExistant.get();
            if (paiementMisAJour.getMontant() != null) paiement.setMontant(paiementMisAJour.getMontant());
            if (paiementMisAJour.getModePaiement() != null) paiement.setModePaiement(paiementMisAJour.getModePaiement());
            
            return paiementRepository.save(paiement);
        }
        return null;
    }
    
    public boolean supprimerPaiement(Integer id) {
        if (paiementRepository.existsById(id)) {
            paiementRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Convertit Paiement en PaiementDTO
     */
    public PaiementDTO convertToDTO(Paiement paiement) {
        PaiementDTO dto = new PaiementDTO();
        dto.setIdPaiement(paiement.getIdPaiement());
        dto.setMontant(paiement.getMontant());
        dto.setDatePaiement(paiement.getDatePaiement());
        
        if (paiement.getModePaiement() != null) {
            dto.setIdMode(paiement.getModePaiement().getIdMode());
            dto.setLibelleMode(paiement.getModePaiement().getLibelle());
        }
        
        if (paiement.getCommande() != null) {
            dto.setIdCommande(paiement.getCommande().getIdCommande());
        }
        
        return dto;
    }
}
