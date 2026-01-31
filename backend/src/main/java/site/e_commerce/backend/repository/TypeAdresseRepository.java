package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.TypeAdresse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeAdresseRepository extends JpaRepository<TypeAdresse, Integer> {
}
