package com.paf.smartcampus.controller;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.dto.AuthRequest;
import com.paf.smartcampus.dto.AuthResponse;
import com.paf.smartcampus.dto.ForgotPasswordRequest;
import com.paf.smartcampus.dto.PasswordResetRequest;
import com.paf.smartcampus.dto.SignupRequest;
import com.paf.smartcampus.model.User;
import com.paf.smartcampus.repository.UserRepository;
import com.paf.smartcampus.util.JwtUtil;
import com.paf.smartcampus.util.PasswordValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * SIGNUP endpoint
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public Object signup(@Valid @RequestBody SignupRequest request) {
        try {
            // Validate student number - must be 2 letters followed by 8 digits
            if (request.getItNumber() == null || request.getItNumber().trim().isEmpty()) {
                return new ErrorResponse("❌ Student number is required (format: 2 letters + 8 digits)");
            }
            
            String itNumber = request.getItNumber().trim().toUpperCase();
            if (!itNumber.matches("^[A-Z]{2}\\d{8}$")) {
                return new ErrorResponse("❌ Student number must be 2 letters followed by 8 digits (e.g., IT23456789)");
            }

            // Validate student email format
            String studentEmail = request.getStudentEmail();
            if (studentEmail != null && !studentEmail.trim().isEmpty()) {
                // User provided custom email - validate it matches student number format
                studentEmail = studentEmail.trim();
                String expectedEmail = itNumber + "@my.sliit.lk";
                if (!studentEmail.equals(expectedEmail)) {
                    return new ErrorResponse("❌ Email must match student number format: " + expectedEmail);
                }
            } else {
                // Auto-generate email from the full student number
                studentEmail = itNumber + "@my.sliit.lk";
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

            userRepository.save(newUser);

            // Generate token
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
    public Object validateToken(@RequestParam String token) {
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

