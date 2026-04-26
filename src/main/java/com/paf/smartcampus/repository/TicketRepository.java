package com.paf.smartcampus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.paf.smartcampus.model.Ticket;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
	List<Ticket> findByUserId(String userId);
	List<Ticket> findByAssignedTo(String assignedTo);
	List<Ticket> findByStatus(String status);
}
