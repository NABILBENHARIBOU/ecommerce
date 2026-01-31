package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.Adresse;
import site.e_commerce.backend.service.AdresseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adresses")
public class AdresseController {
    
    @Autowired
    private AdresseService adresseService;
    
    // CREATE - POST
    @PostMapping
    public ResponseEntity<Adresse> creerAdresse(@RequestBody Adresse adresse) {
        Adresse nouvelleAdresse = adresseService.creerAdresse(adresse);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleAdresse);
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<Adresse>> obtenirToutesLesAdresses() {
        List<Adresse> adresses = adresseService.obtenirToutesLesAdresses();
        return ResponseEntity.ok(adresses);
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Adresse> obtenirAdresseParId(@PathVariable Integer id) {
        Optional<Adresse> adresse = adresseService.obtenirAdresseParId(id);
        
        if (adresse.isPresent()) {
            return ResponseEntity.ok(adresse.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public ResponseEntity<List<Adresse>> obtenirAdressesParUtilisateur(@PathVariable Integer idUtilisateur) {
        List<Adresse> adresses = adresseService.obtenirAdressesParUtilisateur(idUtilisateur);
        return ResponseEntity.ok(adresses);
    }
    
    // UPDATE - PUT
    @PutMapping("/{id}")
    public ResponseEntity<Adresse> mettreAJourAdresse(@PathVariable Integer id, @RequestBody Adresse adresse) {
        Adresse adresseMisAJour = adresseService.mettreAJourAdresse(id, adresse);
        
        if (adresseMisAJour != null) {
            return ResponseEntity.ok(adresseMisAJour);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // DELETE - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAdresse(@PathVariable Integer id) {
        boolean supprime = adresseService.supprimerAdresse(id);
        
        if (supprime) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
