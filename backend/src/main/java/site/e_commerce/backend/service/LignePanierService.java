package site.e_commerce.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Spring obligatoire

import site.e_commerce.backend.model.LignePanier;
import site.e_commerce.backend.repository.LignePanierRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // Par défaut, tout est en lecture seule (optimisation)
public class LignePanierService {

    @Autowired
    private LignePanierRepository lignePanierRepository;

    @Transactional // On surcharge pour autoriser l'écriture
    public LignePanier creerLignePanier(LignePanier lignePanier) {
        return lignePanierRepository.save(lignePanier);
    }

    public Optional<LignePanier> obtenirLigneParId(Integer id) {
        return lignePanierRepository.findById(id);
    }

    public List<LignePanier> obtenirToutesLesLignes() {
        return lignePanierRepository.findAll();
    }

    @Transactional
    public void supprimerLigne(Integer id) {
        lignePanierRepository.deleteById(id);
    }

    @Transactional
    public void supprimerLignesParPanier(Integer idPanier) {
        // Cette méthode va maintenant fonctionner car elle appelle le repository 
        // qui est lui-même annoté @Modifying et @Transactional
        lignePanierRepository.deleteByPanier_IdPanier(idPanier);
    }
}