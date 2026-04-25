package com.paf.smartcampus.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.model.Ticket;
import com.paf.smartcampus.model.Comment;
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
        if (ticket.getComments() == null) ticket.setComments(new ArrayList<>());
        if (ticket.getImageUrls() == null) ticket.setImageUrls(new ArrayList<>());
        if (ticket.getPreferredContactEmail() == null || ticket.getPreferredContactEmail().isBlank()) {
            ticket.setPreferredContactEmail(ticket.getUserId());
        }
        if (ticket.getPreferredContactName() == null || ticket.getPreferredContactName().isBlank()) {
            ticket.setPreferredContactName(ticket.getUserId());
        }
        return repo.save(ticket);
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable String id) {
        return repo.findById(id).orElseThrow();
    }

    // GET all tickets
    @GetMapping
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    // GET tickets by user
    @GetMapping("/user/{userId}")
    public List<Ticket> getByUser(@PathVariable String userId) {
        return repo.findByUserId(userId);
    }

    // VALIDATE status values
    private boolean isValidStatus(String status) {
        return status.equals("OPEN") ||
               status.equals("IN_PROGRESS") ||
               status.equals("RESOLVED") ||
               status.equals("CLOSED") ||
               status.equals("REJECTED");
    }

    private void ensureCommentsList(Ticket ticket) {
        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }
    }

    // Single file upload (keeps compatibility)
    @PostMapping("/{id}/upload")
    public String uploadImage(@PathVariable String id,
                              @RequestParam("file") MultipartFile file) {

        try {
            // folder to save images
            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // unique filename to avoid collisions
            String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            String filePath = uploadDir + filename;

            // save file
            file.transferTo(new File(filePath));

            // update ticket with accessible URL
            Ticket t = repo.findById(id).orElseThrow();
            if (t.getImageUrls() == null) t.setImageUrls(new ArrayList<>());
            t.getImageUrls().add("/uploads/" + filename);
            repo.save(t);

            return "✅ Image uploaded successfully";

        } catch (IOException e) {
            return "❌ Upload failed: " + e.getMessage();
        }
    }

    // Multi-file upload (max 3)
    @PostMapping("/{id}/uploads")
    public String uploadImages(@PathVariable String id, @RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) return "❌ No files provided";
        if (files.length > 3) return "❌ Maximum 3 images allowed";
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();
            Ticket t = repo.findById(id).orElseThrow();
            if (t.getImageUrls() == null) t.setImageUrls(new ArrayList<>());
            for (MultipartFile file : files) {
                String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
                String filePath = uploadDir + filename;
                file.transferTo(new File(filePath));
                t.getImageUrls().add("/uploads/" + filename);
            }
            repo.save(t);
            return "✅ Images uploaded successfully";
        } catch (IOException e) {
            return "❌ Upload failed: " + e.getMessage();
        }
    }

    // UPDATE status with validation (REJECTED requires reason)
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable String id, @RequestParam String status, @RequestParam(required = false) String reason) {

        if (!isValidStatus(status)) {
            return "❌ Invalid status!";
        }

        Ticket t = repo.findById(id).orElseThrow();
        if ("REJECTED".equals(status)) {
            if (reason == null || reason.isBlank()) {
                return "❌ Rejected status requires a reason";
            }
            t.setRejectedReason(reason);
        } else {
            t.setRejectedReason(null);
        }
        t.setStatus(status);
        repo.save(t);

        return "✅ Status updated successfully";
    }

    // ASSIGN technician (admin-only: status becomes IN_PROGRESS)
    @PutMapping("/{id}/assign")
    public Object assign(@PathVariable String id, @RequestParam String technician) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setAssignedTo(technician);
        t.setStatus("IN_PROGRESS");
        return repo.save(t);
    }

    // GET tickets assigned to technician
    @GetMapping("/technician/{technicianEmail}")
    public List<Ticket> getAssignedToTechnician(@PathVariable String technicianEmail) {
        return repo.findByAssignedTo(technicianEmail);
    }

    // TECHNICIAN updates resolution notes (status becomes RESOLVED)
    @PutMapping("/{id}/technician/resolve")
    public Object technicianResolve(@PathVariable String id, @RequestParam String notes) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getStatus() == null || (!t.getStatus().equals("IN_PROGRESS") && !t.getStatus().equals("OPEN"))) {
            return "❌ Only IN_PROGRESS or OPEN tickets can be marked RESOLVED";
        }
        t.setResolutionNotes(notes);
        t.setStatus("RESOLVED");
        return repo.save(t);
    }

    // ADMIN closes RESOLVED ticket
    @PutMapping("/{id}/admin/close")
    public Object adminClose(@PathVariable String id) {
        Ticket t = repo.findById(id).orElseThrow();
        if (!"RESOLVED".equals(t.getStatus())) {
            return "❌ Only RESOLVED tickets can be closed. Current status: " + t.getStatus();
        }
        t.setStatus("CLOSED");
        return repo.save(t);
    }

    // ADD comment
    @PostMapping("/{id}/comments")
    public Ticket addComment(@PathVariable String id, @RequestBody Comment comment) {
        Ticket t = repo.findById(id).orElseThrow();
        ensureCommentsList(t);
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(null);
        t.getComments().add(comment);
        return repo.save(t);
    }

    // EDIT comment (author-only)
    @PutMapping("/{id}/comments/{commentId}")
    public Object editComment(@PathVariable String id, @PathVariable String commentId, @RequestBody Map<String, String> payload) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getComments() == null) return "❌ No comments";
        for (Comment c : t.getComments()) {
            if (c.getId().equals(commentId)) {
                String authorId = payload.get("authorId");
                if (authorId == null || !authorId.equals(c.getAuthorId())) {
                    return "❌ Not authorized to edit this comment";
                }
                c.setText(payload.get("text"));
                c.setUpdatedAt(new Date());
                return repo.save(t);
            }
        }
        return "❌ Comment not found";
    }

    // DELETE comment (author-only)
    @DeleteMapping("/{id}/comments/{commentId}")
    public Object deleteComment(@PathVariable String id, @PathVariable String commentId, @RequestParam String authorId) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getComments() == null) return "❌ No comments";
        Iterator<Comment> it = t.getComments().iterator();
        while (it.hasNext()) {
            Comment c = it.next();
            if (c.getId().equals(commentId)) {
                if (!c.getAuthorId().equals(authorId)) {
                    return "❌ Not authorized to delete this comment";
                }
                it.remove();
                return repo.save(t);
            }
        }
        return "❌ Comment not found";
    }

    // Add or update resolution notes (sets status RESOLVED when notes provided)
    @PutMapping("/{id}/resolution")
    public Ticket addResolution(@PathVariable String id, @RequestParam String notes) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setResolutionNotes(notes);
        if (notes != null && !notes.isBlank()) {
            t.setStatus("RESOLVED");
        }
        return repo.save(t);
    }
}