const STATUS_STYLES = {
  PENDING:   { background: "#fef9c3", color: "#854d0e" },
  APPROVED:  { background: "#dcfce7", color: "#166534" },
  REJECTED:  { background: "#fee2e2", color: "#991b1b" },
  CANCELLED: { background: "#f1f5f9", color: "#64748b" },
};

export default function BookingCard({ booking, isAdmin, onApprove, onReject, onCancel }) {
  const statusStyle = STATUS_STYLES[booking.status] || {};
  const formatTime = (t) => t ? t.substring(0, 5) : "";

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.resourceLabel}>Resource</p>
          <p style={styles.resourceId}>{booking.resourceId}</p>
        </div>
        <span style={{ ...styles.badge, ...statusStyle }}>{booking.status}</span>
      </div>

      <div style={styles.grid}>
        <Detail label="Date" value={booking.date} />
        <Detail label="Time" value={`${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`} />
        <Detail label="Attendees" value={booking.expectedAttendees} />
        <Detail label="Booked by" value={booking.userEmail} />
      </div>

      <div style={styles.purpose}>
        <span style={styles.purposeLabel}>Purpose: </span>{booking.purpose}
      </div>

      {booking.status === "REJECTED" && booking.rejectionReason && (
        <div style={styles.rejection}>
          <strong>Rejection reason:</strong> {booking.rejectionReason}
        </div>
      )}

      <div style={styles.actions}>
        {isAdmin && booking.status === "PENDING" && (
          <>
            <button onClick={() => onApprove(booking.id)} style={styles.approveBtn}>✓ Approve</button>
            <button onClick={() => onReject(booking.id)} style={styles.rejectBtn}>✗ Reject</button>
          </>
        )}
        {!isAdmin && booking.status === "APPROVED" && (
          <button onClick={() => onCancel(booking.id)} style={styles.cancelBtn}>Cancel Booking</button>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{value}</p>
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  resourceLabel: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  resourceId: { fontSize: 16, fontWeight: 700, color: "#1e293b" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  purpose: { fontSize: 14, color: "#475569", background: "#f8fafc", padding: "10px 14px", borderRadius: 8 },
  purposeLabel: { fontWeight: 600 },
  rejection: { fontSize: 13, color: "#dc2626", background: "#fff1f2", padding: "10px 14px", borderRadius: 8 },
  actions: { display: "flex", gap: 10 },
  approveBtn: { padding: "8px 18px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  rejectBtn: { padding: "8px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "8px 18px", background: "#f1f5f9", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
};