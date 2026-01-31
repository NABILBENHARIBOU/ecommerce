package site.e_commerce.backend.service;

import site.e_commerce.backend.model.Panier;
import site.e_commerce.backend.repository.PanierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PanierService {
    
    @Autowired
    private PanierRepository panierRepository;
    
    public Panier creerPanier(Panier panier) {
        return panierRepository.save(panier);
    }
    
    public Optional<Panier> obtenirPanierParId(Integer id) {
        return panierRepository.findById(id);
    }
    
    public List<Panier> obtenirTousLesPaniers() {
        return panierRepository.findAll();
    }
    
    public Optional<Panier> obtenirPanierParUtilisateur(Integer idUtilisateur) {
        return panierRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);
    }
    
    public Panier mettreAJourPanier(Integer id, Panier panierMisAJour) {
        Optional<Panier> panierExistant = panierRepository.findById(id);
        
        if (panierExistant.isPresent()) {
            Panier panier = panierExistant.get();
            if (panierMisAJour.getProduits() != null) {
                panier.setProduits(panierMisAJour.getProduits());
            }
            
            return panierRepository.save(panier);
        }
        return null;
    }
    
    public boolean supprimerPanier(Integer id) {
        if (panierRepository.existsById(id)) {
            panierRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
