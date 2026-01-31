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
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "Panier_Produit",
        joinColumns = @JoinColumn(name = "id_panier"),
        inverseJoinColumns = @JoinColumn(name = "id_produit")
    )
    private List<Produit> produits;
    
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
    
    public List<Produit> getProduits() {
        return produits;
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
    
    public void setProduits(List<Produit> produits) {
        this.produits = produits;
    }
}
