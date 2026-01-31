package site.e_commerce.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "TypeAdresse")
public class TypeAdresse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idType;

    @Column(name = "libelle", nullable = false, length = 50)
    private String libelle;

    // Constructeurs
    public TypeAdresse() {

    }

    public TypeAdresse(Integer idType, String libelle) {
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
