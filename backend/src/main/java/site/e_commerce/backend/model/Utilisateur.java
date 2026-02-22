package site.e_commerce.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Entity
@Table(name = "Utilisateur")
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Integer idUtilisateur;
    
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;
    
    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;
    
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;
    
    @Column(name = "mot_de_passe", nullable = false, length = 255)
    private String motDePasse;
    
    @Column(name = "telephone", length = 20)
    private String telephone;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type", referencedColumnName = "id_type")
    private TypeUtilisateur typeUtilisateur;

    // Exposer id_type directement en JSON
    @JsonProperty("idType")
    public Integer getIdType() {
        return typeUtilisateur != null ? typeUtilisateur.getIdType() : null;
    }
    
    @OneToMany(mappedBy = "utilisateur", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Adresse> adresses;
    
    @OneToMany(mappedBy = "utilisateur", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Commande> commandes;
    
    @OneToOne(mappedBy = "utilisateur", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Panier panier;
    
    // Getters
    public Integer getIdUtilisateur() {
        return idUtilisateur;
    }
    
    public String getNom() {
        return nom;
    }
    
    public String getPrenom() {
        return prenom;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getMotDePasse() {
        return motDePasse;
    }
    
    public String getTelephone() {
        return telephone;
    }
    
    public TypeUtilisateur getTypeUtilisateur() {
        return typeUtilisateur;
    }
    
    public List<Adresse> getAdresses() {
        return adresses;
    }
    
    public List<Commande> getCommandes() {
        return commandes;
    }
    
    public Panier getPanier() {
        return panier;
    }
    
    // Setters
    public void setIdUtilisateur(Integer idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
    
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    
    public void setTypeUtilisateur(TypeUtilisateur typeUtilisateur) {
        this.typeUtilisateur = typeUtilisateur;
    }
    
    public void setAdresses(List<Adresse> adresses) {
        this.adresses = adresses;
    }
    
    public void setCommandes(List<Commande> commandes) {
        this.commandes = commandes;
    }
    
    public void setPanier(Panier panier) {
        this.panier = panier;
    }
}
