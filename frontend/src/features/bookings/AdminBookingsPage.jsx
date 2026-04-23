import { useEffect, useState } from "react";
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from "./bookingService";
import BookingCard from "./BookingCard";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter !== "ALL") filters.status = statusFilter;
      const { data } = await getAllBookings(filters);
      setBookings(data);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await rejectBooking(id, reason);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this booking?")) return;
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch {
      alert("Failed to delete booking.");
    }
  };

  const pendingCount = bookings.filter(b => b.status === "PENDING").length;

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Booking Management</h1>
          {pendingCount > 0 && (
            <span style={styles.pendingBadge}>{pendingCount} pending approval</span>
          )}
        </div>
      </div>

      <div style={styles.filters}>
        <label style={styles.filterLabel}>Filter by Status</label>
        <div style={styles.tabGroup}>
          {STATUS_OPTIONS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ ...styles.tab, ...(statusFilter === s ? styles.tabActive : {}) }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.statsText}>Showing {bookings.length} booking(s)</p>

      {loading && <p style={styles.info}>Loading bookings...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p style={styles.info}>No bookings found.</p>
      )}

      <div style={styles.grid}>
        {bookings.map((b) => (
          <div key={b.id} style={{ position: "relative" }}>
            <BookingCard booking={b} isAdmin={true}
              onApprove={handleApprove} onReject={handleReject} />
            <button onClick={() => handleDelete(b.id)} style={styles.deleteBtn}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 28, maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  heading: { fontSize: 26, fontWeight: 700, color: "#1e293b", marginBottom: 4 },
  pendingBadge: { background: "#fef9c3", color: "#92400e", padding: "3px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  filters: { display: "flex", flexDirection: "column", gap: 8, background: "#f8fafc", padding: "18px 20px", borderRadius: 12, border: "1px solid #e2e8f0" },
  filterLabel: { fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" },
  tabGroup: { display: "flex", gap: 6 },
  tab: { padding: "6px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", color: "#64748b" },
  tabActive: { background: "#2563eb", color: "#fff", borderColor: "#2563eb" },
  statsText: { fontSize: 13, color: "#94a3b8" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 18 },
  info: { textAlign: "center", color: "#94a3b8", padding: 60 },
  errorText: { color: "#dc2626", background: "#fee2e2", padding: "12px 18px", borderRadius: 8 },
  deleteBtn: { position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5 },
};