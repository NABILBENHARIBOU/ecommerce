package site.e_commerce.backend.dto;

import java.math.BigDecimal;

public class CreateLigneCommandeDTO {
    
    private Integer idProduit;
    private Integer quantite;
    private BigDecimal prixUnitaire;
    
    // Constructors
    public CreateLigneCommandeDTO() {
    }
    
    public CreateLigneCommandeDTO(Integer idProduit, Integer quantite, BigDecimal prixUnitaire) {
        this.idProduit = idProduit;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
    }
    
    // Getters & Setters
    public Integer getIdProduit() {
        return idProduit;
    }
    
    public void setIdProduit(Integer idProduit) {
        this.idProduit = idProduit;
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
}
