import { useState } from "react";
import { createBooking } from "./bookingService";
import { AlertCircle, Calendar, Clock, MapPin, Users, FileText } from "lucide-react";

export default function BookingForm({ resources = [], onSuccess }) {
  const [form, setForm] = useState({
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      return;
    }
    setLoading(true);
    try {
      await createBooking({ ...form, expectedAttendees: Number(form.expectedAttendees) });
      onSuccess?.();
      setForm({ resourceId: "", date: "", startTime: "", endTime: "", purpose: "", expectedAttendees: 1 });
    } catch (err) {
      setError(err.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold flex items-start gap-2 border border-red-100 shadow-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Resource Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Facility / Resource</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
              <MapPin className="h-4 w-4" />
            </div>
            <select
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold appearance-none cursor-pointer"
            >
              <option value="">-- Select a facility --</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.type}) - {r.location}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Booking Date</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold"
            />
          </div>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Time</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                <Clock className="h-4 w-4" />
              </div>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Time</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                <Clock className="h-4 w-4" />
              </div>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Purpose of Booking</label>
          <div className="relative group">
            <div className="absolute top-3 left-3 pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
              <FileText className="h-4 w-4" />
            </div>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="e.g. Group discussion for final project..."
              required
              rows={2}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold resize-none"
            />
          </div>
        </div>

        {/* Attendees */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expected Attendees</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
              <Users className="h-4 w-4" />
            </div>
            <input
              type="number"
              name="expectedAttendees"
              value={form.expectedAttendees}
              onChange={handleChange}
              min={1}
              required
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 mt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Request...</span>
             </div>
          ) : (
            <span>Submit Booking Request</span>
          )}
        </button>
      </div>
    </form>
  );
}