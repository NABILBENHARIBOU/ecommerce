package site.e_commerce.backend.controller;

import site.e_commerce.backend.dto.PaiementDTO;
import site.e_commerce.backend.model.Paiement;
import site.e_commerce.backend.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {
    
    @Autowired
    private PaiementService paiementService;
    
    // CREATE - POST (ancienne méthode)
    @PostMapping
    public ResponseEntity<Paiement> creerPaiement(@RequestBody Paiement paiement) {
        Paiement nouveauPaiement = paiementService.creerPaiement(paiement);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveauPaiement);
    }
    
    // CREATE - POST (nouvelle méthode avec automatisation du statut)
    @PostMapping("/commande/{idCommande}/mode/{idModePaiement}")
    public ResponseEntity<PaiementDTO> creerPaiementPourCommande(
            @PathVariable Integer idCommande,
            @PathVariable Integer idModePaiement) {
        try {
            Paiement paiement = paiementService.creerPaiement(idCommande, idModePaiement);
            PaiementDTO paiementDTO = paiementService.convertToDTO(paiement);
            return ResponseEntity.status(HttpStatus.CREATED).body(paiementDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<Paiement>> obtenirTousLesPaiements() {
        List<Paiement> paiements = paiementService.obtenirTousLesPaiements();
        return ResponseEntity.ok(paiements);
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PaiementDTO> obtenirPaiementParId(@PathVariable Integer id) {
        Optional<Paiement> paiement = paiementService.obtenirPaiementParId(id);
        
        if (paiement.isPresent()) {
            PaiementDTO paiementDTO = paiementService.convertToDTO(paiement.get());
            return ResponseEntity.ok(paiementDTO);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY COMMANDE
    @GetMapping("/commande/{idCommande}")
    public ResponseEntity<PaiementDTO> obtenirPaiementParCommande(@PathVariable Integer idCommande) {
        Optional<Paiement> paiement = paiementService.obtenirPaiementParCommande(idCommande);
        
        if (paiement.isPresent()) {
            PaiementDTO paiementDTO = paiementService.convertToDTO(paiement.get());
            return ResponseEntity.ok(paiementDTO);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // UPDATE - PUT
    @PutMapping("/{id}")
    public ResponseEntity<PaiementDTO> mettreAJourPaiement(@PathVariable Integer id, @RequestBody Paiement paiement) {
        Paiement paiementMisAJour = paiementService.mettreAJourPaiement(id, paiement);
        
        if (paiementMisAJour != null) {
            PaiementDTO paiementDTO = paiementService.convertToDTO(paiementMisAJour);
            return ResponseEntity.ok(paiementDTO);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // DELETE - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> supprimerPaiement(@PathVariable Integer id) {
        boolean supprime = paiementService.supprimerPaiement(id);
        
        Map<String, String> response = new HashMap<>();
        if (supprime) {
            response.put("message", "Paiement supprimé avec succès");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        response.put("message", "Paiement non trouvé");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
