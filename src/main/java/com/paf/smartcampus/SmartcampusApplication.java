package com.paf.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.paf.smartcampus.model.User;
import com.paf.smartcampus.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;

@SpringBootApplication
public class SmartcampusApplication {

	@Bean
	CommandLineRunner seedAdmin(UserRepository userRepository,
			@Value("${app.admin.email:admin@my.sliit.lk}") String adminEmail,
			@Value("${app.admin.password:Admin@1234}") String adminPassword,
			@Value("${app.admin.first-name:Admin}") String firstName,
			@Value("${app.admin.last-name:User}") String lastName,
			@Value("${app.admin.username:admin}") String username,
			@Value("${app.admin.it-number:AD00000001}") String itNumber,
			@Value("${app.admin.nic-number:900000000V}") String nicNumber) {
		return args -> {
			var passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
			User admin = userRepository.findByStudentEmail(adminEmail).orElse(null);
			if (admin == null) {
				admin = new User(
					adminEmail,
					itNumber,
					passwordEncoder.encode(adminPassword),
					firstName,
					lastName,
					username,
					nicNumber,
					null
				);
				admin.setRole("ADMIN");
				userRepository.save(admin);
			} else if (!"ADMIN".equals(admin.getRole())) {
				admin.setRole("ADMIN");
				userRepository.save(admin);
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(SmartcampusApplication.class, args);
	}

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}