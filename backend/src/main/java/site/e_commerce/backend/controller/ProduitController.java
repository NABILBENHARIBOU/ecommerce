package site.e_commerce.backend.controller;

import site.e_commerce.backend.model.Produit;
import site.e_commerce.backend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.io.IOException;

@RestController
@RequestMapping("/api/produits")
// @CrossOrigin(origins = "*") // supprimé pour éviter le conflit avec allowCredentials
public class ProduitController {
    
    @Autowired
    private ProduitService produitService;
    
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
    public ResponseEntity<?> creerProduit(@RequestBody Produit produit,
                                         @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(java.util.Map.of("error", "Accès refusé. Seul un administrateur peut créer des produits."));
        }
        
        // Validation basique avant de tenter la conversion/sauvegarde
        if (produit == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Corps de la requête manquant"));
        }
        if (produit.getNom() == null || produit.getNom().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Le champ 'nom' est requis"));
        }
        if (produit.getPrix() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Le champ 'prix' est requis"));
        }
        if (produit.getStock() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Le champ 'stock' est requis"));
        }

        try {
            Produit nouveauProduit = produitService.creerProduit(produit);
            return ResponseEntity.status(HttpStatus.CREATED).body(nouveauProduit);
        } catch (Exception e) {
            // Log complet côté serveur pour diagnostic
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    java.util.Map.of("error", e.getMessage(), "exception", e.getClass().getName())
            );
        }
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<?> obtenirTousLesProduits() {
        try {
            System.out.println("\n========== RÉCUPÉRER TOUS LES PRODUITS ==========");
            List<Produit> produits = produitService.obtenirTousLesProduits();
            System.out.println("✅ Nombre de produits trouvés: " + produits.size());
            if (!produits.isEmpty()) {
                System.out.println("📦 Détails des produits:");
                produits.forEach(p -> 
                    System.out.println("  - ID: " + p.getIdProduit() + " | Nom: " + p.getNom() + " | Prix: " + p.getPrix() + " | Stock: " + p.getStock())
                );
            } else {
                System.out.println("⚠️  Aucun produit trouvé dans la base de données");
            }
            System.out.println("==============================================\n");
            return ResponseEntity.ok(produits);
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des produits:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of(
                    "error", "Erreur serveur lors de la récupération des produits",
                    "message", e.getMessage(),
                    "cause", e.getCause() != null ? e.getCause().getMessage() : "Cause inconnue"
                ));
        }
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Produit> obtenirProduitParId(@PathVariable Integer id) {
        Optional<Produit> produit = produitService.obtenirProduitParId(id);
        
        if (produit.isPresent()) {
            return ResponseEntity.ok(produit.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY NOM
    @GetMapping("/nom/{nom}")
    public ResponseEntity<Produit> obtenirProduitParNom(@PathVariable String nom) {
        Optional<Produit> produit = produitService.obtenirProduitParNom(nom);
        
        if (produit.isPresent()) {
            return ResponseEntity.ok(produit.get());
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET PRODUITS EN STOCK
    @GetMapping("/stock/disponibles")
    public ResponseEntity<List<Produit>> obtenirProduitsEnStock() {
        List<Produit> produits = produitService.obtenirProduitsEnStock();
        return ResponseEntity.ok(produits);
    }
    
    // UPDATE - PUT
    // UPDATE - PUT (Admin uniquement)
    @PutMapping("/{id}")
    public ResponseEntity<?> mettreAJourProduit(@PathVariable Integer id, @RequestBody Produit produit,
                                               @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(java.util.Map.of("error", "Accès refusé. Seul un administrateur peut modifier des produits."));
        }
        
        Produit produitMisAJour = produitService.mettreAJourProduit(id, produit);
        
        if (produitMisAJour != null) {
            return ResponseEntity.ok(produitMisAJour);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(java.util.Map.of("error", "Produit non trouvé."));
    }
    
    // DELETE - DELETE (Admin uniquement)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerProduit(@PathVariable Integer id,
                                             @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(java.util.Map.of("error", "Accès refusé. Seul un administrateur peut supprimer des produits."));
        }
        
        boolean supprime = produitService.supprimerProduit(id);
        
        if (supprime) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(java.util.Map.of("error", "Produit non trouvé."));
    }

    // Upload product image (Admin uniquement)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file,
                                        @RequestHeader(value = "X-User-Type", required = false) String idTypeHeader) {
        if (!estAdmin(idTypeHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(java.util.Map.of("error", "Accès refusé. Seul un administrateur peut télécharger des images."));
        }
        
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Fichier manquant"));
        }

        try {
            // ensure uploads directory exists
            Path uploadDir = Path.of("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String original = Path.of(file.getOriginalFilename()).getFileName().toString();
            String filename = System.currentTimeMillis() + "-" + original.replaceAll("\\s+", "_");
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/" + filename;
            return ResponseEntity.ok(java.util.Map.of("url", url));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
