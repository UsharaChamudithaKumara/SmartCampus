package com.paf.smartcampus.repository;

import com.paf.smartcampus.model.Booking;
import com.paf.smartcampus.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByUserEmail(String userEmail);

    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': { $in: ['PENDING', 'APPROVED'] }, 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } }")
    List<Booking> findConflictingBookings(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);
}