package com.paf.smartcampus.service;

import com.paf.smartcampus.dto.BookingRequestDTO;
import com.paf.smartcampus.model.Booking;
import com.paf.smartcampus.model.BookingStatus;
import com.paf.smartcampus.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    public Booking createBooking(BookingRequestDTO dto, String userId, String userEmail) {
        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getDate(), dto.getStartTime(), dto.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resource already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setResourceId(dto.getResourceId());
        booking.setUserId(userId);
        booking.setUserEmail(userEmail);
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setExpectedAttendees(dto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        notificationService.create(
            saved.getUserEmail(),
            "BOOKING_CREATED",
            "Booking request submitted",
            "Your booking request for resource " + saved.getResourceId() + " is now pending approval.",
            saved.getId(),
            "BOOKING");
        return saved;
    }

    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings(String status, String resourceId, String userEmail) {
        if (status != null) return bookingRepository.findByStatus(BookingStatus.valueOf(status.toUpperCase()));
        if (resourceId != null) return bookingRepository.findByResourceId(resourceId);
        if (userEmail != null) return bookingRepository.findByUserEmail(userEmail);
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));
    }

    public Booking approveBooking(String id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PENDING bookings can be approved");
        }
        booking.setStatus(BookingStatus.APPROVED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        notificationService.create(
            saved.getUserEmail(),
            "BOOKING_APPROVED",
            "Booking approved",
            "Your booking for resource " + saved.getResourceId() + " was approved.",
            saved.getId(),
            "BOOKING");
        return saved;
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PENDING bookings can be rejected");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        String safeReason = (reason == null || reason.isBlank()) ? "No reason provided" : reason;
        notificationService.create(
            saved.getUserEmail(),
            "BOOKING_REJECTED",
            "Booking rejected",
            "Your booking for resource " + saved.getResourceId() + " was rejected. Reason: " + safeReason,
            saved.getId(),
            "BOOKING");
        return saved;
    }

    public Booking cancelBooking(String id, String userId) {
        Booking booking = getBookingById(id);
        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own bookings");
        }
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only APPROVED bookings can be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        notificationService.create(
            saved.getUserEmail(),
            "BOOKING_CANCELLED",
            "Booking cancelled",
            "Your booking for resource " + saved.getResourceId() + " was cancelled.",
            saved.getId(),
            "BOOKING");
        return saved;
    }

    public void deleteBooking(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
    }
}