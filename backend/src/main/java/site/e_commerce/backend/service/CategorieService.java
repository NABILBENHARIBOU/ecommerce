package site.e_commerce.backend.service;

import site.e_commerce.backend.model.Categorie;
import site.e_commerce.backend.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieService {
    
    @Autowired
    private CategorieRepository categorieRepository;
    
    public Categorie creerCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }
    
    public Optional<Categorie> obtenirCategorieParId(Integer id) {
        return categorieRepository.findById(id);
    }
    
    public List<Categorie> obtenirToutesLesCategories() {
        return categorieRepository.findAll();
    }
    
    public Optional<Categorie> obtenirCategorieParNom(String nom) {
        return categorieRepository.findByNom(nom);
    }
    
    public Categorie mettreAJourCategorie(Integer id, Categorie categorieMisAJour) {
        Optional<Categorie> categorieExistante = categorieRepository.findById(id);
        
        if (categorieExistante.isPresent()) {
            Categorie categorie = categorieExistante.get();
            if (categorieMisAJour.getNom() != null) {
                categorie.setNom(categorieMisAJour.getNom());
            }
            return categorieRepository.save(categorie);
        }
        return null;
    }
    
    public boolean supprimerCategorie(Integer id) {
        if (categorieRepository.existsById(id)) {
            categorieRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
