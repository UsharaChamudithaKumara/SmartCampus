import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TicketList from "../components/TicketList";
import { Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
        variants={{
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
          <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tickets</p>
              <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={stats.total} /></p>
            </div>
          </motion.div>

          <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Open</p>
              <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={stats.open} /></p>
            </div>
          </motion.div>

          <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={stats.inProgress} /></p>
            </div>
          </motion.div>

          <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={stats.resolved} /></p>
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