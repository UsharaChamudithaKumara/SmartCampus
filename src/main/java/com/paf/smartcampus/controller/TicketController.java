package com.paf.smartcampus.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.model.Ticket;
import com.paf.smartcampus.repository.TicketRepository;

import jakarta.validation.Valid;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketRepository repo;

    // CREATE ticket (with validation)
    @PostMapping
    public Ticket create(@Valid @RequestBody Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setComments(new ArrayList<>());
        return repo.save(ticket);
    }

    // GET all tickets
    @GetMapping
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    // GET tickets by user
    @GetMapping("/user/{userId}")
    public List<Ticket> getByUser(@PathVariable String userId) {
        return repo.findAll()
                .stream()
                .filter(t -> t.getUserId().equals(userId))
                .toList();
    }

    // VALIDATE status values
    private boolean isValidStatus(String status) {
        return status.equals("OPEN") ||
               status.equals("IN_PROGRESS") ||
               status.equals("RESOLVED") ||
               status.equals("CLOSED");
    }

    @PostMapping("/{id}/uploads")
public String uploadImage(@PathVariable String id,
                          @RequestParam("file") MultipartFile file) {

    try {
        // folder to save images
        String uploadDir = "uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // create file path
        String filePath = uploadDir + file.getOriginalFilename();

        // save file
        file.transferTo(new File(filePath));

        // update ticket
        Ticket t = repo.findById(id).orElseThrow();
        t.setImageUrl(filePath);
        repo.save(t);

        return "✅ Image uploaded successfully";

    } catch (IOException e) {
        return "❌ Upload failed: " + e.getMessage();
    }
}

    // UPDATE status with validation
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable String id, @RequestParam String status) {

        if (!isValidStatus(status)) {
            return "❌ Invalid status!";
        }

        Ticket t = repo.findById(id).orElseThrow();
        t.setStatus(status);
        repo.save(t);

        return "✅ Status updated successfully";
    }

    // ASSIGN technician
    @PutMapping("/{id}/assign")
    public Ticket assign(@PathVariable String id, @RequestParam String technician) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setAssignedTo(technician);
        t.setStatus("IN_PROGRESS");
        return repo.save(t);
    }

    // ADD comment
    @PutMapping("/{id}/comment")
    public Ticket addComment(@PathVariable String id, @RequestBody String comment) {
        Ticket t = repo.findById(id).orElseThrow();

        if (t.getComments() == null) {
            t.setComments(new ArrayList<>());
        }

        t.getComments().add(comment);
        return repo.save(t);
    }
}