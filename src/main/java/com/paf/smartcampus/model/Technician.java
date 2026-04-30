package com.paf.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "technicians")
public class Technician {

    @Id
    private String id;
    
    private String email;
    private String name;
    private String technicianType;
    private int completedTickets; // Higher = more experienced
    private double rating; // 0-5, higher = better
    private boolean available;
    private Date joinedDate;

    public Technician() {}

    public Technician(String email, String name, String technicianType) {
        this.email = email;
        this.name = name;
        this.technicianType = technicianType;
        this.completedTickets = 0;
        this.rating = 5.0;
        this.available = true;
        this.joinedDate = new Date();
    }

    // Priority score calculation (higher = more suitable)
    public double getPriorityScore() {
        return (completedTickets * 0.6) + (rating * 0.4);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTechnicianType() { return technicianType; }
    public void setTechnicianType(String technicianType) { this.technicianType = technicianType; }

    public int getCompletedTickets() { return completedTickets; }
    public void setCompletedTickets(int completedTickets) { this.completedTickets = completedTickets; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public Date getJoinedDate() { return joinedDate; }
    public void setJoinedDate(Date joinedDate) { this.joinedDate = joinedDate; }
}
