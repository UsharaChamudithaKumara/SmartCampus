package com.paf.smartcampus.controller;

import java.util.Date;
import java.util.Optional;
import java.util.Random;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.dto.AuthRequest;
import com.paf.smartcampus.dto.AuthResponse;
import com.paf.smartcampus.dto.ForgotPasswordRequest;
import com.paf.smartcampus.dto.GoogleLoginRequest;
import com.paf.smartcampus.dto.PasswordResetRequest;
import com.paf.smartcampus.dto.SignupRequest;
import com.paf.smartcampus.model.User;
import com.paf.smartcampus.model.TechnicianLoginRequest;
import com.paf.smartcampus.repository.UserRepository;
import com.paf.smartcampus.repository.TechnicianLoginRequestRepository;
import com.paf.smartcampus.util.JwtUtil;
import com.paf.smartcampus.util.PasswordValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final String ROLE_ADMIN = "ADMIN";
    private static final String ROLE_TECHNICIAN = "TECHNICIAN";
    private static final String ROLE_LECTURER = "LECTURER";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TechnicianLoginRequestRepository technicianLoginRequestRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private RestTemplate restTemplate = new RestTemplate();

    /**
     * SIGNUP endpoint
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public Object signup(@Valid @RequestBody SignupRequest request) {
        try {
            // Extract role first so we can conditionally enforce student number
            String role = request.getRole();
            if (role == null || role.trim().isEmpty()) {
                return new ErrorResponse("Role is required (STUDENT, LECTURER, or TECHNICIAN)");
            }
            role = role.trim().toUpperCase();
            if (!role.matches("^(STUDENT|LECTURER|TECHNICIAN)$")) {
                return new ErrorResponse("Invalid role. Must be STUDENT, LECTURER, or TECHNICIAN");
            }

            // Validate student number - only required for STUDENT role
            String itNumber;
            if ("STUDENT".equals(role)) {
                if (request.getItNumber() == null || request.getItNumber().trim().isEmpty()) {
                    return new ErrorResponse("❌ Student number is required (format: 2 letters + 8 digits)");
                }
                itNumber = request.getItNumber().trim().toUpperCase();
                if (!itNumber.matches("^[A-Z]{2}\\d{8}$")) {
                    return new ErrorResponse("❌ Student number must be 2 letters followed by 8 digits (e.g., IT23456789)");
                }
            } else {
                // Technician / Lecturer - auto-generate an internal employee ID
                itNumber = "EMP" + System.currentTimeMillis();
            }

            // Validate email format
            String studentEmail = request.getStudentEmail();
            if (studentEmail == null || studentEmail.trim().isEmpty()) {
                return new ErrorResponse("❌ Email is required");
            }

            studentEmail = studentEmail.trim();
            if (!studentEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                return new ErrorResponse("❌ Enter a valid email address");
            }

            // Validate other fields
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return new ErrorResponse("❌ First name is required");
            }
            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                return new ErrorResponse("❌ Last name is required");
            }
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return new ErrorResponse("❌ Username is required");
            }
            if (request.getNicNumber() == null || request.getNicNumber().trim().isEmpty()) {
                return new ErrorResponse("❌ NIC number is required");
            }

            // Validate password strength
            if (!PasswordValidator.isStrong(request.getPassword())) {
                return new ErrorResponse("❌ " + PasswordValidator.getPasswordRequirements());
            }

            // Validate passwords match
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return new ErrorResponse("❌ Passwords do not match");
            }

            // Check if IT number already exists
            if (userRepository.existsByItNumber(itNumber)) {
                return new ErrorResponse("❌ IT number already registered");
            }

            // Check if email already exists
            if (userRepository.existsByStudentEmail(studentEmail)) {
                return new ErrorResponse("❌ Email already registered");
            }

            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                return new ErrorResponse("❌ Username already taken");
            }

            // Check if NIC already exists
            if (userRepository.existsByNicNumber(request.getNicNumber())) {
                return new ErrorResponse("❌ NIC number already registered");
            }

            // Validate technician type if role is TECHNICIAN
            String technicianType = null;
            if ("TECHNICIAN".equals(role)) {
                technicianType = request.getTechnicianType();
                if (technicianType == null || technicianType.trim().isEmpty()) {
                    return new ErrorResponse("Technician type is required for TECHNICIAN role");
                }
                technicianType = technicianType.trim().toUpperCase();
                if (!technicianType.matches("^(IT|ELECTRICIAN|PLUMBER|CARPENTER|HVAC|PAINTER|GENERAL)$")) {
                    return new ErrorResponse("Invalid technician type");
                }
            }

            // Create new user
            User newUser = new User(
                    studentEmail,
                    itNumber,
                    passwordEncoder.encode(request.getPassword()),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getUsername(),
                    request.getNicNumber(),
                    request.getProfilePhoto()
            );
            newUser.setRole(role);
            newUser.setTechnicianType(technicianType);

            userRepository.save(newUser);

            // Technicians need admin approval before logging in
            if ("TECHNICIAN".equals(role)) {
                TechnicianLoginRequest loginRequest = new TechnicianLoginRequest(
                        newUser.getStudentEmail(),
                        newUser.getFirstName() + " " + newUser.getLastName(),
                        technicianType
                );
                loginRequest.setStatus("PENDING");
                technicianLoginRequestRepository.save(loginRequest);
                return new SuccessResponse("Technician registration submitted. Please wait for admin approval before logging in.");
            }

            // Generate token for non-technician users
            String token = jwtUtil.generateToken(newUser.getStudentEmail(), newUser.getRole());

            return new AuthResponse(
                    token,
                    newUser.getStudentEmail(),
                    newUser.getFirstName(),
                    newUser.getLastName(),
                    newUser.getUsername(),
                    newUser.getItNumber(),
                    newUser.getProfilePhoto(),
                    newUser.getRole(),
                    jwtUtil.getExpirationTime()
            );

        } catch (Exception e) {
            return new ErrorResponse("❌ Signup failed: " + e.getMessage());
        }
    }

    /**
     * LOGIN endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public Object login(@Valid @RequestBody AuthRequest request) {
        try {
            String role = request.getRole();
            if (role == null || role.trim().isEmpty()) {
                return new ErrorResponse("❌ Role is required (STUDENT, LECTURER, or TECHNICIAN)");
            }

            role = role.trim().toUpperCase();
            if (!role.matches("^(STUDENT|LECTURER|TECHNICIAN)$")) {
                return new ErrorResponse("❌ Invalid role. Must be STUDENT, LECTURER, or TECHNICIAN");
            }

            if ("TECHNICIAN".equals(role)) {
                String techType = request.getTechnicianType();
                if (techType == null || techType.trim().isEmpty()) {
                    return new ErrorResponse("❌ Technician type is required for TECHNICIAN role");
                }

                techType = techType.trim().toUpperCase();
                if (!techType.matches("^(IT|ELECTRICIAN|PLUMBER|CARPENTER|HVAC|PAINTER|GENERAL)$")) {
                    return new ErrorResponse("❌ Invalid technician type");
                }
            }

            Optional<User> user = userRepository.findByStudentEmail(request.getStudentEmail());

            if (!user.isPresent()) {
                return new ErrorResponse("❌ User not found");
            }

            User foundUser = user.get();

            if (!foundUser.isEnabled()) {
                return new ErrorResponse("❌ User account is disabled");
            }

            // Check password
            if (!passwordEncoder.matches(request.getPassword(), foundUser.getPassword())) {
                return new ErrorResponse("❌ Invalid password");
            }

            foundUser.setRole(role);
            String techType = null;
            if ("TECHNICIAN".equals(role)) {
                techType = request.getTechnicianType().trim().toUpperCase();
                foundUser.setTechnicianType(techType);
                
                // Check if technician has an approved login request
                Optional<TechnicianLoginRequest> loginReq = technicianLoginRequestRepository.findByTechnicianEmail(foundUser.getStudentEmail());
                if (!loginReq.isPresent() || !"APPROVED".equals(loginReq.get().getStatus())) {
                    // Create or update PENDING request
                    TechnicianLoginRequest newRequest = loginReq.orElse(new TechnicianLoginRequest(
                            foundUser.getStudentEmail(),
                            foundUser.getFirstName() + " " + foundUser.getLastName(),
                            techType
                    ));
                    newRequest.setStatus("PENDING");
                    newRequest.setTechnicianType(techType);
                    technicianLoginRequestRepository.save(newRequest);
                    
                    return new ErrorResponse("❌ Technician login pending admin approval. Request submitted.");
                }
            } else {
                foundUser.setTechnicianType(null);
            }
            foundUser.setUpdatedAt(new Date());
            userRepository.save(foundUser);

            String token = jwtUtil.generateToken(foundUser.getStudentEmail(), foundUser.getRole());

            return new AuthResponse(
                    token,
                    foundUser.getStudentEmail(),
                    foundUser.getFirstName(),
                    foundUser.getLastName(),
                    foundUser.getUsername(),
                    foundUser.getItNumber(),
                    foundUser.getProfilePhoto(),
                    foundUser.getRole(),
                    jwtUtil.getExpirationTime()
            );

        } catch (Exception e) {
            return new ErrorResponse("❌ Login failed: " + e.getMessage());
        }
    }


    /**
     * GOOGLE LOGIN endpoint
     * POST /api/auth/google-login
     */
    @PostMapping("/google-login")
    public Object googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            if (request.getCredential() == null || request.getCredential().trim().isEmpty()) {
                return new ErrorResponse("❌ Google credential is required");
            }

            Map<?, ?> tokenInfo = restTemplate.getForObject(
                    "https://oauth2.googleapis.com/tokeninfo?id_token={token}",
                    Map.class,
                    request.getCredential().trim()
            );

            if (tokenInfo == null) {
                return new ErrorResponse("❌ Invalid Google token");
            }

            String audience = valueAsString(tokenInfo.get("aud"));
            if (googleClientId != null && !googleClientId.trim().isEmpty() && !googleClientId.equals(audience)) {
                return new ErrorResponse("❌ Google token audience mismatch");
            }

            String email = valueAsString(tokenInfo.get("email"));
            if (email == null || email.trim().isEmpty()) {
                return new ErrorResponse("❌ Google account email not found");
            }

            String emailVerified = valueAsString(tokenInfo.get("email_verified"));
            if (emailVerified != null && !"true".equalsIgnoreCase(emailVerified)) {
                return new ErrorResponse("❌ Google email is not verified");
            }

            String requestedRole = normalizeRole(request.getExpectedRole());
            Optional<User> existingUser = userRepository.findByStudentEmail(email);
            User user = existingUser.orElseGet(() -> createGoogleUser(tokenInfo, email, requestedRole));

            if (existingUser.isPresent()) {
                if (requestedRole != null && !requestedRole.equals(user.getRole())) {
                    if (ROLE_LECTURER.equals(requestedRole) || ROLE_TECHNICIAN.equals(requestedRole)) {
                        user.setRole(requestedRole);
                        user.setUpdatedAt(new Date());
                        userRepository.save(user);
                    } else if (!ROLE_ADMIN.equals(user.getRole())) {
                        return new ErrorResponse("❌ Account role mismatch");
                    }
                }
            } else {
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getStudentEmail(), user.getRole());

            return new AuthResponse(
                    token,
                    user.getStudentEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getUsername(),
                    user.getItNumber(),
                    user.getProfilePhoto(),
                    user.getRole(),
                    jwtUtil.getExpirationTime()
            );
        } catch (RestClientException e) {
            return new ErrorResponse("❌ Unable to verify Google login");
        } catch (Exception e) {
            return new ErrorResponse("❌ Google login failed: " + e.getMessage());
        }
    }

    private User createGoogleUser(Map<?, ?> tokenInfo, String email, String role) {
        String firstName = defaultString(valueAsString(tokenInfo.get("given_name")), extractFirstName(email));
        String lastName = defaultString(valueAsString(tokenInfo.get("family_name")), "User");
        String username = makeUsername(email, role);
        String itNumber = makeUniqueItNumber(email);
        String nicNumber = makeUniqueNicNumber(email);
        String profilePhoto = valueAsString(tokenInfo.get("picture"));

        User user = new User();
        user.setStudentEmail(email);
        user.setItNumber(itNumber);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setNicNumber(nicNumber);
        user.setProfilePhoto(profilePhoto);
        user.setRole(role == null ? ROLE_LECTURER : role);
        user.setEnabled(true);
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        return user;
    }

    private String normalizeRole(String role) {
        if (role == null) {
            return null;
        }

        String normalized = role.trim().toUpperCase();
        if (ROLE_ADMIN.equals(normalized) || ROLE_TECHNICIAN.equals(normalized) || ROLE_LECTURER.equals(normalized)) {
            return normalized;
        }

        return null;
    }

    private String makeUsername(String email, String role) {
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        String suffix = role == null ? "google" : role.toLowerCase();
        return (localPart + "-" + suffix).replaceAll("[^a-zA-Z0-9_-]", "");
    }

    private String makeUniqueItNumber(String email) {
        long numeric = Math.abs(email.hashCode());
        return String.format("GG%08d", numeric % 100000000L);
    }

    private String makeUniqueNicNumber(String email) {
        long numeric = Math.abs((email + "nic").hashCode());
        return String.format("99%07dV", numeric % 10000000L);
    }

    private String extractFirstName(String email) {
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        if (localPart.isEmpty()) {
            return "Google";
        }
        return Character.toUpperCase(localPart.charAt(0)) + localPart.substring(1);
    }

    private String valueAsString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.trim().isEmpty() ? fallback : value;
    }

    /**
     * FORGOT PASSWORD endpoint
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public Object forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            Optional<User> user = userRepository.findByStudentEmail(request.getEmail());

            if (!user.isPresent()) {
                return new SuccessResponse("✅ If email exists, reset code has been sent");
            }

            User foundUser = user.get();
            String resetCode = generateResetCode();

            foundUser.setResetCode(resetCode);
            foundUser.setResetCodeExpiry(new Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15 minutes

            userRepository.save(foundUser);

            // TODO: Send reset code via email
            System.out.println("📧 Reset code for " + foundUser.getStudentEmail() + ": " + resetCode);

            return new SuccessResponse("✅ Reset code sent to " + maskEmail(foundUser.getStudentEmail()));

        } catch (Exception e) {
            return new ErrorResponse("❌ Failed to process forgot password: " + e.getMessage());
        }
    }

    /**
     * RESET PASSWORD endpoint
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public Object resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            if (!PasswordValidator.isStrong(request.getNewPassword())) {
                return new ErrorResponse("❌ " + PasswordValidator.getPasswordRequirements());
            }

            Optional<User> user = userRepository.findByStudentEmail(request.getEmail());

            if (!user.isPresent()) {
                return new ErrorResponse("❌ User not found");
            }

            User foundUser = user.get();

            // Validate reset code
            if (foundUser.getResetCode() == null || !foundUser.getResetCode().equals(request.getResetCode())) {
                return new ErrorResponse("❌ Invalid reset code");
            }

            // Check if reset code has expired
            if (foundUser.getResetCodeExpiry() == null || new Date().after(foundUser.getResetCodeExpiry())) {
                return new ErrorResponse("❌ Reset code has expired. Please request a new one");
            }

            // Update password
            foundUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
            foundUser.setResetCode(null);
            foundUser.setResetCodeExpiry(null);
            foundUser.setUpdatedAt(new Date());

            userRepository.save(foundUser);

            return new SuccessResponse("✅ Password reset successfully. Please login with your new password");

        } catch (Exception e) {
            return new ErrorResponse("❌ Password reset failed: " + e.getMessage());
        }
    }

    /**
     * VALIDATE TOKEN endpoint
     * GET /api/auth/validate?token=jwt-token
     */
    @GetMapping("/validate")
    public Object validateToken(@RequestParam("token") String token) {
        boolean isValid = jwtUtil.isTokenValid(token);
        if (isValid) {
            return new SuccessResponse("✅ Token is valid");
        } else {
            return new ErrorResponse("❌ Token is invalid or expired");
        }
    }

    // Helper methods

    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }

    private String maskEmail(String email) {
        String[] parts = email.split("@");
        if (parts[0].length() <= 3) {
            return "*".repeat(parts[0].length()) + "@" + parts[1];
        }
        return parts[0].substring(0, 3) + "*".repeat(parts[0].length() - 3) + "@" + parts[1];
    }

    // Response DTOs

    public static class SuccessResponse {
        public String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}

