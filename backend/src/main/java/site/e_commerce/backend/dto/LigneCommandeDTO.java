package site.e_commerce.backend.dto;

import java.math.BigDecimal;

public class LigneCommandeDTO {
    
    private Integer idLigne;
    private Integer idProduit;
    private String nomProduit;
    private Integer quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal sousTotal;
    
    // Constructors
    public LigneCommandeDTO() {
    }
    
    public LigneCommandeDTO(Integer idLigne, Integer idProduit, String nomProduit, Integer quantite, BigDecimal prixUnitaire) {
        this.idLigne = idLigne;
        this.idProduit = idProduit;
        this.nomProduit = nomProduit;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.sousTotal = prixUnitaire.multiply(new BigDecimal(quantite));
    }
    
    // Getters & Setters
    public Integer getIdLigne() {
        return idLigne;
    }
    
    public void setIdLigne(Integer idLigne) {
        this.idLigne = idLigne;
    }
    
    public Integer getIdProduit() {
        return idProduit;
    }
    
    public void setIdProduit(Integer idProduit) {
        this.idProduit = idProduit;
    }
    
    public String getNomProduit() {
        return nomProduit;
    }
    
    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }
    
    public Integer getQuantite() {
        return quantite;
    }
    
    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }
    
    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }
    
    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }
    
    public BigDecimal getSousTotal() {
        return sousTotal;
    }
    
    public void setSousTotal(BigDecimal sousTotal) {
        this.sousTotal = sousTotal;
    }
}
