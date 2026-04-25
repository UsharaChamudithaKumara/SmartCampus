package com.paf.smartcampus.repository;

import com.paf.smartcampus.model.TechnicianLoginRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianLoginRequestRepository extends MongoRepository<TechnicianLoginRequest, String> {
    Optional<TechnicianLoginRequest> findByTechnicianEmail(String email);
    List<TechnicianLoginRequest> findByStatus(String status);
    List<TechnicianLoginRequest> findAll();
}
