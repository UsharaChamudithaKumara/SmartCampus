import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../api";

function formatWhen(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts;
  return date.toLocaleString();
}

export default function NotificationsPage() {
  const userEmail = localStorage.getItem("userEmail") || "";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  async function load() {
    if (!userEmail) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchNotifications(userEmail);
      setNotifications(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [userEmail]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  async function markOne(id) {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  async function markAll() {
    if (!userEmail) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead(userEmail);
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500 mt-1">View Ticket and Booking updates here.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-2.5 py-1">
            {unreadCount} unread
          </span>
          <button
            type="button"
            onClick={markAll}
            disabled={markingAll || unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          >
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark all read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14 text-slate-500 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`rounded-lg border p-4 ${item.read ? "border-slate-200 bg-slate-50" : "border-blue-200 bg-blue-50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 rounded-full p-1.5 ${item.read ? "bg-slate-200" : "bg-blue-100"}`}>
                    <Bell className="w-3.5 h-3.5 text-slate-700" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-700 mt-1">{item.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{formatWhen(item.createdAt)}</p>
                  </div>
                </div>

                {!item.read && (
                  <button
                    type="button"
                    onClick={() => markOne(item.id)}
                    className="text-xs px-2 py-1 rounded-md border border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
