import { useEffect, useState } from "react";
import { getTechnicianLoginRequestStatus } from "../api";

export default function TechnicianLoginStatus({ technicianEmail, onApproved }) {
  const [status, setStatus] = useState("checking");
  const [request, setRequest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await getTechnicianLoginRequestStatus(technicianEmail);
        if (data.status === "APPROVED") {
          setStatus("approved");
          if (onApproved) onApproved();
        } else if (data.status === "PENDING") {
          setStatus("pending");
        } else if (data.status === "REJECTED") {
          setStatus("rejected");
        }
        setRequest(data);
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    if (technicianEmail) {
      checkStatus();
      const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [technicianEmail, onApproved]);

  if (status === "approved") return null; // Approved, continue normally

  return (
    <div style={styles.container}>
      {status === "checking" && (
        <div style={styles.message}>
          <p>⏳ Checking login status...</p>
        </div>
      )}

      {status === "pending" && (
        <div style={styles.message}>
          <p style={styles.pending}>
            ⏳ <strong>Your login is pending admin approval</strong>
          </p>
          <p style={styles.note}>
            Your login request has been submitted to the admin. Please wait for approval.
          </p>
          <p style={styles.small}>Requested: {new Date(request?.requestedAt).toLocaleString()}</p>
        </div>
      )}

      {status === "rejected" && (
        <div style={styles.message}>
          <p style={styles.rejected}>
            ❌ <strong>Your login request has been rejected</strong>
          </p>
          {request?.rejectionReason && (
            <p style={styles.reason}>Reason: {request.rejectionReason}</p>
          )}
        </div>
      )}

      {status === "error" && (
        <div style={styles.message}>
          <p style={styles.error}>Error checking status. Please try again.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #fed7aa",
    background: "#fef3c7",
  },
  message: {
    textAlign: "center",
  },
  pending: {
    color: "#d97706",
    fontSize: "14px",
    margin: "0 0 8px 0",
  },
  rejected: {
    color: "#dc2626",
    fontSize: "14px",
    margin: "0 0 8px 0",
  },
  note: {
    fontSize: "12px",
    color: "#92400e",
    margin: "0",
  },
  small: {
    fontSize: "11px",
    color: "#a16207",
    margin: "8px 0 0 0",
  },
  reason: {
    fontSize: "12px",
    color: "#b45309",
    margin: "8px 0 0 0",
    fontStyle: "italic",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    margin: "0",
  },
};
