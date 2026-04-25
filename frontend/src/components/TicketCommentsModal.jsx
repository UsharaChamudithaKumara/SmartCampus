import React, { useState } from "react";
import { addTicketComment, deleteTicketComment, editTicketComment } from "../api";

export default function TicketCommentsModal({ isOpen, onClose, ticket, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  if (!isOpen || !ticket) return null;

  const currentUserId = sessionStorage.getItem("userEmail") || "";
  const currentUserName = sessionStorage.getItem("userName") || currentUserId;
  const userRole = sessionStorage.getItem("userRole");

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSaving(true);
    try {
      await addTicketComment(ticket.id, {
        authorId: currentUserId,
        authorName: userRole === 'ADMIN' ? 'Admin' : currentUserName,
        text: commentText.trim(),
      });
      setCommentText("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      alert(err.message || "Failed to add comment");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    setSaving(true);
    try {
      await editTicketComment(ticket.id, commentId, {
        authorId: currentUserId,
        text: editingCommentText.trim(),
      });
      setEditingCommentId(null);
      setEditingCommentText("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      alert(err.message || "Failed to update comment");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    setSaving(true);
    try {
      await deleteTicketComment(ticket.id, commentId, currentUserId);
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      alert(err.message || "Failed to delete comment");
    } finally {
      setSaving(false);
    }
  };

  const comments = ticket.comments || [];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Comments</h2>
          <button onClick={onClose} style={styles.closeHeaderBtn}>✕</button>
        </div>
        <p style={styles.subtitle}>Ticket #{ticket.id?.substring(0, 8)} - {ticket.title}</p>
        
        <div style={styles.commentList}>
          {comments.length === 0 ? (
            <p style={styles.noComments}>No comments yet.</p>
          ) : (
            comments.map((comment) => {
              const isOwn = comment.authorId === currentUserId;
              return (
                <div key={comment.id} style={{ ...styles.commentBox, background: isOwn ? "#eff6ff" : "#fff" }}>
                  <div style={styles.commentHeader}>
                    <div>
                      <span style={styles.author}>{comment.authorName || comment.authorId}</span>
                      {isOwn && <span style={styles.youBadge}>You</span>}
                    </div>
                    <span style={styles.date}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div style={{ marginTop: "12px" }}>
                      <textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        style={styles.textarea}
                        rows={3}
                        disabled={saving}
                      />
                      <div style={styles.actions}>
                        <button onClick={() => setEditingCommentId(null)} style={styles.cancelBtn} disabled={saving}>Cancel</button>
                        <button onClick={() => handleSaveComment(comment.id)} style={styles.submitBtn} disabled={saving}>Save</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={styles.commentText}>{comment.text}</p>
                      {isOwn && (
                        <div style={styles.actionLinks}>
                          <button 
                            onClick={() => { setEditingCommentId(comment.id); setEditingCommentText(comment.text); }} 
                            style={styles.linkBtn}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)} 
                            style={{ ...styles.linkBtn, color: "#dc2626" }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your comment..."
            style={styles.textarea}
            rows={3}
            disabled={saving}
          />
          <div style={styles.actions}>
             <button
              onClick={handleAddComment}
              style={styles.submitBtn}
              disabled={saving || !commentText.trim()}
            >
              {saving ? "Posting..." : "Post Comment"}
            </button>
          </div>
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
    zIndex: 2000,
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "80vh",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px 8px 20px",
  },
  title: { margin: 0, fontSize: "20px", fontWeight: "700", color: "#1e293b" },
  closeHeaderBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#64748b" },
  subtitle: {
    padding: "0 20px 16px 20px",
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
  },
  commentList: {
    padding: "20px",
    flex: 1,
    overflowY: "auto",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  noComments: { color: "#94a3b8", textAlign: "center", fontSize: "14px", fontStyle: "italic", margin: "20px 0" },
  commentBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px",
  },
  commentHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  author: { fontSize: "13px", fontWeight: "600", color: "#1e293b" },
  date: { fontSize: "12px", color: "#94a3b8" },
  commentText: { margin: 0, fontSize: "14px", color: "#475569", whiteSpace: "pre-wrap", lineHeight: "1.5" },
  youBadge: { marginLeft: "8px", background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" },
  actionLinks: { display: "flex", gap: "12px", marginTop: "8px" },
  linkBtn: { background: "none", border: "none", padding: 0, fontSize: "12px", color: "#64748b", cursor: "pointer", fontWeight: "600" },
  inputArea: {
    padding: "16px 20px",
    borderTop: "1px solid #e2e8f0",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    marginBottom: "12px",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: "8px" },
  submitBtn: {
    padding: "8px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "#e2e8f0",
    color: "#475569",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};
