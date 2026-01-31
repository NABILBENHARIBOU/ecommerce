package site.e_commerce.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "StatutCommande")
public class StatutCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_statut")
    private Integer idStatut;

    @Column(name = "libelle", nullable = false, length = 50)
    private String libelle;

    // Constructors
    public StatutCommande() {

    }

    public StatutCommande(Integer idStatut, String libelle) {
        this.idStatut = idStatut;
        this.libelle = libelle;
    }

    // Getters
    public Integer getIdStatut() {
        return idStatut;
    }

    public String getLibelle() {
        return libelle;
    }

    // Setters
    public void setIdStatut(Integer idStatut) {
        this.idStatut = idStatut;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

}
