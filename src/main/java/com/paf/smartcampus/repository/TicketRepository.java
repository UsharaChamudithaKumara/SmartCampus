package com.paf.smartcampus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.paf.smartcampus.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {

}