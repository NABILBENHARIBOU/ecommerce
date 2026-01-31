package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Integer> {
    Optional<Paiement> findByCommande_IdCommande(Integer idCommande);
}
