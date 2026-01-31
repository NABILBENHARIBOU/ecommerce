package site.e_commerce.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Commande")
public class Commande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_commande")
    private Integer idCommande;
    
    @Column(name = "date", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime date;
    
    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id_utilisateur")
    private Utilisateur utilisateur;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_adresse", referencedColumnName = "id_adresse")
    private Adresse adresse;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_statut", referencedColumnName = "id_statut")
    private StatutCommande statutCommande;
    
    @OneToMany(mappedBy = "commande", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneCommande> lignesCommande;
    
    @OneToOne(mappedBy = "commande", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Paiement paiement;
    
    // Constructors
    public Commande() {
        this.date = LocalDateTime.now();
    }
    
    public Commande(BigDecimal total, Utilisateur utilisateur, Adresse adresse, StatutCommande statutCommande) {
        this.total = total;
        this.utilisateur = utilisateur;
        this.adresse = adresse;
        this.statutCommande = statutCommande;
        this.date = LocalDateTime.now();
    }
    
    // Getters
    public Integer getIdCommande() {
        return idCommande;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
    
    public Adresse getAdresse() {
        return adresse;
    }
    
    public StatutCommande getStatutCommande() {
        return statutCommande;
    }
    
    public List<LigneCommande> getLignesCommande() {
        return lignesCommande;
    }
    
    public Paiement getPaiement() {
        return paiement;
    }
    
    // Setters
    public void setIdCommande(Integer idCommande) {
        this.idCommande = idCommande;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
    
    public void setAdresse(Adresse adresse) {
        this.adresse = adresse;
    }
    
    public void setStatutCommande(StatutCommande statutCommande) {
        this.statutCommande = statutCommande;
    }
    
    public void setLignesCommande(List<LigneCommande> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }
    
    public void setPaiement(Paiement paiement) {
        this.paiement = paiement;
    }
}
