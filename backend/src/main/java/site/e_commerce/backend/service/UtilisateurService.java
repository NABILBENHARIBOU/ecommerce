package site.e_commerce.backend.service;

import site.e_commerce.backend.model.Utilisateur;
import site.e_commerce.backend.model.Panier;
import site.e_commerce.backend.repository.UtilisateurRepository;
import site.e_commerce.backend.repository.PanierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private PanierRepository panierRepository;
    
    // CREATE
    public Utilisateur creerUtilisateur(Utilisateur utilisateur) {
        Utilisateur nouvelUtilisateur = utilisateurRepository.save(utilisateur);
        // Créer un panier pour ce nouvel utilisateur
        Panier panier = new Panier(nouvelUtilisateur);
        panierRepository.save(panier);
        return nouvelUtilisateur;
    }
    
    // READ
    public Optional<Utilisateur> obtenirUtilisateurParId(Integer id) {
        return utilisateurRepository.findById(id);
    }
    
    public Optional<Utilisateur> obtenirUtilisateurParEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }
    
    public List<Utilisateur> obtenirTousLesUtilisateurs() {
        return utilisateurRepository.findAll();
    }
    
    // UPDATE
    public Utilisateur mettreAJourUtilisateur(Integer id, Utilisateur utilisateurMisAJour) {
        Optional<Utilisateur> utilisateurExistant = utilisateurRepository.findById(id);
        
        if (utilisateurExistant.isPresent()) {
            Utilisateur utilisateur = utilisateurExistant.get();
            
            if (utilisateurMisAJour.getNom() != null) {
                utilisateur.setNom(utilisateurMisAJour.getNom());
            }
            if (utilisateurMisAJour.getPrenom() != null) {
                utilisateur.setPrenom(utilisateurMisAJour.getPrenom());
            }
            if (utilisateurMisAJour.getEmail() != null) {
                utilisateur.setEmail(utilisateurMisAJour.getEmail());
            }
            if (utilisateurMisAJour.getMotDePasse() != null) {
                utilisateur.setMotDePasse(utilisateurMisAJour.getMotDePasse());
            }
            if (utilisateurMisAJour.getTelephone() != null) {
                utilisateur.setTelephone(utilisateurMisAJour.getTelephone());
            }
            if (utilisateurMisAJour.getTypeUtilisateur() != null) {
                utilisateur.setTypeUtilisateur(utilisateurMisAJour.getTypeUtilisateur());
            }
            
            return utilisateurRepository.save(utilisateur);
        }
        
        return null;
    }
    
    // DELETE
    public boolean supprimerUtilisateur(Integer id) {
        if (utilisateurRepository.existsById(id)) {
            utilisateurRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // UTILITY
    public boolean emailExiste(String email) {
        return utilisateurRepository.existsByEmail(email);
    }
}
