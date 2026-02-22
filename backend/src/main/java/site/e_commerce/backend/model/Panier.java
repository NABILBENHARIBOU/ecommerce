package site.e_commerce.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Panier")
public class Panier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_panier")
    private Integer idPanier;
    
    @Column(name = "date_creation", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateCreation;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id_utilisateur", unique = true)
    private Utilisateur utilisateur;
    
    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LignePanier> lignesPanier;
    
    // Constructors
    public Panier() {
        this.dateCreation = LocalDateTime.now();
    }
    
    public Panier(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
        this.dateCreation = LocalDateTime.now();
    }
    
    // Getters
    public Integer getIdPanier() {
        return idPanier;
    }
    
    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
    
    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
    
    public List<LignePanier> getLignesPanier() {
        return lignesPanier;
    }
    
    // Setters
    public void setIdPanier(Integer idPanier) {
        this.idPanier = idPanier;
    }
    
    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
    
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
    
    public void setLignesPanier(List<LignePanier> lignesPanier) {
        this.lignesPanier = lignesPanier;
    }


    public List<Produit> getProduits() {
        if (lignesPanier == null) return java.util.Collections.emptyList();
        return lignesPanier.stream()
            .map(LignePanier::getProduit)
            .toList();
    }

    // setProduits n'est pas utile pour la logique métier, mais on évite l'exception
    public void setProduits(List<Produit> produits) {
        // Remplace toutes les lignes du panier par une ligne par produit (quantité 1)
        this.lignesPanier = produits == null ? java.util.Collections.emptyList() :
            produits.stream()
                .map(p -> new LignePanier(this, p, 1))
                .toList();
    }
}
