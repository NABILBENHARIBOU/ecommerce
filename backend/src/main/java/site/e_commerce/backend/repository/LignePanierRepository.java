package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.LignePanier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface LignePanierRepository extends JpaRepository<LignePanier, Integer> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    // Utiliser une requête JPQL explicite est souvent plus robuste pour les suppressions par ID de parent
    @Query("DELETE FROM LignePanier l WHERE l.panier.idPanier = :idPanier")
    void deleteByPanier_IdPanier(@Param("idPanier") Integer idPanier);
}