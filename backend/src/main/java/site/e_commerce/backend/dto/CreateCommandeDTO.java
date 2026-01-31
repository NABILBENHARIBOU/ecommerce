package site.e_commerce.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class CreateCommandeDTO {
    
    private Integer idUtilisateur;
    private Integer idAdresse;
    private BigDecimal total;
    private List<CreateLigneCommandeDTO> lignesCommande;
    private Integer idModePaiement;
    
    // Constructors
    public CreateCommandeDTO() {
    }
    
    public CreateCommandeDTO(Integer idUtilisateur, Integer idAdresse, BigDecimal total, List<CreateLigneCommandeDTO> lignesCommande) {
        this.idUtilisateur = idUtilisateur;
        this.idAdresse = idAdresse;
        this.total = total;
        this.lignesCommande = lignesCommande;
    }
    
    // Getters & Setters
    public Integer getIdUtilisateur() {
        return idUtilisateur;
    }
    
    public void setIdUtilisateur(Integer idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }
    
    public Integer getIdAdresse() {
        return idAdresse;
    }
    
    public void setIdAdresse(Integer idAdresse) {
        this.idAdresse = idAdresse;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public List<CreateLigneCommandeDTO> getLignesCommande() {
        return lignesCommande;
    }
    
    public void setLignesCommande(List<CreateLigneCommandeDTO> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }
    
    public Integer getIdModePaiement() {
        return idModePaiement;
    }
    
    public void setIdModePaiement(Integer idModePaiement) {
        this.idModePaiement = idModePaiement;
    }
}
