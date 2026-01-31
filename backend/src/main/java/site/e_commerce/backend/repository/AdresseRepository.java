package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.Adresse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdresseRepository extends JpaRepository<Adresse, Integer> {
    List<Adresse> findByUtilisateur_IdUtilisateur(Integer idUtilisateur);
}
