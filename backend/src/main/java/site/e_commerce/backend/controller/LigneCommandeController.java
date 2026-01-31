package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.LigneCommande;
import site.e_commerce.backend.service.LigneCommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lignes-commande")
public class LigneCommandeController {
    
    @Autowired
    private LigneCommandeService ligneCommandeService;
    
    // CREATE - POST
    @PostMapping
    public ResponseEntity<LigneCommande> creerLigneCommande(@RequestBody LigneCommande ligneCommande) {
        LigneCommande nouvelleLigneCommande = ligneCommandeService.creerLigneCommande(ligneCommande);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleLigneCommande);
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<LigneCommande>> obtenirToutesLesLignesCommande() {
        List<LigneCommande> lignesCommande = ligneCommandeService.obtenirToutesLesLignesCommande();
        return ResponseEntity.ok(lignesCommande);
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<LigneCommande> obtenirLigneCommandeParId(@PathVariable Integer id) {
        Optional<LigneCommande> ligneCommande = ligneCommandeService.obtenirLigneCommandeParId(id);
        
        if (ligneCommande.isPresent()) {
            return ResponseEntity.ok(ligneCommande.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY COMMANDE
    @GetMapping("/commande/{idCommande}")
    public ResponseEntity<List<LigneCommande>> obtenirLignesCommandeParCommande(@PathVariable Integer idCommande) {
        List<LigneCommande> lignesCommande = ligneCommandeService.obtenirLignesCommandeParCommande(idCommande);
        return ResponseEntity.ok(lignesCommande);
    }
    
    // UPDATE - PUT
    @PutMapping("/{id}")
    public ResponseEntity<LigneCommande> mettreAJourLigneCommande(@PathVariable Integer id, @RequestBody LigneCommande ligneCommande) {
        LigneCommande ligneCommandeMisAJour = ligneCommandeService.mettreAJourLigneCommande(id, ligneCommande);
        
        if (ligneCommandeMisAJour != null) {
            return ResponseEntity.ok(ligneCommandeMisAJour);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // DELETE - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerLigneCommande(@PathVariable Integer id) {
        boolean supprime = ligneCommandeService.supprimerLigneCommande(id);
        
        if (supprime) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
