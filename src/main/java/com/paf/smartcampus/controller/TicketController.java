package com.paf.smartcampus.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.model.Ticket;
import com.paf.smartcampus.model.Comment;
import com.paf.smartcampus.repository.TicketRepository;
import com.paf.smartcampus.service.EmailService;
import com.paf.smartcampus.service.NotificationService;

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

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

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
        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);
        Ticket saved = repo.save(ticket);

        if (saved.getUserId() != null && !saved.getUserId().isBlank()) {
            notificationService.create(
                    saved.getUserId(),
                    "TICKET_CREATED",
                    "Ticket submitted",
                    "Your ticket \"" + saved.getTitle() + "\" has been submitted successfully.",
                    saved.getId(),
                    "TICKET");
        }

        return saved;
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable("id") String id) {
        return repo.findById(id).orElseThrow();
    }

    // GET all tickets
    @GetMapping
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    // GET tickets by user
    @GetMapping("/user/{userId}")
    public List<Ticket> getByUser(@PathVariable("userId") String userId) {
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
    public String uploadImage(@PathVariable("id") String id,
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
            t.setUpdatedAt(LocalDateTime.now());
            repo.save(t);

            return " Image uploaded successfully";

        } catch (IOException e) {
            return " Upload failed: " + e.getMessage();
        }
    }

    // Multi-file upload (max 3)
    @PostMapping("/{id}/uploads")
    public String uploadImages(@PathVariable("id") String id, @RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) return " No files provided";
        if (files.length > 3) return " Maximum 3 images allowed";
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
            t.setUpdatedAt(LocalDateTime.now());
            repo.save(t);
            return " Images uploaded successfully";
        } catch (IOException e) {
            return " Upload failed: " + e.getMessage();
        }
    }

    // UPDATE status with validation (REJECTED requires reason)
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable("id") String id, @RequestParam("status") String status, @RequestParam(value = "reason", required = false) String reason) {

        if (!isValidStatus(status)) {
            return " Invalid status!";
        }

        Ticket t = repo.findById(id).orElseThrow();
        if ("REJECTED".equals(status)) {
            if (reason == null || reason.isBlank()) {
                return " Rejected status requires a reason";
            }
            t.setRejectedReason(reason);
        } else {
            t.setRejectedReason(null);
        }
        t.setStatus(status);
        t.setUpdatedAt(LocalDateTime.now());
        repo.save(t);

        if ("REJECTED".equals(status)) {
            notifyTicketRejected(t, reason);
        } else {
            String recipient = t.getPreferredContactEmail();
            if (recipient == null || recipient.isBlank()) recipient = t.getUserId();
            emailService.sendTicketStatusUpdateEmail(recipient, t.getTitle(), status);
        }

        return " Status updated successfully";
    }

    private void notifyTicketRejected(Ticket ticket, String reason) {
        String recipient = ticket.getPreferredContactEmail();
        if (recipient == null || recipient.isBlank()) {
            recipient = ticket.getUserId();
        }

        String safeReason = (reason == null || reason.isBlank()) ? "Ticket was rejected." : reason;
        String message = "Your ticket \"" + ticket.getTitle() + "\" was rejected. Please resubmit a ticket.";

        emailService.sendTicketRejectedEmail(recipient, ticket.getTitle(), safeReason);
        notificationService.create(
                recipient,
                "TICKET_REJECTED",
                "Ticket rejected",
                message,
                ticket.getId(),
                "TICKET");
    }

    // ASSIGN technician (admin-only: status becomes IN_PROGRESS)
    @PutMapping("/{id}/assign")
    public Object assign(@PathVariable("id") String id, @RequestParam("technician") String technician) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setAssignedTo(technician);
        t.setStatus("IN_PROGRESS");
        t.setUpdatedAt(LocalDateTime.now());
        Ticket saved = repo.save(t);

        // Send real email
        emailService.sendTicketAssignedEmail(technician, t.getTitle());

        if (technician != null && !technician.isBlank()) {
            notificationService.create(
                    technician,
                    "TICKET_ASSIGNED",
                    "Ticket Assigned To You",
                    "You have been assigned to ticket \"" + t.getTitle() + "\". Please check your Staff Tickets.",
                    t.getId(),
                    "TICKET");
        }

        return saved;
    }

    // GET tickets assigned to technician
    @GetMapping("/technician/{technicianEmail}")
    public List<Ticket> getAssignedToTechnician(@PathVariable("technicianEmail") String technicianEmail) {
        return repo.findByAssignedTo(technicianEmail);
    }

    // TECHNICIAN updates resolution notes (status becomes RESOLVED)
    @PutMapping("/{id}/technician/resolve")
    public Object technicianResolve(@PathVariable("id") String id, @RequestParam("notes") String notes) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getStatus() == null || (!t.getStatus().equals("IN_PROGRESS") && !t.getStatus().equals("OPEN"))) {
            return " Only IN_PROGRESS or OPEN tickets can be marked RESOLVED";
        }
        t.setResolutionNotes(notes);
        t.setStatus("RESOLVED");
        t.setUpdatedAt(LocalDateTime.now());
        return repo.save(t);
    }

    // ADMIN closes RESOLVED ticket
    @PutMapping("/{id}/admin/close")
    public Object adminClose(@PathVariable("id") String id) {
        Ticket t = repo.findById(id).orElseThrow();
        if (!"RESOLVED".equals(t.getStatus())) {
            return " Only RESOLVED tickets can be closed. Current status: " + t.getStatus();
        }
        t.setStatus("CLOSED");
        t.setUpdatedAt(LocalDateTime.now());
        return repo.save(t);
    }

    // ADD comment
    @PostMapping("/{id}/comments")
    public Ticket addComment(@PathVariable("id") String id, @RequestBody Comment comment) {
        Ticket t = repo.findById(id).orElseThrow();
        ensureCommentsList(t);
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(null);
        t.getComments().add(comment);
        t.setUpdatedAt(LocalDateTime.now());
        Ticket saved = repo.save(t);

        String authorId = comment.getAuthorId();
        
        // Notify the ticket creator if they didn't write this comment
        if (t.getUserId() != null && !t.getUserId().isBlank() && !t.getUserId().equals(authorId)) {
            System.out.println(" EMAIL SENT TO STUDENT: " + t.getUserId() + " - Subject: New Comment on Ticket");
            notificationService.create(
                    t.getUserId(),
                    "NEW_COMMENT",
                    "New comment on your ticket",
                    "A new comment was added to your ticket: " + t.getTitle(),
                    t.getId(),
                    "TICKET");
        }

        // Notify the assigned technician if they didn't write this comment
        if (t.getAssignedTo() != null && !t.getAssignedTo().isBlank() && !t.getAssignedTo().equals(authorId)) {
            System.out.println(" EMAIL SENT TO TECHNICIAN: " + t.getAssignedTo() + " - Subject: New Comment on Assigned Ticket");
            notificationService.create(
                    t.getAssignedTo(),
                    "NEW_COMMENT",
                    "New comment on assigned ticket",
                    "A new comment was added to the ticket: " + t.getTitle(),
                    t.getId(),
                    "TICKET");
        }

        return saved;
    }

    // EDIT comment (author-only)
    @PutMapping("/{id}/comments/{commentId}")
    public Object editComment(@PathVariable("id") String id, @PathVariable("commentId") String commentId, @RequestBody Map<String, String> payload) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getComments() == null) return " No comments";
        for (Comment c : t.getComments()) {
            if (c.getId().equals(commentId)) {
                String authorId = payload.get("authorId");
                if (authorId == null || !authorId.equals(c.getAuthorId())) {
                    return " Not authorized to edit this comment";
                }
                c.setText(payload.get("text"));
                c.setUpdatedAt(new Date());
                t.setUpdatedAt(LocalDateTime.now());
                return repo.save(t);
            }
        }
        return " Comment not found";
    }

    // DELETE comment (author-only)
    @DeleteMapping("/{id}/comments/{commentId}")
    public Object deleteComment(@PathVariable("id") String id, @PathVariable("commentId") String commentId, @RequestParam("authorId") String authorId) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getComments() == null) return " No comments";
        Iterator<Comment> it = t.getComments().iterator();
        while (it.hasNext()) {
            Comment c = it.next();
            if (c.getId().equals(commentId)) {
                if (!c.getAuthorId().equals(authorId)) {
                    return " Not authorized to delete this comment";
                }
                it.remove();
                t.setUpdatedAt(LocalDateTime.now());
                return repo.save(t);
            }
        }
        return " Comment not found";
    }

    // Add or update resolution notes (sets status RESOLVED when notes provided)
    @PutMapping("/{id}/resolution")
    public Ticket addResolution(@PathVariable("id") String id, @RequestParam("notes") String notes) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setResolutionNotes(notes);
        if (notes != null && !notes.isBlank()) {
            t.setStatus("RESOLVED");
        }
        t.setUpdatedAt(LocalDateTime.now());
        return repo.save(t);
    }
}

