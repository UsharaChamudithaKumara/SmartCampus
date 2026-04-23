package com.paf.smartcampus.repository;

import com.paf.smartcampus.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByStudentEmail(String studentEmail);
    Optional<User> findByUsername(String username);
    Optional<User> findByItNumber(String itNumber);
    boolean existsByStudentEmail(String studentEmail);
    boolean existsByUsername(String username);
    boolean existsByNicNumber(String nicNumber);
    boolean existsByItNumber(String itNumber);
}
