package site.e_commerce.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaiementDTO {
    
    private Integer idPaiement;
    private BigDecimal montant;
    private LocalDateTime datePaiement;
    private Integer idMode;
    private String libelleMode;
    private Integer idCommande;
    
    // Constructors
    public PaiementDTO() {
    }
    
    public PaiementDTO(Integer idPaiement, BigDecimal montant, LocalDateTime datePaiement, Integer idMode, String libelleMode) {
        this.idPaiement = idPaiement;
        this.montant = montant;
        this.datePaiement = datePaiement;
        this.idMode = idMode;
        this.libelleMode = libelleMode;
    }
    
    // Getters & Setters
    public Integer getIdPaiement() {
        return idPaiement;
    }
    
    public void setIdPaiement(Integer idPaiement) {
        this.idPaiement = idPaiement;
    }
    
    public BigDecimal getMontant() {
        return montant;
    }
    
    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }
    
    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }
    
    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }
    
    public Integer getIdMode() {
        return idMode;
    }
    
    public void setIdMode(Integer idMode) {
        this.idMode = idMode;
    }
    
    public String getLibelleMode() {
        return libelleMode;
    }
    
    public void setLibelleMode(String libelleMode) {
        this.libelleMode = libelleMode;
    }
    
    public Integer getIdCommande() {
        return idCommande;
    }
    
    public void setIdCommande(Integer idCommande) {
        this.idCommande = idCommande;
    }
}
