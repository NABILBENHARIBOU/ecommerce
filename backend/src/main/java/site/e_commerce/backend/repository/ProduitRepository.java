package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {
    Optional<Produit> findByNom(String nom);
    List<Produit> findByStockGreaterThan(Integer stock);
}
