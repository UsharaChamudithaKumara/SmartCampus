package com.paf.smartcampus.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.paf.smartcampus.model.Ticket;
import com.paf.smartcampus.repository.TicketRepository;

@Service
public class TicketAutoRejectService {

    private static final int AUTO_REJECT_HOURS = 24;
    private static final String AUTO_REJECT_REASON =
            "Ticket was not assigned to a technician within 24 hours.";

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Scheduled(fixedRate = 60 * 60 * 1000, initialDelay = 60 * 1000)
    public void rejectOldUnassignedOpenTickets() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(AUTO_REJECT_HOURS);
        List<Ticket> openTickets = ticketRepository.findByStatus("OPEN");

        for (Ticket ticket : openTickets) {
            if (!shouldAutoReject(ticket, cutoff)) {
                continue;
            }

            ticket.setStatus("REJECTED");
            ticket.setRejectedReason(AUTO_REJECT_REASON);
            ticket.setUpdatedAt(LocalDateTime.now());
            Ticket saved = ticketRepository.save(ticket);

            notifyStudent(saved);
        }
    }

    private boolean shouldAutoReject(Ticket ticket, LocalDateTime cutoff) {
        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().isBlank()) {
            return false;
        }

        return ticket.getCreatedAt() != null && !ticket.getCreatedAt().isAfter(cutoff);
    }

    private void notifyStudent(Ticket ticket) {
        String recipient = ticket.getPreferredContactEmail();
        if (recipient == null || recipient.isBlank()) {
            recipient = ticket.getUserId();
        }

        String message = "Your ticket \"" + ticket.getTitle()
                + "\" was rejected because it was not assigned to a technician within 24 hours. "
                + "Please resubmit a ticket.";

        emailService.sendTicketRejectedEmail(recipient, ticket.getTitle(), ticket.getRejectedReason());

        notificationService.create(
                recipient,
                "TICKET_AUTO_REJECTED",
                "Ticket rejected",
                message,
                ticket.getId(),
                "TICKET");
    }
}
