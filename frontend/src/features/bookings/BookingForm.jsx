import { useState } from "react";
import { createBooking } from "./bookingService";

export default function BookingForm({ onSuccess }) {
  const [form, setForm] = useState({
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      return;
    }
    setLoading(true);
    try {
      await createBooking({ ...form, expectedAttendees: Number(form.expectedAttendees) });
      onSuccess?.();
      setForm({ resourceId: "", date: "", startTime: "", endTime: "", purpose: "", expectedAttendees: 1 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Request a Booking</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>

        <label style={styles.label}>Resource ID</label>
        <input name="resourceId" value={form.resourceId} onChange={handleChange}
          placeholder="e.g. room-101" required style={styles.input} />

        <label style={styles.label}>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange}
          min={new Date().toISOString().split("T")[0]} required style={styles.input} />

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Start Time</label>
            <input type="time" name="startTime" value={form.startTime}
              onChange={handleChange} required style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>End Time</label>
            <input type="time" name="endTime" value={form.endTime}
              onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <label style={styles.label}>Purpose</label>
        <textarea name="purpose" value={form.purpose} onChange={handleChange}
          placeholder="Describe the purpose..." required rows={3} style={styles.input} />

        <label style={styles.label}>Expected Attendees</label>
        <input type="number" name="expectedAttendees" value={form.expectedAttendees}
          onChange={handleChange} min={1} required style={styles.input} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Submitting..." : "Submit Booking Request"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: 12, padding: 28, maxWidth: 560, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  title: { marginBottom: 20, fontSize: 20, fontWeight: 600, color: "#1e293b" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 2 },
  input: { padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" },
  row: { display: "flex", gap: 12 },
  button: { marginTop: 8, padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  error: { background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 14 },
};