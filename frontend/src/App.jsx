import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, UserCircle, Building2 } from "lucide-react";

// PAGE IMPORTS
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import CataloguePage from "./pages/CataloguePage"; 
import ViewCataloguePage from "./pages/ViewCataloguePage"; 

// NAVIGATION COMPONENT
function Navigation() {
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Tickets" },
    { path: "/create", label: "Create Ticket" },
    { path: "/catalogue", label: "Catalogue" },
  ];

  return (
    <nav className="flex space-x-2 sm:space-x-4">
      {navItems.map((item) => {
        const isActive = item.path === "/" 
          ? location.pathname === "/" 
          : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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

// MAIN APP COMPONENT
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold hidden sm:block text-slate-900">Smart Campus Hub</span>
              </Link>
              <Navigation />
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:block relative">
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-full relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <UserCircle className="w-8 h-8 text-slate-400 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* CONTENT ROUTES */}
        <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<TicketsPage />} />
              <Route path="/create" element={<CreateTicketPage />} />
              <Route path="/catalogue" element={<CataloguePage />} />
              <Route path="/catalogue/:id" element={<ViewCataloguePage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-white border-t py-4 text-center text-xs text-slate-400">
          © 2026 Smart Campus Operations Hub 
        </footer>
      </div>
    </BrowserRouter>
  );
}