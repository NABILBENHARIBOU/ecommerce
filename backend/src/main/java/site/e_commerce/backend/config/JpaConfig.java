package site.e_commerce.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "site.e_commerce.backend.repository")
@EnableTransactionManagement
public class JpaConfig {
    // JPA Configuration is handled by Spring Boot auto-configuration
    // This class can be used for additional custom JPA configurations
}
