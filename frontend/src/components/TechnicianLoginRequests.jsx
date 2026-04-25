import { useEffect, useState } from "react";
import { getPendingTechnicianRequests, approveTechnicianRequest, rejectTechnicianRequest } from "../api";

export default function TechnicianLoginRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const adminEmail = localStorage.getItem("userEmail");

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingTechnicianRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (requestId, techEmail) => {
    if (!window.confirm(`Approve login for ${techEmail}?`)) return;
    try {
      await approveTechnicianRequest(requestId, adminEmail);
      loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setRejectionReason("");
    setRejectModal(true);
  };

  const handleSubmitReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }
    try {
      await rejectTechnicianRequest(selectedRequestId, rejectionReason);
      setRejectModal(false);
      setRejectionReason("");
      loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔐 Technician Login Requests</h2>
        <p style={styles.subtitle}>Pending Approvals</p>
      </div>

      {loading && <p style={styles.loading}>Loading requests...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && requests.length === 0 && (
        <p style={styles.noData}>No pending technician login requests.</p>
      )}

      {!loading && requests.length > 0 && (
        <div style={styles.grid}>
          {requests.map((req) => (
            <div key={req.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.name}>{req.technicianName}</p>
                  <p style={styles.email}>{req.technicianEmail}</p>
                </div>
                <span style={styles.badge}>{req.technicianType}</span>
              </div>

              <div style={styles.details}>
                <p>
                  <strong>Status:</strong> <span style={styles.pending}>PENDING</span>
                </p>
                <p>
                  <strong>Requested:</strong> {new Date(req.requestedAt).toLocaleString()}
                </p>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => handleApprove(req.id, req.technicianEmail)}
                  style={styles.approveBtn}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleRejectClick(req.id)}
                  style={styles.rejectBtn}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Reject Login Request</h3>
            <p style={styles.modalNote}>Provide a reason for rejection</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={styles.textarea}
              rows={4}
            />
            <div style={styles.modalActions}>
              <button onClick={handleSubmitReject} style={styles.confirmBtn}>
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setRejectModal(false);
                  setRejectionReason("");
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", background: "#f8fafc", borderRadius: "12px", marginBottom: "24px" },
  header: { marginBottom: "20px" },
  title: { fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0" },
  subtitle: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  name: { fontSize: "15px", fontWeight: "600", color: "#1e293b", margin: "0" },
  email: { fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" },
  badge: { background: "#dbeafe", color: "#0369a1", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" },
  details: { fontSize: "12px", color: "#475569", marginBottom: "12px" },
  pending: { color: "#f59e0b", fontWeight: "600" },
  actions: { display: "flex", gap: "8px" },
  approveBtn: {
    flex: 1,
    padding: "8px 12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  rejectBtn: {
    flex: 1,
    padding: "8px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
  },
  modalNote: { fontSize: "13px", color: "#64748b", margin: "8px 0 12px 0" },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  modalActions: { display: "flex", gap: "8px" },
  confirmBtn: {
    flex: 1,
    padding: "8px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  cancelBtn: {
    flex: 1,
    padding: "8px 12px",
    background: "#e2e8f0",
    color: "#475569",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  loading: { textAlign: "center", color: "#94a3b8", padding: "20px" },
  error: { background: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "6px", fontSize: "13px" },
  noData: { textAlign: "center", color: "#94a3b8", padding: "20px", fontSize: "14px" },
};
