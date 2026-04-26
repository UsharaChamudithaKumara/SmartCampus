import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Ticket, Building2, CalendarClock, Bell, Users, ArrowRight } from "lucide-react";
import TechnicianLoginRequests from "../components/TechnicianLoginRequests";



function AdminActionCard({ title, description, icon, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{title}</h3>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{description}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
            Open
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function AdminConsolePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 p-8 sm:p-10 text-white shadow-2xl"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" 
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              Admin Console
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Control Center</h1>
            <p className="mt-2 max-w-2xl text-blue-100">
              Manage tickets, facilities, bookings, notifications, and future user/admin workflows from one place.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <Users className="w-5 h-5" />
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-100">Role</p>
              <p className="font-semibold">Administrator access enabled</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AdminActionCard
          title="Admin Tickets"
          description="Assign technicians, change status, review resolution notes, and oversee incident handling."
          icon={<Ticket className="w-5 h-5" />}
          onClick={() => navigate('/admin/tickets')}
          delay={0.1}
        />
        <AdminActionCard
          title="Facilities & Assets"
          description="Review and maintain campus resources, availability, and catalogue entries."
          icon={<Building2 className="w-5 h-5" />}
          onClick={() => navigate('/admin/facilities')}
          delay={0.2}
        />
        <AdminActionCard
          title="Booking Management"
          description="Future booking approval and resource reservation workflow entry point."
          icon={<CalendarClock className="w-5 h-5" />}
          onClick={() => navigate('/bookings')}
          delay={0.3}
        />
        <AdminActionCard
          title="Notifications"
          description="Monitor ticket and system alerts, comments, and status updates."
          icon={<Bell className="w-5 h-5" />}
          onClick={() => navigate('/notifications')}
          delay={0.4}
        />
        <AdminActionCard
          title="Operations Dashboard"
          description="Return to the main campus overview whenever you need a summary view."
          icon={<ShieldCheck className="w-5 h-5" />}
          onClick={() => navigate('/dashboard')}
          delay={0.5}
        />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <TechnicianLoginRequests />
      </motion.section>
    </div>
  );
}