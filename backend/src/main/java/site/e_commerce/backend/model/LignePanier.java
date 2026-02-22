package site.e_commerce.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Panier_Produit")
public class LignePanier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_panier")
    private Panier panier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit")
    private Produit produit;

    @Column(name = "quantite", nullable = false)
    private Integer quantite = 1;

    public LignePanier() {}

    public LignePanier(Panier panier, Produit produit, int quantite) {
        this.panier = panier;
        this.produit = produit;
        this.quantite = quantite;
    }

    // Getters et setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Panier getPanier() { return panier; }
    public void setPanier(Panier panier) { this.panier = panier; }

    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }
}
