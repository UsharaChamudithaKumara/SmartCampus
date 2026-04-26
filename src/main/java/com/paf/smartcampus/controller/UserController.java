package com.paf.smartcampus.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.model.User;
import com.paf.smartcampus.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam("email") String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Email parameter is missing"));
        }

        Optional<User> userOpt = userRepository.findByStudentEmail(email);
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
        }

        User user = userOpt.get();
        // Clear sensitive info before returning
        user.setPassword(null);
        user.setResetCode(null);
        user.setResetCodeExpiry(null);

        return ResponseEntity.ok(user);
    }

    public static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}
