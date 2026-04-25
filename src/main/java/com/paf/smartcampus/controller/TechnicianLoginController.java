package com.paf.smartcampus.controller;

import com.paf.smartcampus.model.Technician;
import com.paf.smartcampus.model.TechnicianLoginRequest;
import com.paf.smartcampus.repository.TechnicianLoginRequestRepository;
import com.paf.smartcampus.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/technician-login-requests")
@CrossOrigin(origins = "*")
public class TechnicianLoginController {

    @Autowired
    private TechnicianLoginRequestRepository repository;

    @Autowired
    private TechnicianRepository technicianRepository;

    // GET all pending requests
    @GetMapping
    public List<TechnicianLoginRequest> getAllRequests() {
        return repository.findAll();
    }

    // GET pending requests only
    @GetMapping("/pending")
    public List<TechnicianLoginRequest> getPendingRequests() {
        return repository.findByStatus("PENDING");
    }

    // GET approved requests only
    @GetMapping("/approved")
    public List<TechnicianLoginRequest> getApprovedRequests() {
        return repository.findByStatus("APPROVED");
    }

    // GET request status for a technician
    @GetMapping("/status/{email}")
    public Object getRequestStatus(@PathVariable String email) {
        try {
            var request = repository.findByTechnicianEmail(email);
            if (request.isPresent()) {
                return request.get();
            }
            return new ErrorMsg("No request found for this technician");
        } catch (Exception e) {
            return new ErrorMsg("Error: " + e.getMessage());
        }
    }

    // APPROVE technician login request (admin-only)
    @PutMapping("/{id}/approve")
    public Object approveRequest(@PathVariable String id, @RequestParam String adminEmail) {
        try {
            var request = repository.findById(id);
            if (!request.isPresent()) {
                return new ErrorMsg("Request not found");
            }

            TechnicianLoginRequest loginReq = request.get();
            loginReq.setStatus("APPROVED");
            loginReq.setApprovedAt(new Date());
            loginReq.setApprovedBy(adminEmail);
            repository.save(loginReq);

            if (!technicianRepository.findByEmail(loginReq.getTechnicianEmail()).isPresent()) {
                Technician technician = new Technician(
                    loginReq.getTechnicianEmail(),
                    loginReq.getTechnicianName(),
                    loginReq.getTechnicianType() != null ? loginReq.getTechnicianType() : "GENERAL"
                );
                technicianRepository.save(technician);
            }

            return new SuccessMsg("✅ Technician " + loginReq.getTechnicianEmail() + " approved successfully");
        } catch (Exception e) {
            return new ErrorMsg("Error approving request: " + e.getMessage());
        }
    }

    // REJECT technician login request (admin-only)
    @PutMapping("/{id}/reject")
    public Object rejectRequest(@PathVariable String id, @RequestParam String reason) {
        try {
            var request = repository.findById(id);
            if (!request.isPresent()) {
                return new ErrorMsg("Request not found");
            }

            TechnicianLoginRequest loginReq = request.get();
            loginReq.setStatus("REJECTED");
            loginReq.setRejectionReason(reason);
            repository.save(loginReq);

            return new SuccessMsg("✅ Request rejected");
        } catch (Exception e) {
            return new ErrorMsg("Error rejecting request: " + e.getMessage());
        }
    }

    static class SuccessMsg {
        public String message;
        public SuccessMsg(String message) { this.message = message; }
    }

    static class ErrorMsg {
        public String error;
        public ErrorMsg(String error) { this.error = error; }
    }
}
