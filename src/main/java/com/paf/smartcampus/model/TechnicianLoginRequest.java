package com.paf.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "technician_login_requests")
public class TechnicianLoginRequest {

    @Id
    private String id;

    private String technicianEmail;
    private String technicianName;
    private String technicianType; // HARDWARE, SOFTWARE, NETWORK, GENERAL
    private String status; // PENDING, APPROVED, REJECTED

    private Date requestedAt;
    private Date approvedAt;
    private String approvedBy; // admin email
    private String rejectionReason;

    public TechnicianLoginRequest() {}

    public TechnicianLoginRequest(String technicianEmail, String technicianName, String technicianType) {
        this.technicianEmail = technicianEmail;
        this.technicianName = technicianName;
        this.technicianType = technicianType;
        this.status = "PENDING";
        this.requestedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTechnicianEmail() { return technicianEmail; }
    public void setTechnicianEmail(String technicianEmail) { this.technicianEmail = technicianEmail; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getTechnicianType() { return technicianType; }
    public void setTechnicianType(String technicianType) { this.technicianType = technicianType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getRequestedAt() { return requestedAt; }
    public void setRequestedAt(Date requestedAt) { this.requestedAt = requestedAt; }

    public Date getApprovedAt() { return approvedAt; }
    public void setApprovedAt(Date approvedAt) { this.approvedAt = approvedAt; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
