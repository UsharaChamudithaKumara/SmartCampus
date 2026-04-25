import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Ticket, Building2, CalendarClock, Bell, Users, ArrowRight } from "lucide-react";
import TechnicianLoginRequests from "../components/TechnicianLoginRequests";



function AdminActionCard({ title, description, icon, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
            Open
            <ArrowRight className="w-4 h-4" />
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
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

          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <Users className="w-5 h-5" />
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-100">Role</p>
              <p className="font-semibold">Administrator access enabled</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AdminActionCard
          title="Admin Tickets"
          description="Assign technicians, change status, review resolution notes, and oversee incident handling."
          icon={<Ticket className="w-5 h-5" />}
          onClick={() => navigate('/admin/tickets')}
          delay={0.05}
        />
        <AdminActionCard
          title="Facilities & Assets"
          description="Review and maintain campus resources, availability, and catalogue entries."
          icon={<Building2 className="w-5 h-5" />}

          onClick={() => navigate('/manage-resources')}

          onClick={() => navigate('/admin/facilities')}

          delay={0.1}
        />
        <AdminActionCard
          title="Booking Management"
          description="Future booking approval and resource reservation workflow entry point."
          icon={<CalendarClock className="w-5 h-5" />}
          onClick={() => navigate('/bookings')}
          delay={0.15}
        />
        <AdminActionCard
          title="Notifications"
          description="Monitor ticket and system alerts, comments, and status updates."
          icon={<Bell className="w-5 h-5" />}
          onClick={() => navigate('/notifications')}
          delay={0.2}
        />
        <AdminActionCard
          title="Operations Dashboard"
          description="Return to the main campus overview whenever you need a summary view."
          icon={<ShieldCheck className="w-5 h-5" />}
          onClick={() => navigate('/dashboard')}
          delay={0.25}
        />
      </section>

      <section>
        <TechnicianLoginRequests />
      </section>
    </div>
  );
}