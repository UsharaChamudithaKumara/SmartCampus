package com.paf.smartcampus.controller;

import com.paf.smartcampus.dto.AdminLoginRequest;
import com.paf.smartcampus.model.AdminUser;
import com.paf.smartcampus.repository.AdminUserRepository;
import com.paf.smartcampus.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-auth")
@CrossOrigin(origins = "*")
public class AdminLoginController {

    // Fixed admin credentials
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * ADMIN LOGIN endpoint
     * POST /api/admin-auth/login
     */
    @PostMapping("/login")
    public Object login(@RequestBody AdminLoginRequest request) {
        try {
            if (request.getUsername() == null || request.getPassword() == null) {
                return new ErrorResponse("❌ Username and password are required");
            }

            String username = request.getUsername().trim();
            String password = request.getPassword().trim();

            // Check against fixed admin credentials
            if (!ADMIN_USERNAME.equals(username)) {
                return new ErrorResponse("❌ Invalid admin username");
            }

            if (!ADMIN_PASSWORD.equals(password)) {
                return new ErrorResponse("❌ Invalid admin password");
            }

            // Admin login successful
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtUtil.generateToken("admin@smartcampus.local", "ADMIN"));
            response.put("username", "admin");
            response.put("email", "admin@smartcampus.local");
            response.put("role", "ADMIN");
            response.put("expiresIn", jwtUtil.getExpirationTime());

            // Update last login time (optional - store in DB)
            updateAdminLastLogin();

            return response;
        } catch (Exception e) {
            return new ErrorResponse("❌ Login failed: " + e.getMessage());
        }
    }

    private void updateAdminLastLogin() {
        try {
            var existingAdmin = adminUserRepository.findByUsername(ADMIN_USERNAME);
            if (existingAdmin.isPresent()) {
                AdminUser admin = existingAdmin.get();
                admin.setLastLogin(new Date());
                adminUserRepository.save(admin);
            }
        } catch (Exception e) {
            // Silently fail - not critical
        }
    }

    static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
    }
}
