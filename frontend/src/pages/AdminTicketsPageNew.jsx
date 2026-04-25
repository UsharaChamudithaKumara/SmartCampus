import { useEffect, useState } from "react";
import { fetchTickets, fetchTicketById, assignTechnician, adminCloseTicket } from "../api";
import TechnicianSelectionModal from "../components/TechnicianSelectionModal";

import TicketCommentsModal from "../components/TicketCommentsModal";

import { Ticket, AlertCircle, Clock, CheckCircle2 } from "lucide-react";


const STATUS_COLORS = {
  OPEN: { bg: "#fef3c7", text: "#b45309" },
  "IN_PROGRESS": { bg: "#dbeafe", text: "#1e40af" },
  RESOLVED: { bg: "#dcfce7", text: "#166534" },
  CLOSED: { bg: "#e5e7eb", text: "#374151" },
  REJECTED: { bg: "#fee2e2", text: "#991b1b" },
};

export default function AdminTicketsPageNew() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTechModal, setShowTechModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsTicket, setCommentsTicket] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const tickets = await fetchTickets();
      setTickets(Array.isArray(tickets) ? tickets : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSelectTechnician = async (techEmail) => {
    if (!selectedTicket) return;
    try {
      await assignTechnician(selectedTicket, techEmail);
      setShowTechModal(false);
      setSelectedTicket(null);
      loadTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    if (!window.confirm("Close this ticket?")) return;
    try {
      await adminCloseTicket(ticketId);
      loadTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTickets =
    filterStatus === "ALL" ? tickets : tickets.filter((t) => t.status === filterStatus);

  return (
    <div style={styles.container}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 text-left">Admin: Ticket Management</h1>
      </div>

      {/* Analytics Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-blue-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><Ticket size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Total Tickets</p>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{tickets.length}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-amber-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300"><AlertCircle size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Open</p>
          </div>
          <h3 className="text-3xl font-bold text-amber-600 mt-2">{tickets.filter((t) => t.status === "OPEN").length}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-emerald-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300"><Clock size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">In Progress</p>
          </div>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">{tickets.filter((t) => t.status === "IN_PROGRESS").length}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-purple-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300"><CheckCircle2 size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Resolved</p>
          </div>
          <h3 className="text-3xl font-bold text-purple-600 mt-2">{tickets.filter((t) => t.status === "RESOLVED").length}</h3>
        </div>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.label}>Filter by Status</label>
        <div style={styles.filterButtons}>
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.filterBtn,
                ...(filterStatus === status ? styles.filterBtnActive : {}),
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={styles.loading}>Loading tickets...</p>}
      {error && <p style={styles.errorMsg}>{error}</p>}

      <div style={styles.grid}>
        {filteredTickets.length === 0 ? (
          <p style={styles.noData}>No tickets found</p>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.ticketId}>#{ticket.id.substring(0, 8)}</p>
                  <p style={styles.title}>{ticket.title}</p>
                </div>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: STATUS_COLORS[ticket.status]?.bg || "#e5e7eb",
                    color: STATUS_COLORS[ticket.status]?.text || "#374151",
                  }}
                >
                  {ticket.status}
                </span>
              </div>

              <p style={styles.description}>{ticket.description}</p>

              <div style={styles.details}>
                <p style={styles.detailRow}>
                  <strong>Category:</strong> {ticket.category}
                </p>
                <p style={styles.detailRow}>
                  <strong>Priority:</strong> {ticket.priority}
                </p>
                <p style={styles.detailRow}>
                  <strong>Reported by:</strong> {ticket.preferredContactEmail}
                </p>
                {ticket.assignedTo && (
                  <p style={styles.detailRow}>
                    <strong>Assigned to:</strong> {ticket.assignedTo}
                  </p>
                )}
              </div>

              <div style={styles.actions}>
                {ticket.status === "OPEN" && (
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket.id);
                      setShowTechModal(true);
                    }}
                    style={styles.assignBtn}
                  >
                    🔧 Assign
                  </button>
                )}
                {ticket.status === "RESOLVED" && (
                  <button onClick={() => handleCloseTicket(ticket.id)} style={styles.closeBtn}>
                    ✓ Close
                  </button>
                )}
                <button
                  onClick={() => {
                    setCommentsTicket(ticket);
                    setShowCommentsModal(true);
                  }}
                  style={{ ...styles.closeBtn, background: "#6366f1", color: "#fff" }}
                >
                  💬 Comments ({ticket.comments?.length || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <TechnicianSelectionModal
        isOpen={showTechModal}
        onClose={() => {
          setShowTechModal(false);
          setSelectedTicket(null);
        }}
        onSelect={handleSelectTechnician}
        ticketType={selectedTicket ? tickets.find(t => t.id === selectedTicket)?.category : null}
      />

      <TicketCommentsModal
        isOpen={showCommentsModal}
        onClose={() => {
          setShowCommentsModal(false);
          setCommentsTicket(null);
          loadTickets();
        }}
        ticket={commentsTicket}
        onCommentAdded={async () => {
          // Keep modal open & refresh the ticket so the new comment is visible
          if (commentsTicket?.id) {
            try {
              const freshTicket = await fetchTicketById(commentsTicket.id);
              setCommentsTicket(freshTicket);
            } catch (e) {
              console.error("Failed to refresh ticket", e);
            }
          }
          loadTickets();
        }}
      />
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
  stats: { display: "flex", gap: "16px", flexWrap: "wrap" },
  stat: { padding: "8px 16px", bg: "#f1f5f9", borderRadius: "8px", fontSize: "14px" },
  filterBar: { marginBottom: "20px", padding: "16px", background: "#f8fafc", borderRadius: "8px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "8px" },
  filterButtons: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
  filterBtnActive: { background: "#2563eb", color: "#fff", borderColor: "#2563eb" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "16px" },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  ticketId: { fontSize: "12px", color: "#94a3b8", marginBottom: "4px" },
  description: { fontSize: "14px", color: "#475569", marginBottom: "12px", lineHeight: "1.5" },
  details: { fontSize: "13px", color: "#64748b", marginBottom: "12px" },
  detailRow: { margin: "4px 0" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actions: { display: "flex", gap: "8px", marginTop: "16px" },
  assignBtn: {
    flex: 1,
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  closeBtn: {
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
    maxWidth: "400px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    marginTop: "12px",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  modalActions: { display: "flex", gap: "8px" },
  modalBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  modalBtnCancel: {
    flex: 1,
    padding: "10px",
    background: "#e2e8f0",
    color: "#475569",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  loading: { textAlign: "center", color: "#94a3b8", padding: "40px" },
  errorMsg: { background: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "6px" },
  noData: { textAlign: "center", color: "#94a3b8", padding: "40px" },
};
