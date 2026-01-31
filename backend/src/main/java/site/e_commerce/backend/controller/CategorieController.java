package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.Categorie;
import site.e_commerce.backend.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {
    
    @Autowired
    private CategorieService categorieService;
    
    // Vérifier si l'utilisateur est admin via le header
    private boolean estAdmin(String idTypeHeader) {
        if (idTypeHeader == null || idTypeHeader.trim().isEmpty()) {
            return false;
        }
        try {
            Integer idType = Integer.parseInt(idTypeHeader.trim());
            return idType == 2; // 2 = Admin
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    // CREATE - POST (Admin uniquement)
    @PostMapping
    public ResponseEntity<?> creerCategorie(@RequestBody Categorie categorie, 
                                            @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Accès refusé. Seul un administrateur peut créer des catégories."));
        }
        
        if (categorie == null || categorie.getNom() == null || categorie.getNom().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Le nom de la catégorie est requis."));
        }
        
        Categorie nouvelleCategorie = categorieService.creerCategorie(categorie);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleCategorie);
    }
    
    // READ - GET ALL (Public)
    @GetMapping
    public ResponseEntity<List<Categorie>> obtenirToutesLesCategories() {
        List<Categorie> categories = categorieService.obtenirToutesLesCategories();
        return ResponseEntity.ok(categories);
    }
    
    // READ - GET BY ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<Categorie> obtenirCategorieParId(@PathVariable Integer id) {
        Optional<Categorie> categorie = categorieService.obtenirCategorieParId(id);
        
        if (categorie.isPresent()) {
            return ResponseEntity.ok(categorie.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY NOM (Public)
    @GetMapping("/nom/{nom}")
    public ResponseEntity<Categorie> obtenirCategorieParNom(@PathVariable String nom) {
        Optional<Categorie> categorie = categorieService.obtenirCategorieParNom(nom);
        
        if (categorie.isPresent()) {
            return ResponseEntity.ok(categorie.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // UPDATE - PUT (Admin uniquement)
    @PutMapping("/{id}")
    public ResponseEntity<?> mettreAJourCategorie(@PathVariable Integer id, 
                                                   @RequestBody Categorie categorie,
                                                   @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Accès refusé. Seul un administrateur peut modifier des catégories."));
        }
        
        if (categorie == null || categorie.getNom() == null || categorie.getNom().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Le nom de la catégorie est requis."));
        }
        
        Categorie categorieMisAJour = categorieService.mettreAJourCategorie(id, categorie);
        
        if (categorieMisAJour != null) {
            return ResponseEntity.ok(categorieMisAJour);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "Catégorie non trouvée."));
    }
    
    // DELETE - DELETE (Admin uniquement)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerCategorie(@PathVariable Integer id,
                                                 @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Accès refusé. Seul un administrateur peut supprimer des catégories."));
        }
        
        boolean supprime = categorieService.supprimerCategorie(id);
        
        if (supprime) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "Catégorie non trouvée."));
    }
}
