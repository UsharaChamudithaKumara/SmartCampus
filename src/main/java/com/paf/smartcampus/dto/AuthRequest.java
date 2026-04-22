package com.paf.smartcampus.dto;

public class AuthRequest {
    private String studentEmail;
    private String password;
    private String role;
    private String technicianType;

    public AuthRequest() {}

    public AuthRequest(String studentEmail, String password) {
        this.studentEmail = studentEmail;
        this.password = password;
    }

    public AuthRequest(String studentEmail, String password, String role, String technicianType) {
        this.studentEmail = studentEmail;
        this.password = password;
        this.role = role;
        this.technicianType = technicianType;
    }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTechnicianType() { return technicianType; }
    public void setTechnicianType(String technicianType) { this.technicianType = technicianType; }
}
