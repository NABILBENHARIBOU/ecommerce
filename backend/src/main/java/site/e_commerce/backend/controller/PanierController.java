package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.Panier;
import site.e_commerce.backend.service.PanierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paniers")
public class PanierController {
    
    @Autowired
    private PanierService panierService;
    
    // CREATE - POST
    @PostMapping
    public ResponseEntity<Panier> creerPanier(@RequestBody Panier panier) {
        Panier nouveauPanier = panierService.creerPanier(panier);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveauPanier);
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<Panier>> obtenirTousLesPaniers() {
        List<Panier> paniers = panierService.obtenirTousLesPaniers();
        return ResponseEntity.ok(paniers);
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Panier> obtenirPanierParId(@PathVariable Integer id) {
        Optional<Panier> panier = panierService.obtenirPanierParId(id);
        
        if (panier.isPresent()) {
            return ResponseEntity.ok(panier.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public ResponseEntity<Panier> obtenirPanierParUtilisateur(@PathVariable Integer idUtilisateur) {
        Optional<Panier> panier = panierService.obtenirPanierParUtilisateur(idUtilisateur);
        
        if (panier.isPresent()) {
            return ResponseEntity.ok(panier.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // UPDATE - PUT
    @PutMapping("/{id}")
    public ResponseEntity<Panier> mettreAJourPanier(@PathVariable Integer id, @RequestBody Panier panier) {
        Panier panierMisAJour = panierService.mettreAJourPanier(id, panier);
        
        if (panierMisAJour != null) {
            return ResponseEntity.ok(panierMisAJour);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // DELETE - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerPanier(@PathVariable Integer id) {
        boolean supprime = panierService.supprimerPanier(id);
        
        if (supprime) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
