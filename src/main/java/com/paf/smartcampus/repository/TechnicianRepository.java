package com.paf.smartcampus.repository;

import com.paf.smartcampus.model.Technician;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends MongoRepository<Technician, String> {
    Optional<Technician> findByEmail(String email);
    List<Technician> findByTechnicianType(String technicianType);
    List<Technician> findByAvailable(boolean available);
    List<Technician> findAll();
}
