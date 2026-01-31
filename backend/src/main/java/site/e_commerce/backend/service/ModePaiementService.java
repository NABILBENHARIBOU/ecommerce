package site.e_commerce.backend.service;

import site.e_commerce.backend.model.ModePaiement;
import site.e_commerce.backend.repository.ModePaiementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModePaiementService {

    @Autowired
    private ModePaiementRepository modePaiementRepository;

    /**
     * Créer un nouveau mode de paiement
     */
    public ModePaiement creerModePaiement(ModePaiement modePaiement) {
        return modePaiementRepository.save(modePaiement);
    }

    /**
     * Récupérer tous les modes de paiement
     */
    public List<ModePaiement> obtenirTousLesModePaiement() {
        System.out.println("\n========== AFFICHAGE DES MODES DE PAIEMENT ==========");
        List<ModePaiement> modes = modePaiementRepository.findAllModePaiement();
        System.out.println("✓ Total de modes trouvés: " + modes.size());
        
        if (modes.isEmpty()) {
            System.out.println("⚠️ AUCUN MODE DE PAIEMENT TROUVÉ!");
        } else {
            System.out.println("\n--- Détail des modes: ---");
            for (ModePaiement mode : modes) {
                System.out.println("  ID: " + mode.getIdMode() + " | Libelle: " + mode.getLibelle());
            }
        }
        System.out.println("====================================================\n");
        return modes;
    }

    /**
     * Récupérer un mode de paiement par ID
     */
    public Optional<ModePaiement> obtenirModePaiementParId(Integer id) {
        return modePaiementRepository.findById(id);
    }

    /**
     * Récupérer un mode de paiement par libellé
     */
    public Optional<ModePaiement> obtenirModePaiementParLibelle(String libelle) {
        return modePaiementRepository.findByLibelle(libelle);
    }

    /**
     * Mettre à jour un mode de paiement
     */
    public ModePaiement mettreAJourModePaiement(Integer id, ModePaiement modePaiement) {
        Optional<ModePaiement> existant = modePaiementRepository.findById(id);
        if (existant.isPresent()) {
            ModePaiement mp = existant.get();
            if (modePaiement.getLibelle() != null) {
                mp.setLibelle(modePaiement.getLibelle());
            }
            return modePaiementRepository.save(mp);
        }
        return null;
    }

    /**
     * Supprimer un mode de paiement
     */
    public void supprimerModePaiement(Integer id) {
        modePaiementRepository.deleteById(id);
    }
}
