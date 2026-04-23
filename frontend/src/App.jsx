import { useState } from "react";
import BookingListPage from "./features/bookings/BookingListPage";
import AdminBookingsPage from "./features/bookings/AdminBookingsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("my-bookings");

  return (
    <div style={styles.app}>
      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>🏫 Smart Campus</div>
        <div style={styles.navLinks}>
          <button
            onClick={() => setCurrentPage("my-bookings")}
            style={{ ...styles.navBtn, ...(currentPage === "my-bookings" ? styles.navBtnActive : {}) }}>
            My Bookings
          </button>
          <button
            onClick={() => setCurrentPage("admin")}
            style={{ ...styles.navBtn, ...(currentPage === "admin" ? styles.navBtnActive : {}) }}>
            Admin Panel
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main style={styles.main}>
        {currentPage === "my-bookings" && <BookingListPage />}
        {currentPage === "admin" && <AdminBookingsPage />}
      </main>
    </div>
  );
}

const styles = {
  app: { minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" },
  nav: { background: "#1e293b", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navBrand: { color: "#fff", fontSize: 20, fontWeight: 700 },
  navLinks: { display: "flex", gap: 8 },
  navBtn: { padding: "8px 18px", background: "transparent", color: "#94a3b8", border: "1.5px solid transparent", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 14 },
  navBtnActive: { background: "#2563eb", color: "#fff", borderColor: "#2563eb" },
  main: { padding: "24px 0" },
};