package com.paf.smartcampus.repository;

import com.paf.smartcampus.model.AdminUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends MongoRepository<AdminUser, String> {
    Optional<AdminUser> findByUsername(String username);
    Optional<AdminUser> findByEmail(String email);
}
