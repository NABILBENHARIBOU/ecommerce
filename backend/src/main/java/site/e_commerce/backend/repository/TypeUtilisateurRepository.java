package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.TypeUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeUtilisateurRepository extends JpaRepository<TypeUtilisateur, Integer> {
}
