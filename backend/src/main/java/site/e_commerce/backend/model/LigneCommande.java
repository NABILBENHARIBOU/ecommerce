package site.e_commerce.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "LigneCommande")
public class LigneCommande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ligne")
    private Integer idLigne;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_commande", referencedColumnName = "id_commande")
    private Commande commande;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", referencedColumnName = "id_produit")
    private Produit produit;
    
    @Column(name = "quantite", nullable = false)
    private Integer quantite;
    
    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;
    
    // Constructors
    public LigneCommande() {
    }
    
    public LigneCommande(Commande commande, Produit produit, Integer quantite, BigDecimal prixUnitaire) {
        this.commande = commande;
        this.produit = produit;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
    }
    
    // Getters
    public Integer getIdLigne() {
        return idLigne;
    }
    
    public Commande getCommande() {
        return commande;
    }
    
    public Produit getProduit() {
        return produit;
    }
    
    public Integer getQuantite() {
        return quantite;
    }
    
    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }
    
    // Setters
    public void setIdLigne(Integer idLigne) {
        this.idLigne = idLigne;
    }
    
    public void setCommande(Commande commande) {
        this.commande = commande;
    }
    
    public void setProduit(Produit produit) {
        this.produit = produit;
    }
    
    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }
    
    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }
}
