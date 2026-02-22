package site.e_commerce.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "mode_paiement")
public class ModePaiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mode")
    @JsonProperty("id_mode")
    private Integer idMode;

    @Column(name = "libelle", nullable = false, length = 50)
    @JsonProperty("libelle")
    private String libelle;

    // Constructors
    public ModePaiement() {

    }

    public ModePaiement(Integer idMode, String libelle) {
        this.idMode = idMode;
        this.libelle = libelle;
    }

    // Getters
    public Integer getIdMode() {
        return idMode;
    }

    public String getLibelle() {
        return libelle;
    }

    // Setters
    public void setIdMode(Integer idMode) {
        this.idMode = idMode;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

}
