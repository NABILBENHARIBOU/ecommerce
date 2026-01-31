package site.e_commerce.backend.service;

import site.e_commerce.backend.model.Produit;
import site.e_commerce.backend.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {
    
    @Autowired
    private ProduitRepository produitRepository;
    
    public Produit creerProduit(Produit produit) {
        return produitRepository.save(produit);
    }
    
    public Optional<Produit> obtenirProduitParId(Integer id) {
        return produitRepository.findById(id);
    }
    
    public List<Produit> obtenirTousLesProduits() {
        try {
            List<Produit> produits = produitRepository.findAll();
            // Fallback: si une image est manquante, renvoyer une image par défaut
            produits.forEach(p -> {
                if (p.getImageUrl() == null || p.getImageUrl().trim().isEmpty()) {
                    p.setImageUrl("/uploads/1763368669820-iaas.jpg");
                }
            });
            return produits;
        } catch (Exception e) {
            System.err.println("❌ Erreur dans ProduitService.obtenirTousLesProduits():");
            e.printStackTrace();
            throw e;
        }
    }
    
    public Optional<Produit> obtenirProduitParNom(String nom) {
        return produitRepository.findByNom(nom);
    }
    
    public List<Produit> obtenirProduitsEnStock() {
        return produitRepository.findByStockGreaterThan(0);
    }
    
    public Produit mettreAJourProduit(Integer id, Produit produitMisAJour) {
        Optional<Produit> produitExistant = produitRepository.findById(id);
        
        if (produitExistant.isPresent()) {
            Produit produit = produitExistant.get();
            if (produitMisAJour.getNom() != null) produit.setNom(produitMisAJour.getNom());
            if (produitMisAJour.getDescription() != null) produit.setDescription(produitMisAJour.getDescription());
            if (produitMisAJour.getPrix() != null) produit.setPrix(produitMisAJour.getPrix());
            if (produitMisAJour.getStock() != null) produit.setStock(produitMisAJour.getStock());
            if (produitMisAJour.getImageUrl() != null) produit.setImageUrl(produitMisAJour.getImageUrl());
            if (produitMisAJour.getCategories() != null) produit.setCategories(produitMisAJour.getCategories());
            
            return produitRepository.save(produit);
        }
        return null;
    }
    
    public boolean supprimerProduit(Integer id) {
        if (produitRepository.existsById(id)) {
            produitRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
