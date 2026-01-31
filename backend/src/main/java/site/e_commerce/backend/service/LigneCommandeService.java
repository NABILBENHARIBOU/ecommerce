package site.e_commerce.backend.service;

import site.e_commerce.backend.model.LigneCommande;
import site.e_commerce.backend.repository.LigneCommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LigneCommandeService {
    
    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;
    
    public LigneCommande creerLigneCommande(LigneCommande ligneCommande) {
        return ligneCommandeRepository.save(ligneCommande);
    }
    
    public Optional<LigneCommande> obtenirLigneCommandeParId(Integer id) {
        return ligneCommandeRepository.findById(id);
    }
    
    public List<LigneCommande> obtenirToutesLesLignesCommande() {
        return ligneCommandeRepository.findAll();
    }
    
    public List<LigneCommande> obtenirLignesCommandeParCommande(Integer idCommande) {
        return ligneCommandeRepository.findByCommande_IdCommande(idCommande);
    }
    
    public LigneCommande mettreAJourLigneCommande(Integer id, LigneCommande ligneCommandeMisAJour) {
        Optional<LigneCommande> ligneCommandeExistante = ligneCommandeRepository.findById(id);
        
        if (ligneCommandeExistante.isPresent()) {
            LigneCommande ligneCommande = ligneCommandeExistante.get();
            if (ligneCommandeMisAJour.getQuantite() != null) ligneCommande.setQuantite(ligneCommandeMisAJour.getQuantite());
            if (ligneCommandeMisAJour.getPrixUnitaire() != null) ligneCommande.setPrixUnitaire(ligneCommandeMisAJour.getPrixUnitaire());
            
            return ligneCommandeRepository.save(ligneCommande);
        }
        return null;
    }
    
    public boolean supprimerLigneCommande(Integer id) {
        if (ligneCommandeRepository.existsById(id)) {
            ligneCommandeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
