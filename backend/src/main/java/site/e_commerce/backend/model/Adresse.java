package site.e_commerce.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Adresse")
public class Adresse {
    // Permet la désérialisation JSON du champ idUtilisateur
    public void setIdUtilisateur(Integer idUtilisateur) {
        if (this.utilisateur == null) {
            this.utilisateur = new Utilisateur();
        }
        this.utilisateur.setIdUtilisateur(idUtilisateur);
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_adresse")
    private Integer idAdresse;

    @Column(name = "rue", nullable = false, length = 200)
    private String rue;

    @Column(name = "ville", nullable = false, length = 100)
    private String ville;

    @Column(name = "code_postal", length = 20)
    private String codePostal;

    @Column(name = "pays", nullable = false, length = 100)
    private String pays;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type")
    private TypeAdresse typeAdresse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id_utilisateur")
    @JsonIgnore
    private Utilisateur utilisateur;

    // Constructors
    public Adresse() {
    }

    public Adresse(String rue, String ville, String codePostal, String pays) {
        this.rue = rue;
        this.ville = ville;
        this.codePostal = codePostal;
        this.pays = pays;
    }

    public Adresse(String rue, String ville, String codePostal, String pays, TypeAdresse typeAdresse, Utilisateur utilisateur) {
        this.rue = rue;
        this.ville = ville;
        this.codePostal = codePostal;
        this.pays = pays;
        this.typeAdresse = typeAdresse;
        this.utilisateur = utilisateur;
    }

    // Getters
    public Integer getIdAdresse() {
        return idAdresse;
    }

    public String getRue() {
        return rue;
    }

    public String getVille() {
        return ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public String getPays() {
        return pays;
    }

    public TypeAdresse getTypeAdresse() {
        return typeAdresse;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    // Setters
    public void setIdAdresse(Integer idAdresse) {
        this.idAdresse = idAdresse;
    }

    public void setRue(String rue) {
        this.rue = rue;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public void setTypeAdresse(TypeAdresse typeAdresse) {
        this.typeAdresse = typeAdresse;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}

