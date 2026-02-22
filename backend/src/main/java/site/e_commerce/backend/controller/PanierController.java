package site.e_commerce.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import site.e_commerce.backend.dto.LignePanierDTO;
import site.e_commerce.backend.dto.PanierDTO;
import site.e_commerce.backend.model.LignePanier;
import site.e_commerce.backend.model.Panier;
import site.e_commerce.backend.model.Produit;
import site.e_commerce.backend.repository.ProduitRepository;
import site.e_commerce.backend.security.JwtProvider;
import site.e_commerce.backend.service.LignePanierService;
import site.e_commerce.backend.service.PanierService;
import site.e_commerce.backend.service.UtilisateurService;

@RestController
@RequestMapping("/api/paniers")
public class PanierController {

    @Autowired
    private PanierService panierService;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private LignePanierService lignePanierService;

    // CREATE - POST
    @PostMapping
    public ResponseEntity<Panier> creerPanier(@Validated @RequestBody Panier panier) {
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
        return panier.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // READ - GET BY UTILISATEUR (sécurisé)
    @GetMapping("/utilisateur/me")
    public ResponseEntity<Panier> obtenirMonPanier(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtProvider.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<site.e_commerce.backend.model.Utilisateur> utilisateurOpt =
                utilisateurService.obtenirUtilisateurParEmail(email);
        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer idUtilisateur = utilisateurOpt.get().getIdUtilisateur();
        Optional<Panier> panier = panierService.obtenirPanierParUtilisateur(idUtilisateur);
        return panier.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // READ - GET BY UTILISATEUR (sécurisé) - DTO
    @GetMapping("/utilisateur/me/dto")
    public ResponseEntity<PanierDTO> getMonPanierDTO(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtProvider.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<site.e_commerce.backend.model.Utilisateur> utilisateurOpt =
                utilisateurService.obtenirUtilisateurParEmail(email);
        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer idUtilisateur = utilisateurOpt.get().getIdUtilisateur();
        Optional<Panier> panierOpt = panierService.obtenirPanierParUtilisateur(idUtilisateur);
        if (panierOpt.isEmpty()) return ResponseEntity.notFound().build();
        Panier panier = panierOpt.get();
        List<LignePanierDTO> lignes = panier.getLignesPanier().stream()
            .map(lp -> new LignePanierDTO(lp.getProduit().getIdProduit(), lp.getQuantite()))
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(new PanierDTO(panier.getIdPanier(), lignes));
    }

    // AJOUTER UN PRODUIT AU PANIER DU CONNECTÉ (POST /me/produits)
    @PostMapping("/me/produits")
    public ResponseEntity<Panier> ajouterProduitAuPanier(HttpServletRequest request, @RequestBody Produit produit) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtProvider.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<site.e_commerce.backend.model.Utilisateur> utilisateurOpt = utilisateurService.obtenirUtilisateurParEmail(email);
        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer idUtilisateur = utilisateurOpt.get().getIdUtilisateur();
        Optional<Panier> panierOpt = panierService.obtenirPanierParUtilisateur(idUtilisateur);
        if (panierOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Panier panierExistant = panierOpt.get();

        if (produit.getIdProduit() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Produit> produitOpt = produitRepository.findById(produit.getIdProduit());
        if (produitOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Produit produitEntity = produitOpt.get();

        LignePanier ligne = new LignePanier();
        ligne.setPanier(panierExistant);
        ligne.setProduit(produitEntity);
        ligne.setQuantite(1);
        lignePanierService.creerLignePanier(ligne);

        Panier panierMisAJour = panierService.obtenirPanierParId(panierExistant.getIdPanier()).orElse(panierExistant);
        return ResponseEntity.ok(panierMisAJour);
    }

    // UPDATE - PUT by connected user (compatibilité avec l'ancien format)
    @PutMapping("/me")
    public ResponseEntity<?> mettreAJourMonPanier(HttpServletRequest request, @Validated @RequestBody Panier panier) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtProvider.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<site.e_commerce.backend.model.Utilisateur> utilisateurOpt =
                utilisateurService.obtenirUtilisateurParEmail(email);
        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer idUtilisateur = utilisateurOpt.get().getIdUtilisateur();
        Optional<Panier> panierOpt = panierService.obtenirPanierParUtilisateur(idUtilisateur);
        if (panierOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Panier panierExistant = panierOpt.get();

        // Convertir l'ancien format (liste de produits) en PanierDTO
        List<LignePanierDTO> lignesDTO = new ArrayList<>();
        if (panier.getProduits() != null) {
            for (Produit p : panier.getProduits()) {
                // On suppose que le produit contient une quantité (champ "quantity" ou "quantite")

            }
        }
        PanierDTO panierDTO = new PanierDTO(panierExistant.getIdPanier(), lignesDTO);

        // Supprimer les anciennes lignes
        lignePanierService.supprimerLignesParPanier(panierExistant.getIdPanier());

        // Ajouter les nouvelles lignes
        for (LignePanierDTO ligneDTO : panierDTO.getLignesPanier()) {
            Optional<Produit> produitOpt = produitRepository.findById(ligneDTO.getIdProduit());
            if (produitOpt.isPresent()) {
                LignePanier ligne = new LignePanier();
                ligne.setPanier(panierExistant);
                ligne.setProduit(produitOpt.get());
                ligne.setQuantite(ligneDTO.getQuantite());
                lignePanierService.creerLignePanier(ligne);
            }
        }

        return ResponseEntity.ok().build();
    }

    // UPDATE - PUT by ID (admin)
    @PutMapping("/{id}")
    public ResponseEntity<Panier> mettreAJourPanier(@PathVariable Integer id, @Validated @RequestBody Panier panier) {
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

    @GetMapping("/{id}/dto")
    public ResponseEntity<PanierDTO> getPanierDTO(@PathVariable Integer id) {
        Optional<Panier> panierOpt = panierService.obtenirPanierParId(id);
        if (panierOpt.isEmpty()) return ResponseEntity.notFound().build();
        Panier panier = panierOpt.get();
        List<LignePanierDTO> lignes = panier.getLignesPanier().stream()
            .map(lp -> new LignePanierDTO(lp.getProduit().getIdProduit(), lp.getQuantite()))
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(new PanierDTO(panier.getIdPanier(), lignes));
    }

    @PostMapping("/{id}/ajouter")
    public ResponseEntity<?> ajouterProduit(@PathVariable Integer id, @RequestBody LignePanierDTO dto) {
        Optional<Panier> panierOpt = panierService.obtenirPanierParId(id);
        Optional<Produit> produitOpt = produitRepository.findById(dto.getIdProduit());
        if (panierOpt.isEmpty() || produitOpt.isEmpty()) return ResponseEntity.badRequest().build();
        Panier panier = panierOpt.get();
        Produit produit = produitOpt.get();
        LignePanier ligne = new LignePanier();
        ligne.setPanier(panier);
        ligne.setProduit(produit);
        ligne.setQuantite(dto.getQuantite());
        lignePanierService.creerLignePanier(ligne);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/me/dto")
    public ResponseEntity<?> mettreAJourMonPanierDTO(HttpServletRequest request, @RequestBody PanierDTO panierDTO) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtProvider.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<site.e_commerce.backend.model.Utilisateur> utilisateurOpt =
                utilisateurService.obtenirUtilisateurParEmail(email);
        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer idUtilisateur = utilisateurOpt.get().getIdUtilisateur();
        Optional<Panier> panierOpt = panierService.obtenirPanierParUtilisateur(idUtilisateur);
        if (panierOpt.isEmpty()) return ResponseEntity.notFound().build();
        Panier panier = panierOpt.get();

        lignePanierService.supprimerLignesParPanier(panier.getIdPanier());

        if (panierDTO.getLignesPanier() != null) {
            for (LignePanierDTO ligneDTO : panierDTO.getLignesPanier()) {
                Optional<Produit> produitOpt = produitRepository.findById(ligneDTO.getIdProduit());
                if (produitOpt.isPresent()) {
                    LignePanier ligne = new LignePanier();
                    ligne.setPanier(panier);
                    ligne.setProduit(produitOpt.get());
                    ligne.setQuantite(ligneDTO.getQuantite());
                    lignePanierService.creerLignePanier(ligne);
                }
            }
        }

        return ResponseEntity.ok().build();
    }
}