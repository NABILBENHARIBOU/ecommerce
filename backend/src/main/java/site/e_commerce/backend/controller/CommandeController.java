package site.e_commerce.backend.controller;

import site.e_commerce.backend.dto.CommandeDTO;
import site.e_commerce.backend.dto.CreateCommandeDTO;
import site.e_commerce.backend.model.Commande;
import site.e_commerce.backend.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    
    @Autowired
    private CommandeService commandeService;
    
    // CREATE - POST (ancienne méthode)
    @PostMapping
    public ResponseEntity<Commande> creerCommande(@RequestBody Commande commande) {
        Commande nouvelleCommande = commandeService.creerCommande(commande);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleCommande);
    }
    
    // CREATE - POST (nouvelle méthode avec DTO depuis panier)
    @PostMapping("/creer")
    public ResponseEntity<CommandeDTO> creerCommandeDepuisParnier(@RequestBody CreateCommandeDTO createCommandeDTO) {
        try {
            System.out.println("\n========== CRÉER COMMANDE DEPUIS PANIER ==========");
            System.out.println("📋 Données reçues:");
            System.out.println("  👤 ID Utilisateur: " + createCommandeDTO.getIdUtilisateur());
            System.out.println("  📍 ID Adresse: " + createCommandeDTO.getIdAdresse());
            System.out.println("  💰 Total: " + createCommandeDTO.getTotal());
            System.out.println("  🛒 Nombre d'articles: " + (createCommandeDTO.getLignesCommande() != null ? createCommandeDTO.getLignesCommande().size() : 0));
            if (createCommandeDTO.getLignesCommande() != null) {
                createCommandeDTO.getLignesCommande().forEach(ligne ->
                    System.out.println("    - Produit " + ligne.getIdProduit() + ": " + ligne.getQuantite() + "x @ " + ligne.getPrixUnitaire() + "€")
                );
            }
            
            Commande nouvelleCommande = commandeService.creerCommande(createCommandeDTO);
            System.out.println("✅ Commande créée avec ID: " + nouvelleCommande.getIdCommande());
            
            CommandeDTO commandeDTO = commandeService.convertToDTO(nouvelleCommande);
            System.out.println("✓ Conversion en DTO effectuée");
            System.out.println("================================================\n");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(commandeDTO);
        } catch (RuntimeException e) {
            System.out.println("❌ Erreur lors de la création de la commande: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<CommandeDTO>> obtenirToutesLesCommandes() {
        List<Commande> commandes = commandeService.obtenirToutesLesCommandes();
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }
    
    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CommandeDTO> obtenirCommandeParId(@PathVariable Integer id) {
        Optional<Commande> commande = commandeService.obtenirCommandeParId(id);
        
        if (commande.isPresent()) {
            CommandeDTO commandeDTO = commandeService.convertToDTO(commande.get());
            return ResponseEntity.ok(commandeDTO);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // READ - GET BY UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public ResponseEntity<List<CommandeDTO>> obtenirCommandesParUtilisateur(@PathVariable Integer idUtilisateur) {
        List<Commande> commandes = commandeService.obtenirCommandesParUtilisateur(idUtilisateur);
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }
    
    // READ - GET BY UTILISATEUR ET STATUT
    @GetMapping("/utilisateur/{idUtilisateur}/statut/{idStatut}")
    public ResponseEntity<List<CommandeDTO>> obtenirCommandesParUtilisateurEtStatut(
            @PathVariable Integer idUtilisateur,
            @PathVariable Integer idStatut) {
        List<Commande> commandes = commandeService.obtenirCommandesParUtilisateurEtStatut(idUtilisateur, idStatut);
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }
    
    // READ - GET BY STATUT (Admin)
    @GetMapping("/statut/{idStatut}")
    public ResponseEntity<List<CommandeDTO>> obtenirCommandesParStatut(@PathVariable Integer idStatut) {
        List<Commande> commandes = commandeService.obtenirCommandesParStatut(idStatut);
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }
    
    // UPDATE - PUT (mise à jour globale)
    @PutMapping("/{id}")
    public ResponseEntity<CommandeDTO> mettreAJourCommande(@PathVariable Integer id, @RequestBody Commande commande) {
        Commande commandeMisAJour = commandeService.mettreAJourCommande(id, commande);
        
        if (commandeMisAJour != null) {
            CommandeDTO commandeDTO = commandeService.convertToDTO(commandeMisAJour);
            return ResponseEntity.ok(commandeDTO);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    // UPDATE - PUT (mise à jour du statut)
    @PutMapping("/{id}/statut/{idStatut}")
    public ResponseEntity<CommandeDTO> mettreAJourStatut(@PathVariable Integer id, @PathVariable Integer idStatut) {
        try {
            Commande commandeMisAJour = commandeService.mettreAJourStatut(id, idStatut);
            CommandeDTO commandeDTO = commandeService.convertToDTO(commandeMisAJour);
            return ResponseEntity.ok(commandeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // DELETE - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> supprimerCommande(@PathVariable Integer id) {
        boolean supprime = commandeService.supprimerCommande(id);
        
        Map<String, String> response = new HashMap<>();
        if (supprime) {
            response.put("message", "Commande supprimée avec succès");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        
        response.put("message", "Commande non trouvée");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
