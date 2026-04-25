import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TicketList from "../components/TicketList";
import { Plus, CheckCircle2, Clock, AlertCircle, Ticket } from "lucide-react";
import { fetchVisibleTickets } from "../api";

// Animated Counter Component
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1000;
    const incrementTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export default function TicketsPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isStaff = userRole === "ADMIN" || userRole === "TECHNICIAN";

  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 })

  async function loadStats() {
    try {
      const data = await fetchVisibleTickets()
      const total = data.length
      const open = data.filter(t => t.status === 'OPEN').length
      const inProgress = data.filter(t => t.status === 'IN_PROGRESS').length
      const resolved = data.filter(t => t.status === 'RESOLVED').length
      setStats({ total, open, inProgress, resolved })
    } catch (e) {
      // keep defaults on error
      console.error('Failed to load ticket stats', e)
    }
  }

  useEffect(() => { loadStats() }, [])

  const statsVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            {isStaff ? (userRole === "ADMIN" ? "Admin Ticket Management" : "Staff Ticket Management") : "Ticket Management"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-1"
          >
            {isStaff
              ? "Assign technicians, update workflow status, and review comments for maintenance and incidents"
              : "Monitor and manage all maintenance and incident tickets"}
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.2,
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/create")}
          className="flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all group relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          {isStaff ? "Create Incident" : "Create Ticket"}
        </motion.button>
      </div>

      {/* Stats Banner */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left"
      >
        <motion.div variants={statsVariants}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-blue-500 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><Ticket size={20} /></div>
              <p className="text-slate-500 text-sm font-medium">Total Tickets</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mt-2"><AnimatedCounter value={stats.total} /></h3>
          </div>
        </motion.div>

        <motion.div variants={statsVariants}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-amber-500 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300"><AlertCircle size={20} /></div>
              <p className="text-slate-500 text-sm font-medium">Open</p>
            </div>
            <h3 className="text-3xl font-bold text-amber-600 mt-2"><AnimatedCounter value={stats.open} /></h3>
          </div>
        </motion.div>

        <motion.div variants={statsVariants}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-indigo-500 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300"><Clock size={20} /></div>
              <p className="text-slate-500 text-sm font-medium">In Progress</p>
            </div>
            <h3 className="text-3xl font-bold text-indigo-600 mt-2"><AnimatedCounter value={stats.inProgress} /></h3>
          </div>
        </motion.div>

        <motion.div variants={statsVariants}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-emerald-500 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300"><CheckCircle2 size={20} /></div>
              <p className="text-slate-500 text-sm font-medium">Resolved</p>
            </div>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2"><AnimatedCounter value={stats.resolved} /></h3>
          </div>
        </motion.div>
      </motion.div>

      {/* Ticket List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <TicketList />
      </motion.div>
    </div>
  );
}