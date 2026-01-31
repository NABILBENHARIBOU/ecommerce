package site.e_commerce.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Paiement")
public class Paiement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paiement")
    private Integer idPaiement;
    
    @Column(name = "montant", nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;
    
    @Column(name = "date_paiement", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime datePaiement;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mode")
    private ModePaiement modePaiement;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_commande", referencedColumnName = "id_commande", unique = true)
    private Commande commande;
    
    // Constructors
    public Paiement() {
        this.datePaiement = LocalDateTime.now();
    }
    
    public Paiement(BigDecimal montant, ModePaiement modePaiement, Commande commande) {
        this.montant = montant;
        this.modePaiement = modePaiement;
        this.commande = commande;
        this.datePaiement = LocalDateTime.now();
    }
    
    // Getters
    public Integer getIdPaiement() {
        return idPaiement;
    }
    
    public BigDecimal getMontant() {
        return montant;
    }
    
    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }
    
    public ModePaiement getModePaiement() {
        return modePaiement;
    }
    
    public Commande getCommande() {
        return commande;
    }
    
    // Setters
    public void setIdPaiement(Integer idPaiement) {
        this.idPaiement = idPaiement;
    }
    
    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }
    
    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }
    
    public void setModePaiement(ModePaiement modePaiement) {
        this.modePaiement = modePaiement;
    }
    
    public void setCommande(Commande commande) {
        this.commande = commande;
    }
}
