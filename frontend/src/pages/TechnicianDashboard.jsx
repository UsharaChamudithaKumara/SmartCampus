import { useEffect, useState } from "react";
import { fetchTicketsForTechnician, technicianResolveTicket } from "../api";

const STATUS_COLORS = {
  OPEN: { bg: "#fef3c7", text: "#b45309" },
  "IN_PROGRESS": { bg: "#dbeafe", text: "#1e40af" },
  RESOLVED: { bg: "#dcfce7", text: "#166534" },
  CLOSED: { bg: "#e5e7eb", text: "#374151" },
  REJECTED: { bg: "#fee2e2", text: "#991b1b" },
};

export default function TechnicianDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolveModal, setResolveModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const techEmail = localStorage.getItem("userEmail");

  const loadAssignedTickets = async () => {
    if (!techEmail) {
      setError("Technician email not found");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const tickets = await fetchTicketsForTechnician(techEmail);
      setTickets(Array.isArray(tickets) ? tickets : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedTickets();
  }, [techEmail]);

  const handleResolveClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setResolutionNotes("");
    setResolveModal(true);
  };

  const handleSubmitResolution = async () => {
    if (!resolutionNotes.trim()) {
      alert("Please enter resolution notes");
      return;
    }
    try {
      await technicianResolveTicket(selectedTicketId, resolutionNotes);
      setResolveModal(false);
      setResolutionNotes("");
      loadAssignedTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const inProgressTickets = tickets.filter((t) => t.status === "IN_PROGRESS");
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED");

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Technician Dashboard</h1>
        <p style={styles.subtitle}>Your Assigned Tickets</p>
        <p style={styles.email}>Logged in as: {techEmail}</p>
      </div>

      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{inProgressTickets.length}</p>
          <p style={styles.statLabel}>In Progress</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{resolvedTickets.length}</p>
          <p style={styles.statLabel}>Resolved (Pending Admin)</p>
        </div>
      </div>

      {loading && <p style={styles.loading}>Loading your tickets...</p>}
      {error && <p style={styles.errorMsg}>{error}</p>}

      {tickets.length === 0 && !loading && (
        <p style={styles.noTickets}>No tickets assigned to you yet.</p>
      )}

      {inProgressTickets.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔧 In Progress - Work on These</h2>
          <div style={styles.grid}>
            {inProgressTickets.map((ticket) => (
              <div key={ticket.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <p style={styles.ticketId}>#{ticket.id.substring(0, 8)}</p>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: STATUS_COLORS[ticket.status]?.bg,
                      color: STATUS_COLORS[ticket.status]?.text,
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>

                <h3 style={styles.ticketTitle}>{ticket.title}</h3>
                <p style={styles.description}>{ticket.description}</p>

                <div style={styles.details}>
                  <p>
                    <strong>Category:</strong> {ticket.category}
                  </p>
                  <p>
                    <strong>Priority:</strong> {ticket.priority}
                  </p>
                  <p>
                    <strong>Reported by:</strong> {ticket.preferredContactEmail}
                  </p>
                </div>

                <button
                  onClick={() => handleResolveClick(ticket.id)}
                  style={styles.resolveBtn}
                >
                  ✓ Mark as Resolved
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolvedTickets.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>✓ Resolved - Awaiting Admin Closure</h2>
          <div style={styles.grid}>
            {resolvedTickets.map((ticket) => (
              <div key={ticket.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <p style={styles.ticketId}>#{ticket.id.substring(0, 8)}</p>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: STATUS_COLORS[ticket.status]?.bg,
                      color: STATUS_COLORS[ticket.status]?.text,
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>

                <h3 style={styles.ticketTitle}>{ticket.title}</h3>

                {ticket.resolutionNotes && (
                  <div style={styles.resolutionBox}>
                    <p style={styles.resolutionLabel}>Your Resolution Notes:</p>
                    <p style={styles.resolutionText}>{ticket.resolutionNotes}</p>
                  </div>
                )}

                <p style={styles.pendingAdminText}>
                  ⏳ Waiting for admin to close this ticket
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolveModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Mark Ticket as Resolved</h2>
            <p style={styles.modalSubtitle}>
              Ticket: #{selectedTicketId?.substring(0, 8)}
            </p>
            <label style={styles.modalLabel}>Resolution Notes (Required)</label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe the resolution, steps taken, and any notes for the admin..."
              style={styles.textarea}
              rows={6}
            />
            <div style={styles.modalActions}>
              <button
                onClick={handleSubmitResolution}
                style={styles.submitBtn}
              >
                Submit Resolution
              </button>
              <button
                onClick={() => {
                  setResolveModal(false);
                  setResolutionNotes("");
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
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
  subtitle: { fontSize: "16px", color: "#64748b", marginBottom: "4px" },
  email: { fontSize: "14px", color: "#94a3b8", fontStyle: "italic" },
  statsBar: { display: "flex", gap: "16px", marginBottom: "24px" },
  statCard: {
    flex: 1,
    background: "#f0f9ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
  },
  statNumber: { fontSize: "32px", fontWeight: "700", color: "#0369a1", margin: "0" },
  statLabel: { fontSize: "14px", color: "#0c4a6e", margin: "8px 0 0 0" },
  section: { marginBottom: "32px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  ticketId: { fontSize: "12px", color: "#94a3b8", margin: "0" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  ticketTitle: { fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "8px 0" },
  description: { fontSize: "14px", color: "#475569", margin: "8px 0" },
  details: { fontSize: "13px", color: "#64748b", margin: "12px 0" },
  resolutionBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    padding: "12px",
    margin: "12px 0",
  },
  resolutionLabel: { fontSize: "12px", fontWeight: "600", color: "#166534", margin: "0 0 6px 0" },
  resolutionText: { fontSize: "13px", color: "#15803d", margin: "0" },
  pendingAdminText: { fontSize: "13px", color: "#84cc16", fontStyle: "italic", margin: "12px 0 0 0" },
  resolveBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
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
    padding: "24px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
  },
  modalSubtitle: { fontSize: "14px", color: "#64748b", margin: "0 0 16px 0" },
  modalLabel: { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  modalActions: { display: "flex", gap: "8px" },
  submitBtn: {
    flex: 1,
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#e2e8f0",
    color: "#475569",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  loading: { textAlign: "center", color: "#94a3b8", padding: "40px" },
  errorMsg: { background: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "6px" },
  noTickets: { textAlign: "center", color: "#94a3b8", padding: "40px", fontSize: "16px" },
};
