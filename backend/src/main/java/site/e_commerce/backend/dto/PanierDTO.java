package site.e_commerce.backend.dto;

import java.util.List;

public class PanierDTO {
    private Integer idPanier;
    private List<LignePanierDTO> lignesPanier;

    public PanierDTO() {}
    public PanierDTO(Integer idPanier, List<LignePanierDTO> lignesPanier) {
        this.idPanier = idPanier;
        this.lignesPanier = lignesPanier;
    }
    public Integer getIdPanier() { return idPanier; }
    public void setIdPanier(Integer idPanier) { this.idPanier = idPanier; }
    public List<LignePanierDTO> getLignesPanier() { return lignesPanier; }
    public void setLignesPanier(List<LignePanierDTO> lignesPanier) { this.lignesPanier = lignesPanier; }
}
