import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "./bookingService";
import BookingCard from "./BookingCard";
import BookingForm from "./BookingForm";

export default function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getMyBookings();
      setBookings(data);
    } catch {
      setError("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.heading}>My Bookings</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.newBtn}>
          {showForm ? "✕ Close" : "+ New Booking"}
        </button>
      </div>

      {showForm && (
        <BookingForm onSuccess={() => { setShowForm(false); fetchBookings(); }} />
      )}

      {loading && <p style={styles.info}>Loading your bookings...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div style={styles.empty}>
          <p>You have no bookings yet.</p>
          <button onClick={() => setShowForm(true)} style={styles.newBtn}>
            Make your first booking
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} isAdmin={false} onCancel={handleCancel} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 28, maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  heading: { fontSize: 26, fontWeight: 700, color: "#1e293b" },
  newBtn: { padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 18 },
  info: { color: "#64748b", textAlign: "center", padding: 40 },
  errorText: { color: "#dc2626", background: "#fee2e2", padding: "12px 18px", borderRadius: 8 },
  empty: { textAlign: "center", color: "#64748b", padding: 60, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" },
};