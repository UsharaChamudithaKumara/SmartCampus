import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, LogOut, Building2, User, Settings, LayoutDashboard, Ticket, FolderKanban, CalendarRange, BellRing } from "lucide-react";

function AdminSidebar() {
  const location = useLocation();
  const navItems = [
    { path: "/admin", label: "Admin Console", icon: LayoutDashboard },
    { path: "/admin/facilities", label: "Facilities & Asset Management", icon: FolderKanban },
    { path: "/admin/bookings", label: "Booking Management", icon: CalendarRange },
    { path: "/admin/tickets", label: "Ticket Management", icon: Ticket },
    { path: "/notifications", label: "Notification Management", icon: BellRing },
  ];

  return (
    <aside className="w-64 bg-slate-900 min-h-screen text-slate-300 flex flex-col hidden md:flex fixed h-full z-10">
      <div className="p-6">
        <Link to="/admin" className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight">Smart Campus</p>
            <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Admin Portal</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(`${item.path}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all relative ${isActive
                    ? "text-white bg-blue-600 shadow-md shadow-blue-900/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-emerald-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout({ userEmail, onLogout }) {
  const storedEmail = sessionStorage.getItem("userEmail");
  const storedName = sessionStorage.getItem("userName");
  const rawEmail = userEmail || storedEmail || "";
  const safeEmail = rawEmail && rawEmail !== "undefined" ? rawEmail.trim() : "";
  const safeName = storedName && storedName !== "undefined" && storedName !== "undefined undefined" ? storedName : "";
  const identityLabel = safeName || safeEmail || "Admin";
  const initials = safeName
    ? safeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : safeEmail
      ? safeEmail.substring(0, 2).toUpperCase()
      : "A";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      {/* Main Content Wrapper - offset for sidebar */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <header className="bg-white border-b sticky top-0 z-30 shadow-sm h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Control Center</h1>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold uppercase tracking-wide">
              Administrator
            </div>

            <Link to="/notifications" className="p-2 hover:bg-slate-100 rounded-full relative" title="Alerts">
              <Bell className="w-5 h-5 text-slate-600" />
            </Link>

            <div className="relative group">
              <Link to="/profile" className="h-9 w-9 flex items-center justify-center bg-blue-600 text-white font-bold text-sm rounded-full ring-2 ring-white hover:ring-blue-100 transition-all shadow-sm cursor-pointer" title={identityLabel}>
                {initials}
              </Link>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-slate-100 divide-y divide-slate-100">
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900 truncate">{safeName || "Admin User"}</p>
                  {safeEmail && <p className="text-xs text-slate-500 truncate mt-0.5">{safeEmail}</p>}
                </div>
                <div className="p-1">
                  <Link to="/profile" className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left">
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>
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
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
        {/* No Footer rendered in Admin Layout as requested */}
      </div>
    </div>
  );
}
