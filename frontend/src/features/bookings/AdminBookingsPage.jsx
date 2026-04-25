import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Calendar, ClipboardList, XCircle } from "lucide-react";
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from "./bookingService";
import BookingCard from "./BookingCard";
import axios from "axios";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

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

export default function AdminBookingsPage() {
  const [allBookingsForStats, setAllBookingsForStats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data: allData } = await getAllBookings({});
      setAllBookingsForStats(allData);
      
      let filteredData = allData;
      if (statusFilter !== "ALL") {
          filteredData = allData.filter(b => b.status === statusFilter);
      }
      setBookings(filteredData);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const { data } = await axios.get("/api/resources");
      setResources(data);
    } catch {
      console.log("Could not load resources");
    }
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);
  useEffect(() => { fetchResources(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await rejectBooking(id, reason);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this booking?")) return;
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch {
      alert("Failed to delete booking.");
    }
  };

  const counts = {
    total: allBookingsForStats.length,
    pending: allBookingsForStats.filter(b => b.status === "PENDING").length,
    approved: allBookingsForStats.filter(b => b.status === "APPROVED").length,
    cancelled: allBookingsForStats.filter(b => b.status === "CANCELLED" || b.status === "REJECTED").length,
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
             Booking Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-1 flex items-center gap-3"
          >
            Manage and oversee all student staff resource requests
            {counts.pending > 0 && (
              <span className="bg-amber-100 text-amber-800 px-3 py-0.5 rounded-full text-xs font-bold leading-5 shadow-sm border border-amber-200">
                {counts.pending} Action Required
              </span>
            )}
          </motion.p>
        </div>
      </div>

      {/* Stats Banner */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={counts.total} /></p>
          </div>
        </motion.div>

        <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={counts.pending} /></p>
          </div>
        </motion.div>

        <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={counts.approved} /></p>
          </div>
        </motion.div>

        <motion.div variants={statsVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl"><XCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rejected/Cancelled</p>
            <p className="text-2xl font-bold text-slate-900"><AnimatedCounter value={counts.cancelled} /></p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading bookings...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium text-center">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm"
        >
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-900">No bookings match</p>
          <p className="text-slate-500 mt-1 mb-6">
            There are no bookings matching the current filter.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="relative group">
            <BookingCard booking={b} isAdmin={true} onApprove={handleApprove} onReject={handleReject} resources={resources} />
            <button
              onClick={() => handleDelete(b.id)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 bg-white"
              title="Delete Booking"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}