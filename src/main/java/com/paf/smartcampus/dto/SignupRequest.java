package com.paf.smartcampus.dto;

public class SignupRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String itNumber;      // Must be 8 digits
    private String studentEmail;   // Format: IT{itNumber}@my.sliit.lk (auto-generated but can be overridden)
    private String nicNumber;
    private String password;
    private String confirmPassword;
    private String profilePhoto;   // Base64 encoded

    public SignupRequest() {}

    public SignupRequest(String firstName, String lastName, String username, String itNumber,
                        String studentEmail, String nicNumber, String password, 
                        String confirmPassword, String profilePhoto) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.itNumber = itNumber;
        this.studentEmail = studentEmail;
        this.nicNumber = nicNumber;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.profilePhoto = profilePhoto;
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getItNumber() { return itNumber; }
    public void setItNumber(String itNumber) { this.itNumber = itNumber; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}
