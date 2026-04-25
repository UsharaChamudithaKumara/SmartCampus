package com.paf.smartcampus.controller;

import com.paf.smartcampus.dto.BookingRequestDTO;
import com.paf.smartcampus.model.Booking;
import com.paf.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequestDTO dto,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        String resolvedUserId = (userId == null || userId.isBlank()) ? "temp-user-id" : userId;
        String resolvedUserEmail = (userEmail == null || userEmail.isBlank()) ? "temp@email.com" : userEmail;
        Booking created = bookingService.createBooking(dto, resolvedUserId, resolvedUserEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        String resolvedUserId = (userId == null || userId.isBlank()) ? "temp-user-id" : userId;
        return ResponseEntity.ok(bookingService.getMyBookings(resolvedUserId));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "resourceId", required = false) String resourceId,
            @RequestParam(value = "userEmail", required = false) String userEmail) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, resourceId, userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable("id") String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Booking> approveBooking(@PathVariable("id") String id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable("id") String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, body.get("reason")));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        String resolvedUserId = (userId == null || userId.isBlank()) ? "temp-user-id" : userId;
        return ResponseEntity.ok(bookingService.cancelBooking(id, resolvedUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}