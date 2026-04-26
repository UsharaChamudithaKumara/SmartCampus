import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Hash, CreditCard, ShieldCheck, Wrench, Building2 } from "lucide-react";
import { fetchUserProfile } from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userEmail = sessionStorage.getItem("userEmail");

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!userEmail) throw new Error("No user email found in session");
        const data = await fetchUserProfile(userEmail);
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile details");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-slate-500">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center mt-12 bg-red-50 rounded-2xl border border-red-100">
        <ShieldCheck className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-700">Error Loading Profile</h2>
        <p className="text-sm text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "U";
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 sm:p-12 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 p-1 shadow-xl shrink-0"
          >
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt={fullName} className="w-full h-full object-cover rounded-full border-4 border-white" />
            ) : (
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-white">
                {initials}
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 text-center md:text-left pt-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium tracking-wide uppercase mb-4 backdrop-blur-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              {profile.role} {profile.role === "TECHNICIAN" && `- ${profile.technicianType}`}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              {fullName}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center md:justify-start gap-2 text-blue-100"
            >
              <User className="w-4 h-4" />
              <span>@{profile.username}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-400">First Name</p>
                <p className="font-medium text-slate-800">{profile.firstName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-400">Last Name</p>
                <p className="font-medium text-slate-800">{profile.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-400">Email Address</p>
                <div className="flex items-center gap-2 font-medium text-slate-800 break-all">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  {profile.studentEmail}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-400">NIC Number</p>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  {profile.nicNumber || "Not Provided"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Campus Identity
            </h3>
            
            <div className="space-y-5">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100 shrink-0">
                  <Hash className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-slate-500">ID Number</p>
                  <p className="font-bold text-slate-900 truncate">{profile.itNumber}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-slate-500">Account Type</p>
                  <p className="font-bold text-slate-900 truncate">{profile.role}</p>
                </div>
              </div>

              {profile.role === "TECHNICIAN" && (
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-orange-100 shrink-0">
                    <Wrench className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-slate-500">Specialty</p>
                    <p className="font-bold text-slate-900 truncate">{profile.technicianType}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
