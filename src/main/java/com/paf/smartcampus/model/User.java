package com.paf.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Date;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String studentEmail; // Must end with @my.sliit.lk

    @Indexed(unique = true)
    private String itNumber; // IT number (e.g., IT21001)

    private String password; // Will be hashed (bcrypt)

    private String firstName;

    private String lastName;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String nicNumber;

    private String profilePhoto; // URL to profile photo

    private String role = "USER"; // USER, TECHNICIAN, ADMIN

    private boolean enabled = true;

    private Date createdAt;

    private Date updatedAt;

    private String resetCode; // temporary reset code

    private Date resetCodeExpiry;

    public User() {}

    public User(String studentEmail, String itNumber, String password, String firstName, String lastName, 
                String username, String nicNumber, String profilePhoto) {
        this.studentEmail = studentEmail;
        this.itNumber = itNumber;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.nicNumber = nicNumber;
        this.profilePhoto = profilePhoto;
        this.role = "USER";
        this.enabled = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getItNumber() { return itNumber; }
    public void setItNumber(String itNumber) { this.itNumber = itNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public String getResetCode() { return resetCode; }
    public void setResetCode(String resetCode) { this.resetCode = resetCode; }

    public Date getResetCodeExpiry() { return resetCodeExpiry; }
    public void setResetCodeExpiry(Date resetCodeExpiry) { this.resetCodeExpiry = resetCodeExpiry; }
}


