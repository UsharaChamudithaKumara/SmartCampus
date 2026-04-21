package com.paf.smartcampus.dto;

public class AuthRequest {
    private String studentEmail;
    private String password;

    public AuthRequest() {}

    public AuthRequest(String studentEmail, String password) {
        this.studentEmail = studentEmail;
        this.password = password;
    }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
