package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StatutCommandeRepository extends JpaRepository<StatutCommande, Integer> {
    Optional<StatutCommande> findByLibelle(String libelle);
}
