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
import { motion, AnimatePresence } from "framer-motion";
import { Bell, UserCircle, LogOut, Building2, User, Settings } from "lucide-react";

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
import Footer from "./components/Footer";


function Navigation({ userRole }) {
  const location = useLocation();
  const isStaff = userRole === "ADMIN" || userRole === "TECHNICIAN";
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: userRole === "ADMIN" ? "/admin/facilities" : "/catalogue", label: "Facilities & Assets" },
    { path: "/bookings", label: "My Bookings" },
    {
      path:
        userRole === "ADMIN"
          ? "/admin/tickets"
          : userRole === "TECHNICIAN"
            ? "/staff/tickets"
            : "/tickets",
      label:
        userRole === "ADMIN"
          ? "Admin Tickets"
          : userRole === "TECHNICIAN"
            ? "Staff Tickets"
            : "My Tickets",
    },
    { path: "/notifications", label: "Notifications" },
  ];

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            {item.label}
            {isActive && <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600" />}
          </Link>
        );
      })}
    </nav>
  );
}

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

function AppShell({ userEmail, userRole, onLogout }) {
  const isStaff = userRole === "ADMIN" || userRole === "TECHNICIAN";
  const storedEmail = localStorage.getItem("userEmail");
  const storedName = localStorage.getItem("userName");
  const rawEmail = userEmail || storedEmail || "";
  const safeEmail = rawEmail && rawEmail !== "undefined" ? rawEmail.trim() : "";
  const safeName = storedName && storedName !== "undefined" && storedName !== "undefined undefined" ? storedName : "";
  const identityLabel = safeName || safeEmail || "User";
  const initials = safeName 
    ? safeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : safeEmail 
      ? safeEmail.substring(0, 2).toUpperCase() 
      : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-slate-50 to-blue-50/50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-tight">Smart Campus Operations Hub</p>
                <p className="text-xs text-slate-500">Operations Platform</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {isStaff && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wide">
                  {userRole === "ADMIN" ? "Admin" : "Staff"} Access
                </div>
              )}

              <button className="p-2 hover:bg-slate-100 rounded-full relative" title="Notifications">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="relative group">
                <button className="h-9 w-9 flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-sm rounded-full ring-2 ring-white hover:ring-blue-100 transition-all" title={identityLabel}>
                  {initials}
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-slate-100 divide-y divide-slate-100">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 truncate">{safeName || "User"}</p>
                    {safeEmail && <p className="text-xs text-slate-500 truncate mt-0.5">{safeEmail}</p>}
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left">
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left">
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </button>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Navigation userRole={userRole} />
        </div>
      </header>


      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/admin-login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AdminLoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
          <Route element={isLoggedIn ? <AppShell userEmail={userEmail} userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}