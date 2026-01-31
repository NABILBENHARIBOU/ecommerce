package site.e_commerce.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CommandeDTO {
    
    private Integer idCommande;
    private LocalDateTime date;
    private BigDecimal total;
    private Integer idUtilisateur;
    private String nomUtilisateur;
    private String emailUtilisateur;
    private Integer idAdresse;
    private String adresseComplete;
    private Integer idStatut;
    private String libelleStatut;
    private List<LigneCommandeDTO> lignesCommande;
    private PaiementDTO paiement;
    
    // Constructors
    public CommandeDTO() {
    }
    
    public CommandeDTO(Integer idCommande, LocalDateTime date, BigDecimal total, Integer idUtilisateur, 
                      String nomUtilisateur, String emailUtilisateur, Integer idStatut, String libelleStatut) {
        this.idCommande = idCommande;
        this.date = date;
        this.total = total;
        this.idUtilisateur = idUtilisateur;
        this.nomUtilisateur = nomUtilisateur;
        this.emailUtilisateur = emailUtilisateur;
        this.idStatut = idStatut;
        this.libelleStatut = libelleStatut;
    }
    
    // Getters & Setters
    public Integer getIdCommande() {
        return idCommande;
    }
    
    public void setIdCommande(Integer idCommande) {
        this.idCommande = idCommande;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public Integer getIdUtilisateur() {
        return idUtilisateur;
    }
    
    public void setIdUtilisateur(Integer idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }
    
    public String getNomUtilisateur() {
        return nomUtilisateur;
    }
    
    public void setNomUtilisateur(String nomUtilisateur) {
        this.nomUtilisateur = nomUtilisateur;
    }
    
    public String getEmailUtilisateur() {
        return emailUtilisateur;
    }
    
    public void setEmailUtilisateur(String emailUtilisateur) {
        this.emailUtilisateur = emailUtilisateur;
    }
    
    public Integer getIdAdresse() {
        return idAdresse;
    }
    
    public void setIdAdresse(Integer idAdresse) {
        this.idAdresse = idAdresse;
    }
    
    public String getAdresseComplete() {
        return adresseComplete;
    }
    
    public void setAdresseComplete(String adresseComplete) {
        this.adresseComplete = adresseComplete;
    }
    
    public Integer getIdStatut() {
        return idStatut;
    }
    
    public void setIdStatut(Integer idStatut) {
        this.idStatut = idStatut;
    }
    
    public String getLibelleStatut() {
        return libelleStatut;
    }
    
    public void setLibelleStatut(String libelleStatut) {
        this.libelleStatut = libelleStatut;
    }
    
    public List<LigneCommandeDTO> getLignesCommande() {
        return lignesCommande;
    }
    
    public void setLignesCommande(List<LigneCommandeDTO> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }
    
    public PaiementDTO getPaiement() {
        return paiement;
    }
    
    public void setPaiement(PaiementDTO paiement) {
        this.paiement = paiement;
    }
}
