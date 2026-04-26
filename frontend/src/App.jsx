import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, UserCircle, LogOut, Building2 } from "lucide-react";

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
import ProfilePage from "./pages/ProfilePage";

import BookingListPage from "./features/bookings/BookingListPage";
import AdminBookingsPage from "./features/bookings/AdminBookingsPage";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";
import NotificationsPage from "./pages/NotificationsPage";

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
  const [lastRole, setLastRole] = useState(null);
  const [loading, setLoading] = useState(true);

  function handleLoginSuccess(email) {
    const role = sessionStorage.getItem("userRole");
    setIsLoggedIn(true);
    setUserEmail(email || sessionStorage.getItem("userEmail"));
    setUserRole(role);
    setLastRole(role);
    sessionStorage.setItem("lastRole", role || "");
  }

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const email = sessionStorage.getItem("userEmail");
    const role = sessionStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
    setUserRole(role);

    if (role) {
      setLastRole(role);
      sessionStorage.setItem("lastRole", role);
    } else {
      setLastRole(sessionStorage.getItem("lastRole"));
    }

    setLoading(false);
  }, []);

  function handleLogout() {
    setLastRole(userRole);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
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
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/admin-login"
            element={
              isLoggedIn ? (
                <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace />
              ) : (
                <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace />
              ) : (
                <SignupPage />
              )
            }
          />

          {/* Protected layout routes */}
          <Route
            element={
              isLoggedIn ? (
                userRole === "ADMIN" ? (
                  <AdminLayout userEmail={userEmail} onLogout={handleLogout} />
                ) : (
                  <UserLayout
                    userEmail={userEmail}
                    userRole={userRole}
                    onLogout={handleLogout}
                  />
                )
              ) : (
                <Navigate
                  to={lastRole === "ADMIN" ? "/admin-login" : "/login"}
                  replace
                />
              )
            }
          >
            <Route
              path="/"
              element={
                <Navigate
                  to={userRole === "ADMIN" ? "/admin" : "/dashboard"}
                  replace
                />
              }
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminConsolePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/admin/tickets" element={<AdminTicketsPageNew />} />
            <Route path="/staff/tickets" element={<TechnicianDashboard />} />
            <Route path="/create" element={<CreateTicketPage />} />
            <Route path="/admin/facilities" element={<ManageResourcesPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/catalogue/:id" element={<ViewCataloguePage />} />
            <Route path="/bookings" element={<BookingListPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={userRole === "ADMIN" ? "/admin" : "/dashboard"}
                  replace
                />
              }
            />
          </Route>
        </Routes>
      )}
        </BrowserRouter>
  );
}
