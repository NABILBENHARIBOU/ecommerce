package site.e_commerce.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // Ajouter le module Hibernate Jackson pour gérer les proxies Hibernate
        Hibernate5JakartaModule hibernateModule = new Hibernate5JakartaModule();
        // Force l'initialisation des proxies lazy au lieu de lever une exception
        hibernateModule.disable(Hibernate5JakartaModule.Feature.USE_TRANSIENT_ANNOTATION);
        objectMapper.registerModule(hibernateModule);
        
        // Ajouter le module Java 8 date/time pour gérer LocalDateTime, LocalDate, etc.
        objectMapper.registerModule(new JavaTimeModule());
        
        System.out.println("✅ JacksonConfig - Modules enregistrés (Hibernate5Jakarta + JavaTimeModule)");
        
        return objectMapper;
    }
}

