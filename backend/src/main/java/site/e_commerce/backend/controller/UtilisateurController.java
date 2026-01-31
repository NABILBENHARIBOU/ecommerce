package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.Utilisateur;
import site.e_commerce.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")

public class UtilisateurController {
    
    @Autowired
    private UtilisateurService utilisateurService;
    
    // CREATE - POST
    @PostMapping
    public ResponseEntity<Utilisateur> creerUtilisateur(@RequestBody Utilisateur utilisateur) {
        if (utilisateurService.emailExiste(utilisateur.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        Utilisateur nouvelUtilisateur = utilisateurService.creerUtilisateur(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelUtilisateur);
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<Utilisateur>> obtenirTousLesUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.obtenirTousLesUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> obtenirUtilisateurParId(@PathVariable Integer id) {
        Optional<Utilisateur> utilisateur = utilisateurService.obtenirUtilisateurParId(id);
        
        if (utilisateur.isPresent()) {
            return ResponseEntity.ok(utilisateur.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY EMAIL
    @GetMapping("/email/{email}")
    public ResponseEntity<Utilisateur> obtenirUtilisateurParEmail(@PathVariable String email) {
        Optional<Utilisateur> utilisateur = utilisateurService.obtenirUtilisateurParEmail(email);
        
        if (utilisateur.isPresent()) {
            return ResponseEntity.ok(utilisateur.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // UPDATE - PUT
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> mettreAJourUtilisateur(@PathVariable Integer id, @RequestBody Utilisateur utilisateur) {
        Utilisateur utilisateurMisAJour = utilisateurService.mettreAJourUtilisateur(id, utilisateur);
        
        if (utilisateurMisAJour != null) {
            return ResponseEntity.ok(utilisateurMisAJour);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // DELETE - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Integer id) {
        boolean supprime = utilisateurService.supprimerUtilisateur(id);
        
        if (supprime) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
