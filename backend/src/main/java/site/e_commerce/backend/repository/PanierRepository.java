package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Integer> {
    Optional<Panier> findByUtilisateur_IdUtilisateur(Integer idUtilisateur);
}
