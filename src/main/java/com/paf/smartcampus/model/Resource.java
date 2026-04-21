package com.paf.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Document(collection = "resources") // Maps this class to the "resources" collection in MongoDB
@Data // Lombok annotation to generate getters, setters, and constructors
public class Resource {
    @Id
    private String id; // Unique identifier for each resource
    
    // Core metadata required by Module A 
    private String name; // Name of the facility (e.g., "Lab 01")
    private String type; // e.g., "lecture hall", "lab", "meeting room", "projector" [cite: 24]
    private int capacity; // Number of people it can hold 
    private String location; // Building or floor 
    private List<String> availabilityWindows; // Time ranges for booking 
    
    // Status MUST support "ACTIVE" or "OUT_OF_SERVICE" 
    private String status; 
}