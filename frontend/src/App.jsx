import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Bell, Search, UserCircle } from "lucide-react";

import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";

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

              {/* USER */}
              <button className="p-1">
                <UserCircle className="w-7 h-7 text-gray-400" />
              </button>
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