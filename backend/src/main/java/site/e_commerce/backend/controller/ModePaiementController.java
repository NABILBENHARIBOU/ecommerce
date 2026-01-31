package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.ModePaiement;
import site.e_commerce.backend.service.ModePaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/modes-paiement")
public class ModePaiementController {

    @Autowired
    private ModePaiementService modePaiementService;

    /**
     * CREATE - POST
     */
    @PostMapping
    public ResponseEntity<ModePaiement> creerModePaiement(@RequestBody ModePaiement modePaiement) {
        ModePaiement nouveauModePaiement = modePaiementService.creerModePaiement(modePaiement);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveauModePaiement);
    }

    /**
     * READ - GET ALL
     */
    @GetMapping
    public ResponseEntity<List<ModePaiement>> obtenirTousLesModePaiement() {
        System.out.println("\n🔵 [ModePaiementController] - Requête reçue: GET /api/modes-paiement");
        List<ModePaiement> modePaiements = modePaiementService.obtenirTousLesModePaiement();
        System.out.println("🟢 [ModePaiementController] - Réponse: " + modePaiements.size() + " modes retournés\n");
        return ResponseEntity.ok(modePaiements);
    }

    /**
     * READ - GET BY ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ModePaiement> obtenirModePaiementParId(@PathVariable Integer id) {
        Optional<ModePaiement> modePaiement = modePaiementService.obtenirModePaiementParId(id);

        if (modePaiement.isPresent()) {
            return ResponseEntity.ok(modePaiement.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * READ - GET BY LIBELLE
     */
    @GetMapping("/libelle/{libelle}")
    public ResponseEntity<ModePaiement> obtenirModePaiementParLibelle(@PathVariable String libelle) {
        Optional<ModePaiement> modePaiement = modePaiementService.obtenirModePaiementParLibelle(libelle);

        if (modePaiement.isPresent()) {
            return ResponseEntity.ok(modePaiement.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * UPDATE - PUT
     */
    @PutMapping("/{id}")
    public ResponseEntity<ModePaiement> mettreAJourModePaiement(
            @PathVariable Integer id,
            @RequestBody ModePaiement modePaiement) {
        ModePaiement modePaiementMisAJour = modePaiementService.mettreAJourModePaiement(id, modePaiement);

        if (modePaiementMisAJour != null) {
            return ResponseEntity.ok(modePaiementMisAJour);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * DELETE
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerModePaiement(@PathVariable Integer id) {
        Optional<ModePaiement> modePaiement = modePaiementService.obtenirModePaiementParId(id);

        if (modePaiement.isPresent()) {
            modePaiementService.supprimerModePaiement(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
