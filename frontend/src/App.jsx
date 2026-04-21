import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Bell, Search, UserCircle, LogOut } from "lucide-react";

import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// NAVIGATION
function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Tickets" },
    { path: "/create", label: "Create Ticket" },
  ];

  return (
    <nav className="flex space-x-2 sm:space-x-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-3 py-2 text-sm font-medium rounded-md ${
              isActive
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {item.label}

            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// ROUTES WITH ANIMATION
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage />
            </motion.div>
          }
        />

        <Route
          path="/signup"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SignupPage />
            </motion.div>
          }
        />

        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TicketsPage />
            </motion.div>
          }
        />

        <Route
          path="/create"
          element={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CreateTicketPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// MAIN APP
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
    setLoading(false);
  }, []);

  function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserEmail(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
            {/* LEFT */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold hidden sm:block">
                  Ticket Manager
                </span>
              </Link>

              <Navigation />
            </div>

            {/* RIGHT */}
            <div className="flex items-center space-x-3">
              {/* SEARCH */}
              <div className="hidden md:block relative">
                <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-7 pr-3 py-1 text-sm border rounded-full"
                />
              </div>

              {/* NOTIFICATION */}
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
              </button>

              {/* USER DROPDOWN */}
              <div className="relative group">
                <button className="p-1 hover:bg-gray-100 rounded-full" title={userEmail}>
                  <UserCircle className="w-7 h-7 text-gray-400" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}