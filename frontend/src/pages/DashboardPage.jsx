import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Building2,
  CheckCircle2,
  Clock3,
  ArrowRight,
  CalendarClock,
  Bell,
  Wrench,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { fetchResources, fetchVisibleTickets } from "../api";

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 24 } },
};

function MetricCard({ title, value, subtitle, icon, tone, delay = 0 }) {
  const toneMap = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={cardAnim}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-2.5 rounded-xl border ${toneMap[tone]}`}>{icon}</div>
      </div>
    </motion.div>
  );
}

function ModuleCard({ title, description, icon, linkText, to, delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={cardAnim}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          <Link
            to={to}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {linkText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole");
  const isStaff = userRole === "ADMIN" || userRole === "TECHNICIAN";
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [ticketData, resourceData] = await Promise.all([
          fetchVisibleTickets(),
          fetchResources(),
        ]);

        setTickets(Array.isArray(ticketData) ? ticketData : []);
        setResources(Array.isArray(resourceData) ? resourceData : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
    const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

    const totalResources = resources.length;
    const activeResources = resources.filter((r) => r.status === "ACTIVE").length;

    return { totalTickets, openTickets, resolvedTickets, totalResources, activeResources };
  }, [tickets, resources]);

  const ticketResolution = stats.totalTickets === 0 ? 0 : Math.round((stats.resolvedTickets / stats.totalTickets) * 100);
  const resourceAvailability = stats.totalResources === 0 ? 0 : Math.round((stats.activeResources / stats.totalResources) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="absolute -right-16 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wide">
              <LayoutDashboard className="w-4 h-4" />
              Operations Dashboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mt-3">Smart Campus Overview</h1>
            <p className="text-blue-100 mt-2 max-w-2xl">
              Unified view across facilities, bookings, maintenance, and notifications for the complete Smart Campus platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isStaff && userRole === "ADMIN" && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Console
              </Link>
            )}
            {userRole !== "TECHNICIAN" && (
              <>
                <Link
                  to="/catalogue"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/95 text-slate-900 text-sm font-semibold hover:bg-white transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Facilities
                </Link>
                <Link
                  to="/bookings"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  <CalendarClock className="w-4 h-4" />
                  Bookings
                </Link>
              </>
            )}
            <Link
              to={userRole === "TECHNICIAN" ? "/staff/tickets" : "/tickets"}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              {userRole === "TECHNICIAN" ? "Staff Tickets" : "Tickets"}
            </Link>
            <Link
              to="/notifications"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Link>
          </div>
        </div>
      </motion.section>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">Failed to load dashboard data</p>
            <p className="text-xs opacity-80 mt-0.5">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      <section className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${userRole !== "TECHNICIAN" ? 'xl:grid-cols-4' : ''}`}>
        <MetricCard
          title="Total Tickets"
          value={loading ? "..." : stats.totalTickets}
          subtitle="Across all statuses"
          icon={<Ticket className="w-5 h-5" />}
          tone="slate"
          delay={0.05}
        />
        <MetricCard
          title="Open Work"
          value={loading ? "..." : stats.openTickets}
          subtitle="OPEN + IN_PROGRESS"
          icon={<Clock3 className="w-5 h-5" />}
          tone="blue"
          delay={0.1}
        />
        {userRole !== "TECHNICIAN" && (
          <>
            <MetricCard
              title="Resources"
              value={loading ? "..." : stats.totalResources}
              subtitle="Facilities and assets"
              icon={<Building2 className="w-5 h-5" />}
              tone="cyan"
              delay={0.15}
            />
            <MetricCard
              title="Active Resources"
              value={loading ? "..." : stats.activeResources}
              subtitle={`${resourceAvailability}% availability`}
              icon={<CheckCircle2 className="w-5 h-5" />}
              tone="green"
              delay={0.2}
            />
          </>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-slate-900">Module Access</h2>
          <p className="text-sm text-slate-500 mt-1">Navigate to each module for detailed workflows and records.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModuleCard
              title="Ticket Management"
              description="Create incidents, assign technicians, update workflow status, and manage comments."
              icon={<Wrench className="w-5 h-5 text-blue-700" />}
              linkText="Go to Tickets"
              to={userRole === "TECHNICIAN" ? "/staff/tickets" : "/tickets"}
              delay={0.22}
            />
            {userRole !== "TECHNICIAN" && (
              <>
                <ModuleCard
                  title="Facilities & Assets"
                  description="Maintain lecture halls, labs, equipment, and availability status for operations."
                  icon={<Building2 className="w-5 h-5 text-cyan-700" />}
                  linkText="Open Catalogue"
                  to="/catalogue"
                  delay={0.26}
                />
                <ModuleCard
                  title="Booking Management"
                  description="Handle booking requests and workflow transitions across campus resources."
                  icon={<CalendarClock className="w-5 h-5 text-amber-700" />}
                  linkText="View Bookings"
                  to="/bookings"
                  delay={0.3}
                />
              </>
            )}
            <ModuleCard
              title="Notifications"
              description="Review system alerts for ticket changes, comments, and approvals."
              icon={<Bell className="w-5 h-5 text-indigo-700" />}
              linkText="Open Notifications"
              to="/notifications"
              delay={0.34}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-slate-900">Health Indicators</h2>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Ticket resolution rate</span>
                <span className="font-semibold text-slate-900">{ticketResolution}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ticketResolution}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                />
              </div>
            </div>

            {userRole !== "TECHNICIAN" && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600">Resource availability</span>
                  <span className="font-semibold text-slate-900">{resourceAvailability}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resourceAvailability}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-green-500"
                  />
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Note</p>
              <p className="text-sm text-slate-700 mt-1">
                Ticket descriptions, comments, and assignment-level details are available only in Ticket Management.
              </p>
            </div>

            {isStaff && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Staff Console</p>
                <p className="text-sm text-blue-900 mt-1">
                  {userRole === "ADMIN"
                    ? "Use the admin ticket desk to assign technicians, change statuses, and close incidents."
                    : "Use the staff ticket desk to handle assigned incidents and comment updates."}
                </p>
                <Link
                  to="/tickets"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Open Ticket Desk
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
