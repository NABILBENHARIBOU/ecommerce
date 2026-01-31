package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.ModePaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModePaiementRepository extends JpaRepository<ModePaiement, Integer> {
    Optional<ModePaiement> findByLibelle(String libelle);
    
    @Query(value = "SELECT * FROM ModePaiement", nativeQuery = true)
    List<ModePaiement> findAllModePaiement();
}
