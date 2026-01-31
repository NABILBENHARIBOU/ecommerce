package site.e_commerce.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TypeUtilisateur")
public class TypeUtilisateur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_type")
    private Integer idType;
    
    @Column(name = "libelle", nullable = false, length = 50)
    private String libelle;

    // Constructors
    public TypeUtilisateur() {
    }

    public TypeUtilisateur(Integer idType, String libelle) {
        this.idType = idType;
        this.libelle = libelle;
    }

    // Getters
    public Integer getIdType() {
        return idType;
    }

    public String getLibelle() {
        return libelle;
    }

    // Setters
    public void setIdType(Integer idType) {
        this.idType = idType;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }
}
