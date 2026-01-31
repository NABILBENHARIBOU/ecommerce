package site.e_commerce.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "Categorie")
public class Categorie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categorie")
    private Integer idCategorie;
    
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;
    
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Produit> produits;
    
    // Constructors
    public Categorie() {
    }
    
    public Categorie(String nom) {
        this.nom = nom;
    }
    
    public Categorie(Integer idCategorie, String nom) {
        this.idCategorie = idCategorie;
        this.nom = nom;
    }
    
    // Getters
    public Integer getIdCategorie() {
        return idCategorie;
    }
    
    public String getNom() {
        return nom;
    }
    
    public List<Produit> getProduits() {
        return produits;
    }
    
    // Setters
    public void setIdCategorie(Integer idCategorie) {
        this.idCategorie = idCategorie;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public void setProduits(List<Produit> produits) {
        this.produits = produits;
    }
}
