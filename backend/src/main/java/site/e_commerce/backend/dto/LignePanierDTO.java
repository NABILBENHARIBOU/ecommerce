package site.e_commerce.backend.dto;

public class LignePanierDTO {
    private Integer idProduit;
    private Integer quantite;

    public LignePanierDTO() {}
    public LignePanierDTO(Integer idProduit, Integer quantite) {
        this.idProduit = idProduit;
        this.quantite = quantite;
    }
    public Integer getIdProduit() { return idProduit; }
    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }
    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }
}
