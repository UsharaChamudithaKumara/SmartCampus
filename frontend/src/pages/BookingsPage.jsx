import React, { useEffect, useState } from "react";
import { CalendarDays, Clock3, Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createBooking, fetchMyBookings } from "../api";

const EMPTY_FORM = {
  resourceId: "",
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: 1,
};

function statusClass(status) {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  if (status === "CANCELLED") return "bg-slate-200 text-slate-700";
  return "bg-amber-100 text-amber-700";
}

export default function BookingsPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(null);

  async function loadBookings() {
    setRefreshing(true);
    try {
      const data = await fetchMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to load bookings" });
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "expectedAttendees" ? Number(value) : value,
    }));
  }

  async function submitBooking(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await createBooking(form);
      setStatus({ type: "success", message: "Booking request submitted. Notification created." });
      setForm(EMPTY_FORM);
      await loadBookings();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to create booking" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Create Booking</h2>
        <p className="text-sm text-slate-500 mb-5">Create a booking request. You will get a notification immediately.</p>

        <form onSubmit={submitBooking} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Resource ID</label>
            <input
              required
              name="resourceId"
              value={form.resourceId}
              onChange={updateField}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="e.g. lab-101"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input
              required
              type="date"
              name="date"
              value={form.date}
              onChange={updateField}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Start</label>
              <input
                required
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={updateField}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">End</label>
              <input
                required
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={updateField}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Purpose</label>
            <textarea
              required
              name="purpose"
              value={form.purpose}
              onChange={updateField}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 min-h-[90px]"
              placeholder="Lecture, meeting, lab session..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Expected attendees</label>
            <input
              required
              min={1}
              type="number"
              name="expectedAttendees"
              value={form.expectedAttendees}
              onChange={updateField}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>

        {status && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm flex items-start gap-2 ${
              status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
            <span>{status.message}</span>
          </div>
        )}
      </section>

      <section className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">My Bookings</h3>
          <button
            type="button"
            onClick={loadBookings}
            className="text-sm text-blue-600 hover:text-blue-700"
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-6 text-center">
            No bookings yet.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <article key={booking.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Resource: {booking.resourceId}</p>
                    <p className="text-sm text-slate-600 mt-1">{booking.purpose}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" />{booking.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="w-3 h-3" />{booking.startTime} - {booking.endTime}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{booking.expectedAttendees} attendees</span>
                </div>
                {booking.rejectionReason && (
                  <p className="mt-2 text-xs text-red-600">Reason: {booking.rejectionReason}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
