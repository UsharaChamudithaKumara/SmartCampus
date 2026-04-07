package com.paf.smartcampus.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf.smartcampus.model.Ticket;
import com.paf.smartcampus.repository.TicketRepository;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketRepository repo;

    // CREATE ticket
    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setComments(new ArrayList<>());
        return repo.save(ticket);
    }

    // GET all tickets
    @GetMapping
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    // UPDATE status
    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id, @RequestParam String status) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setStatus(status);
        return repo.save(t);
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
        t.getComments().add(comment);
        return repo.save(t);
    }
}