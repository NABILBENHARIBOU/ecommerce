package site.e_commerce.backend.service;

import site.e_commerce.backend.model.Adresse;
import site.e_commerce.backend.repository.AdresseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdresseService {
    
    @Autowired
    private AdresseRepository adresseRepository;
    
    public Adresse creerAdresse(Adresse adresse) {
        return adresseRepository.save(adresse);
    }
    
    public Optional<Adresse> obtenirAdresseParId(Integer id) {
        return adresseRepository.findById(id);
    }
    
    public List<Adresse> obtenirToutesLesAdresses() {
        return adresseRepository.findAll();
    }
    
    public List<Adresse> obtenirAdressesParUtilisateur(Integer idUtilisateur) {
        return adresseRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);
    }
    
    public Adresse mettreAJourAdresse(Integer id, Adresse adresseMisAJour) {
        Optional<Adresse> adresseExistante = adresseRepository.findById(id);
        
        if (adresseExistante.isPresent()) {
            Adresse adresse = adresseExistante.get();
            if (adresseMisAJour.getRue() != null) adresse.setRue(adresseMisAJour.getRue());
            if (adresseMisAJour.getVille() != null) adresse.setVille(adresseMisAJour.getVille());
            if (adresseMisAJour.getCodePostal() != null) adresse.setCodePostal(adresseMisAJour.getCodePostal());
            if (adresseMisAJour.getPays() != null) adresse.setPays(adresseMisAJour.getPays());
            if (adresseMisAJour.getTypeAdresse() != null) adresse.setTypeAdresse(adresseMisAJour.getTypeAdresse());
            
            return adresseRepository.save(adresse);
        }
        return null;
    }
    
    public boolean supprimerAdresse(Integer id) {
        if (adresseRepository.existsById(id)) {
            adresseRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
