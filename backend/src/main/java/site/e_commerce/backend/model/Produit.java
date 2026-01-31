package site.e_commerce.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "Produit")
public class Produit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produit")
    private Integer idProduit;
    
    @Column(name = "nom", nullable = false, length = 150)
    private String nom;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "prix", nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;
    
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "ProduitCategorie",
        joinColumns = @JoinColumn(name = "id_produit"),
        inverseJoinColumns = @JoinColumn(name = "id_categorie")
    )
    private List<Categorie> categories;
    
    @OneToMany(mappedBy = "produit", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<LigneCommande> lignesCommande;
    
    // Constructors
    public Produit() {
    }
    
    public Produit(String nom, String description, BigDecimal prix, Integer stock) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.stock = stock;
    }
    
    public Produit(Integer idProduit, String nom, String description, BigDecimal prix, Integer stock) {
        this.idProduit = idProduit;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.stock = stock;
    }
    
    // Getters
    public Integer getIdProduit() {
        return idProduit;
    }
    
    public String getNom() {
        return nom;
    }
    
    public String getDescription() {
        return description;
    }
    
    public BigDecimal getPrix() {
        return prix;
    }
    
    public Integer getStock() {
        return stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    
    public List<Categorie> getCategories() {
        return categories;
    }
    
    public List<LigneCommande> getLignesCommande() {
        return lignesCommande;
    }
    
    // Setters
    public void setIdProduit(Integer idProduit) {
        this.idProduit = idProduit;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public void setCategories(List<Categorie> categories) {
        this.categories = categories;
    }
    
    public void setLignesCommande(List<LigneCommande> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }
}
