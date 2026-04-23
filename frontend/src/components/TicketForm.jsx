import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createTicket, uploadImages } from "../api";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TicketForm({ onCreated }) {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userEmail") || "";

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    priority: "MEDIUM",
    resourceId: "",
    location: "",
    preferredContactName: "",
    preferredContactEmail: currentUserId,
    preferredContactPhone: "",
    userId: currentUserId,
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function update(e) {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (!currentUserId) {
      setStatus({
        type: "error",
        message: "Session expired. Please log in again.",
      });
      setLoading(false);
      return;
    }

    try {
      const created = await createTicket({ ...form, userId: currentUserId });

      if (files && files.length > 0) {
        await uploadImages(created.id, files);
      }

      setStatus({
        type: "success",
        message: "Ticket created successfully! Redirecting...",
      });

      if (onCreated) onCreated();

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to create ticket",
      });
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <div className="w-full max-w-2xl mx-auto">
      <motion.button
        onClick={() => navigate("/")}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to tickets
      </motion.button>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create New Ticket
          </h2>
          <p className="text-slate-500 mt-1.5">
            Fill out the details below to open a new support request.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status?.type === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.1,
                }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Ticket Created!
              </h3>
              <p className="text-slate-500">
                Redirecting you back to the dashboard...
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              onSubmit={submit}
              className="space-y-5"
            >
              <motion.div variants={itemVariants}>
                <label className="text-sm font-semibold text-slate-700">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={update}
                  required
                  className="w-full border rounded-xl px-4 py-2.5"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={update}
                  required
                  placeholder="Detailed explanation..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 min-h-[120px] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select name="category" value={form.category} onChange={update} required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none">
                    <option value="Bug">Bug</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Support">Support</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Priority</label>
                  <select name="priority" value={form.priority} onChange={update} required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Resource ID (optional)</label>
                  <input name="resourceId" value={form.resourceId} onChange={update} className="w-full border rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Submitted By</label>
                  <input value={currentUserId || "Not signed in"} readOnly className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 text-slate-600" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={update}
                    placeholder="e.g. Library - Level 2"
                    className="w-full border rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Preferred Contact Name</label>
                  <input
                    name="preferredContactName"
                    value={form.preferredContactName}
                    onChange={update}
                    placeholder="Optional"
                    className="w-full border rounded-xl px-4 py-2.5"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Preferred Contact Email</label>
                  <input
                    name="preferredContactEmail"
                    value={form.preferredContactEmail}
                    onChange={update}
                    className="w-full border rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Preferred Contact Phone</label>
                  <input
                    name="preferredContactPhone"
                    value={form.preferredContactPhone}
                    onChange={update}
                    placeholder="Optional"
                    className="w-full border rounded-xl px-4 py-2.5"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Attachment <span className="text-slate-400 font-normal">(Optional, up to 3)</span></label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300 transition-colors relative overflow-hidden group p-4">
                    <div className="w-full">
                      {files && files.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                          {files.map((f, idx) => (
                            <div key={idx} className="relative w-full h-24 bg-white rounded overflow-hidden border">
                              <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                              <button type="button" onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter((_, i) => i !== idx)); }} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                          <p className="text-sm text-slate-600 font-medium"><span>Click or drag to upload</span></p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                      const selected = Array.from(e.target.files || []).slice(0, 3);
                      setFiles(selected);
                    }} />
                  </label>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Ticket...
                  </>
                ) : (
                  'Submit Ticket'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status?.type === "error" && (
            <motion.div className="mt-4 p-4 rounded-xl bg-red-50 text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{status.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}