package site.e_commerce.backend.controller;

import site.e_commerce.backend.dto.*;
import site.e_commerce.backend.model.*;
import site.e_commerce.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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

    @Autowired
    private PaiementService paiementService;

    // CREATE - POST (ancienne méthode simple)
    @PostMapping
    public ResponseEntity<Commande> creerCommande(@RequestBody Commande commande) {
        Commande nouvelleCommande = commandeService.creerCommande(commande);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleCommande);
    }

    // CREATE - POST (Nouvelle méthode avec DTO depuis panier)
    @PostMapping("/creer")
    public ResponseEntity<CommandeDTO> creerCommandeDepuisPanier(@RequestBody CreateCommandeDTO createCommandeDTO) {
        try {
            System.out.println("\n========== CRÉER COMMANDE DEPUIS PANIER ==========");
            System.out.println("👤 ID Utilisateur: " + createCommandeDTO.getIdUtilisateur());
            
            Commande nouvelleCommande = commandeService.creerCommande(createCommandeDTO);
            CommandeDTO commandeDTO = commandeService.convertToDTO(nouvelleCommande);
            
            System.out.println("✅ Commande créée avec ID: " + nouvelleCommande.getIdCommande());
            return ResponseEntity.status(HttpStatus.CREATED).body(commandeDTO);
        } catch (RuntimeException e) {
            System.err.println("❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // CRÉER UN PAIEMENT POUR UNE COMMANDE
    @PostMapping("/{id}/paiement")
    public ResponseEntity<?> creerPaiementPourCommande(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> payload) {
        try {
            Integer idModePaiement = null;
            if (payload.containsKey("idModePaiement")) {
                idModePaiement = (Integer) payload.get("idModePaiement");
            } else if (payload.containsKey("id_mode")) {
                idModePaiement = (Integer) payload.get("id_mode");
            }

            if (idModePaiement == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "idModePaiement manquant"));
            }

            Paiement paiement = paiementService.creerPaiement(id, idModePaiement);
            PaiementDTO paiementDTO = paiementService.convertToDTO(paiement);
            return ResponseEntity.status(HttpStatus.CREATED).body(paiementDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // READ - GET ALL
    @GetMapping
    public ResponseEntity<List<CommandeDTO>> obtenirToutesLesCommandes() {
        List<CommandeDTO> dtos = commandeService.obtenirToutesLesCommandes().stream()
                .map(commandeService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // READ - GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CommandeDTO> obtenirCommandeParId(@PathVariable Integer id) {
        return commandeService.obtenirCommandeParId(id)
                .map(c -> ResponseEntity.ok(commandeService.convertToDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - GET BY UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public ResponseEntity<List<CommandeDTO>> obtenirCommandesParUtilisateur(@PathVariable Integer idUtilisateur) {
        List<CommandeDTO> dtos = commandeService.obtenirCommandesParUtilisateur(idUtilisateur).stream()
                .map(commandeService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // UPDATE - MISE À JOUR DU STATUT
    @PutMapping("/{id}/statut/{idStatut}")
    public ResponseEntity<CommandeDTO> mettreAJourStatut(@PathVariable Integer id, @PathVariable Integer idStatut) {
        try {
            Commande miseAJour = commandeService.mettreAJourStatut(id, idStatut);
            return ResponseEntity.ok(commandeService.convertToDTO(miseAJour));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerCommande(@PathVariable Integer id) {
        return commandeService.supprimerCommande(id) 
               ? ResponseEntity.noContent().build() 
               : ResponseEntity.notFound().build();
    }
}