import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import AdminConsolePage from "./pages/AdminConsolePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import ManageResourcesPage from "./components/ManageResourcesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CataloguePage from "./pages/CataloguePage";
import ViewCataloguePage from "./pages/ViewCataloguePage";
import AdminTicketsPageNew from "./pages/AdminTicketsPageNew";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import BookingListPage from "./features/bookings/BookingListPage";
import AdminBookingsPage from "./features/bookings/AdminBookingsPage";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";

function PlaceholderPage({ title, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-600 mt-2">{description}</p>
      <p className="text-sm text-slate-500 mt-4">
        This module is listed in the assignment header and can be implemented next.
      </p>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRole, setLastRole] = useState(null);

  function handleLoginSuccess(email) {
    setIsLoggedIn(true);
    setUserEmail(email || localStorage.getItem("userEmail"));
    setUserRole(localStorage.getItem("userRole"));
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
    setUserRole(role);
    setLoading(false);
  }, []);

  function handleLogout() {
    setLastRole(userRole);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserRole(null);
  }

  return (
    <BrowserRouter>
      {loading ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/admin-login" element={isLoggedIn ? <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace /> : <AdminLoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace /> : <SignupPage />} />
          <Route element={isLoggedIn ? (userRole === "ADMIN" ? <AdminLayout userEmail={userEmail} onLogout={handleLogout} /> : <UserLayout userEmail={userEmail} userRole={userRole} onLogout={handleLogout} />) : <Navigate to={lastRole === "ADMIN" ? "/admin-login" : "/login"} replace />}>
            <Route path="/" element={<Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminConsolePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/admin/tickets" element={<AdminTicketsPageNew />} />
            <Route path="/staff/tickets" element={<TechnicianDashboard />} />
            <Route path="/create" element={<CreateTicketPage />} />
            <Route path="/admin/facilities" element={<ManageResourcesPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/catalogue/:id" element={<ViewCataloguePage />} />
            <Route
              path="/bookings"
              element={userRole === "ADMIN" || userRole === "TECHNICIAN" ? <AdminBookingsPage /> : <BookingListPage />}
            />
            <Route
              path="/notifications"
              element={<PlaceholderPage title="Notifications" description="Notification center for ticket updates, comments, and booking status updates." />}
            />
            <Route path="*" element={<Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}