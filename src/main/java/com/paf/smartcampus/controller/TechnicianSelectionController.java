package com.paf.smartcampus.controller;

import com.paf.smartcampus.model.Technician;
import com.paf.smartcampus.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/technicians")
@CrossOrigin(origins = "*")
public class TechnicianSelectionController {

    @Autowired
    private TechnicianRepository technicianRepository;

    /**
     * GET all available technicians sorted by priority (most suitable first)
     * GET /api/technicians/available
     */
    @GetMapping("/available")
    public List<TechnicianResponse> getAvailableTechnicians() {
        return technicianRepository.findByAvailable(true).stream()
                .map(t -> new TechnicianResponse(t))
                .sorted((t1, t2) -> Double.compare(t2.priorityScore, t1.priorityScore))
                .collect(Collectors.toList());
    }

    /**
     * GET available technicians by type (for specific work)
     * GET /api/technicians/available?type=HARDWARE
     */
    @GetMapping("/available-by-type")
    public List<TechnicianResponse> getAvailableTechniciansByType(@RequestParam String type) {
        return technicianRepository.findByTechnicianType(type).stream()
                .filter(Technician::isAvailable)
                .map(t -> new TechnicianResponse(t))
                .sorted((t1, t2) -> Double.compare(t2.priorityScore, t1.priorityScore))
                .collect(Collectors.toList());
    }

    /**
     * GET all technicians
     * GET /api/technicians/all
     */
    @GetMapping("/all")
    public List<TechnicianResponse> getAllTechnicians() {
        return technicianRepository.findAll().stream()
                .map(t -> new TechnicianResponse(t))
                .sorted((t1, t2) -> Double.compare(t2.priorityScore, t1.priorityScore))
                .collect(Collectors.toList());
    }

    /**
     * GET technician by email
     * GET /api/technicians/{email}
     */
    @GetMapping("/{email}")
    public Object getTechnicianByEmail(@PathVariable String email) {
        try {
            var tech = technicianRepository.findByEmail(email);
            if (tech.isPresent()) {
                return new TechnicianResponse(tech.get());
            }
            return new ErrorMsg("Technician not found");
        } catch (Exception e) {
            return new ErrorMsg("Error: " + e.getMessage());
        }
    }

    /**
     * Create a new technician (internal use)
     * POST /api/technicians
     */
    @PostMapping
    public Object createTechnician(@RequestBody Technician technician) {
        try {
            if (technicianRepository.findByEmail(technician.getEmail()).isPresent()) {
                return new ErrorMsg("Technician with this email already exists");
            }
            Technician saved = technicianRepository.save(technician);
            return new TechnicianResponse(saved);
        } catch (Exception e) {
            return new ErrorMsg("Error creating technician: " + e.getMessage());
        }
    }

    static class TechnicianResponse {
        public String id;
        public String email;
        public String name;
        public String technicianType;
        public int completedTickets;
        public double rating;
        public boolean available;
        public double priorityScore;

        public TechnicianResponse(Technician t) {
            this.id = t.getId();
            this.email = t.getEmail();
            this.name = t.getName();
            this.technicianType = t.getTechnicianType();
            this.completedTickets = t.getCompletedTickets();
            this.rating = t.getRating();
            this.available = t.isAvailable();
            this.priorityScore = t.getPriorityScore();
        }
    }

    static class ErrorMsg {
        public String error;
        public ErrorMsg(String error) { this.error = error; }
    }
}
