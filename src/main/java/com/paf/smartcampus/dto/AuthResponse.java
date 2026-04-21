package com.paf.smartcampus.dto;

public class AuthResponse {
    private String token;
    private String studentEmail;
    private String firstName;
    private String lastName;
    private String username;
    private String itNumber;
    private String profilePhoto;
    private String role;
    private long expiresIn;

    public AuthResponse(String token, String studentEmail, String firstName, String lastName, 
                       String username, String itNumber, String profilePhoto, String role, long expiresIn) {
        this.token = token;
        this.studentEmail = studentEmail;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.itNumber = itNumber;
        this.profilePhoto = profilePhoto;
        this.role = role;
        this.expiresIn = expiresIn;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getItNumber() { return itNumber; }
    public void setItNumber(String itNumber) { this.itNumber = itNumber; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }
}
