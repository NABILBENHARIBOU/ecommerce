package site.e_commerce.backend.repository;

import site.e_commerce.backend.model.Commande;
import site.e_commerce.backend.model.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Integer> {
    
    List<Commande> findByUtilisateur_IdUtilisateur(Integer idUtilisateur);
    
    List<Commande> findByStatutCommande_IdStatut(Integer idStatut);
    
    List<Commande> findByUtilisateur_IdUtilisateurAndStatutCommande_IdStatut(Integer idUtilisateur, Integer idStatut);
    
    @Query("SELECT c FROM Commande c WHERE c.utilisateur.idUtilisateur = :idUtilisateur ORDER BY c.date DESC")
    List<Commande> findUserOrdersOrderByDateDesc(@Param("idUtilisateur") Integer idUtilisateur);
    
    @Query("SELECT c FROM Commande c ORDER BY c.date DESC")
    List<Commande> findAllOrderByDateDesc();
}
