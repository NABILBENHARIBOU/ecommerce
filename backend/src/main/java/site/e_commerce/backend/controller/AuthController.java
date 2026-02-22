package site.e_commerce.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.e_commerce.backend.model.Utilisateur;
import site.e_commerce.backend.security.JwtProvider;
import site.e_commerce.backend.service.UtilisateurService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        Utilisateur user = utilisateurService.obtenirUtilisateurParEmail(email).orElse(null);
        if (user == null || !user.getMotDePasse().equals(password)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email ou mot de passe incorrect");
            return ResponseEntity.status(401).body(error);
        }
        String token = jwtProvider.generateToken(user.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
