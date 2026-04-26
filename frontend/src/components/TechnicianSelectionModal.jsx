import { useState, useEffect } from "react";
import { getAvailableTechnicians } from "../api";

export default function TechnicianSelectionModal({ isOpen, onClose, onSelect, ticket }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadTechnicians();
    }
  }, [isOpen]);

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await getAvailableTechnicians();
      if (!Array.isArray(data)) data = [];

      // Relevance Scoring Logic
      const combinedText = ticket ? `${ticket.title} ${ticket.description} ${ticket.category}`.toLowerCase() : "";
      const typeMap = {
        'PAINTER': ['paint', 'color', 'wall', 'graffiti', 'repaint'],
        'PLUMBER': ['leak', 'water', 'pipe', 'sink', 'toilet', 'drain', 'plumb', 'plumber'],
        'ELECTRICIAN': ['light', 'power', 'electric', 'wire', 'socket', 'plug', 'switch', 'bulb', 'flicker', 'short circuit'],
        'CARPENTER': ['wood', 'door', 'desk', 'chair', 'furniture', 'hinge', 'cabinet', 'table', 'carpenter'],
        'HVAC': ['ac ', 'air condition', 'hvac', 'cool', 'heat', 'warm air', 'cold air', 'temperature', 'fan'],
        'GENERAL': ['blind', 'window', 'glass', 'clean', 'general']
      };

      const scoredData = data.map(tech => {
        let score = (tech.completedTickets * 0.6) + ((tech.rating || 0) * 0.4);
        let isRecommended = false;

        if (tech.technicianType) {
          const keywords = typeMap[tech.technicianType.toUpperCase()] || [];
          for (const kw of keywords) {
            if (combinedText.includes(kw)) {
              score += 100; // Massive boost for matching role
              isRecommended = true;
              break;
            }
          }
        }
        return { ...tech, score, isRecommended };
      });

      // Sort by score descending
      scoredData.sort((a, b) => b.score - a.score);

      setTechnicians(scoredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔧 Select Technician</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <p style={styles.subtitle}>Technicians ranked by suitability (experience & rating)</p>

        {loading && <p style={styles.loading}>Loading technicians...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && technicians.length === 0 && (
          <p style={styles.noData}>No available technicians</p>
        )}

        {!loading && technicians.length > 0 && (
          <div style={styles.list}>
            {technicians.map((tech, idx) => (
              <div key={tech.id} style={styles.techItem}>
                <div style={styles.techInfo}>
                  <div style={styles.rank}>#{idx + 1}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ ...styles.techName, margin: 0 }}>{tech.name}</p>
                      {tech.isRecommended && <span style={styles.recommendedBadge}>★ Recommended</span>}
                    </div>
                    <p style={styles.techEmail}>{tech.email}</p>
                    <div style={styles.stats}>
                      <span style={styles.stat}>
                        <strong>{tech.completedTickets}</strong> tickets completed
                      </span>
                      <span style={styles.stat}>
                        ⭐ <strong>{tech.rating.toFixed(1)}</strong> rating
                      </span>
                      <span style={styles.badge}>{tech.technicianType}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelect(tech.email);
                    onClose();
                  }}
                  style={styles.selectBtn}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
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
  modal: {
    background: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    background: "#fff",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    padding: "0 20px 12px 20px",
    margin: "0",
  },
  list: {
    padding: "12px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  techItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "#f8fafc",
    gap: "12px",
  },
  techInfo: {
    display: "flex",
    gap: "12px",
    flex: 1,
    alignItems: "flex-start",
  },
  rank: {
    background: "#dbeafe",
    color: "#0369a1",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
    flexShrink: 0,
  },
  techName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  techEmail: {
    fontSize: "12px",
    color: "#64748b",
    margin: "0 0 6px 0",
  },
  stats: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  stat: {
    fontSize: "11px",
    color: "#475569",
    background: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    background: "#fef08a",
    color: "#713f12",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  selectBtn: {
    padding: "6px 12px",
    background: "#0369a1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: 0,
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    background: "#f8fafc",
    position: "sticky",
    bottom: 0,
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "#e2e8f0",
    color: "#475569",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  loading: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "20px",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "12px 20px",
    borderRadius: "6px",
    margin: "12px 20px",
    fontSize: "13px",
  },
  noData: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "24px 20px",
  },
  recommendedBadge: {
    fontSize: "10px",
    fontWeight: "700",
    background: "#dcfce7",
    color: "#166534",
    padding: "2px 6px",
    borderRadius: "12px",
    border: "1px solid #bbf7d0"
  },
};
