package com.paf.smartcampus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@smartcampus.com}")
    private String fromEmail;

    public void sendTicketRejectedEmail(String to, String ticketTitle, String reason) {
        if (to == null || to.isBlank()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Ticket Rejected: " + ticketTitle);
            message.setText("Your ticket \"" + ticketTitle + "\" was rejected.\n\nReason: " + reason + "\n\nPlease resubmit a ticket if necessary.");
            mailSender.send(message);
            System.out.println("Real email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendTicketStatusUpdateEmail(String to, String ticketTitle, String newStatus) {
        if (to == null || to.isBlank()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Ticket Status Updated: " + ticketTitle);
            message.setText("The status of your ticket \"" + ticketTitle + "\" has been updated to: " + newStatus + ".");
            mailSender.send(message);
            System.out.println("Real email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendTicketAssignedEmail(String to, String ticketTitle) {
        if (to == null || to.isBlank()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("New Ticket Assigned: " + ticketTitle);
            message.setText("You have been assigned to a new ticket: \"" + ticketTitle + "\".\n\nPlease check your Staff Dashboard for more details.");
            mailSender.send(message);
            System.out.println("Real email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
