package com.paf.smartcampus.repository;

import com.paf.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    // Requirement: Support search and filtering by type 
    List<Resource> findByType(String type);

    // Requirement: Support search and filtering by capacity 
    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    // Requirement: Support search and filtering by location 
    List<Resource> findByLocationContainingIgnoreCase(String location);
}