import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2, Users, BookOpen, Wrench, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import GoogleSignInButton from "../components/GoogleSignInButton";
import TechnicianLoginStatus from "../components/TechnicianLoginStatus";
import { googleLogin, login } from "../api";

const TECHNICIAN_TYPES = [
  { value: "HARDWARE", label: "Hardware" },
  { value: "SOFTWARE", label: "Software" },
  { value: "NETWORK", label: "Network" },
  { value: "GENERAL", label: "General Maintenance" },
];

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTechType, setSelectedTechType] = useState(null);
  const [showTechnicianStatus, setShowTechnicianStatus] = useState(false);
  const [technicianEmail, setTechnicianEmail] = useState("");
  const [form, setForm] = useState({
    studentEmail: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function extractEmailFromCredential(credential) {
    try {
      const payload = credential?.split(".")?.[1];
      if (!payload) return "";

      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = JSON.parse(atob(normalized));
      return (json?.email || "").trim();
    } catch {
      return "";
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setShowTechnicianStatus(false);

    try {
      const data = await login(form.studentEmail, form.password, selectedRole, selectedTechType);

      const safeEmail = (data.studentEmail || data.email || form.studentEmail || '').trim();
      const safeName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.username || safeEmail;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', safeEmail);
      localStorage.setItem('userName', safeName);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('isLoggedIn', 'true');

      if (onLoginSuccess) {
        onLoginSuccess(safeEmail);
      }
      
      setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => {
        if (data.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (data.role === 'TECHNICIAN') {
          navigate('/staff/tickets', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);
    } catch (err) {
      const errMsg = err.message || 'Login failed. Please try again.';
      
      if (selectedRole === 'TECHNICIAN' && errMsg.includes('pending admin approval')) {
        setShowTechnicianStatus(true);
        setTechnicianEmail(form.studentEmail);
        setStatus({ type: 'error', message: errMsg });
      } else {
        setStatus({ type: 'error', message: errMsg });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(credential) {
    setLoading(true);
    setStatus(null);

    try {
      const data = await googleLogin(credential, null);

      const gmailFromToken = extractEmailFromCredential(credential);
      const safeEmail = (data.studentEmail || data.email || gmailFromToken || '').trim();
      const safeName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.username || safeEmail;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', safeEmail);
      localStorage.setItem('userName', safeName);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('isLoggedIn', 'true');

      if (onLoginSuccess) {
        onLoginSuccess(safeEmail);
      }

      setStatus({ type: 'success', message: 'Google login successful! Redirecting...' });
      setTimeout(() => {
        if (data.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (data.role === 'TECHNICIAN') {
          navigate('/staff/tickets', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Google login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/30 mb-4"
          >
            <span className="text-2xl font-bold text-white">SC</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-slate-900 tracking-tight">
            SmartCampus
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 mt-2">
            Login to access your account
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 backdrop-blur-sm"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h2 variants={itemVariants} className="text-xl font-bold text-slate-900 mb-6">
              Select Your Role
            </motion.h2>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
              {[
                { role: "STUDENT", label: "Student", icon: Users },
                { role: "LECTURER", label: "Lecturer", icon: BookOpen },
                { role: "TECHNICIAN", label: "Technician", icon: Wrench },
              ].map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    if (role !== "TECHNICIAN") setSelectedTechType(null);
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-all ${
                    selectedRole === role
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </motion.div>

            {selectedRole === "TECHNICIAN" && (
              <motion.div variants={itemVariants} className="mb-6 rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Select Technician Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {TECHNICIAN_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedTechType(type.value)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium border transition-all ${
                        selectedTechType === type.value
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedRole && (selectedRole !== "TECHNICIAN" || selectedTechType) && (
              <>
                <motion.button
                  variants={itemVariants}
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setSelectedTechType(null);
                  }}
                  className="mb-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to role selection
                </motion.button>

                {selectedRole !== "TECHNICIAN" && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-700">Google login</p>
                    <p className="text-xs text-slate-500 mt-1">Use your Google account to sign in.</p>
                    <div className="mt-3">
                      <GoogleSignInButton
                        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                        onCredential={(credential) => handleGoogleLogin(credential)}
                        width={360}
                      />
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="studentEmail"
                        value={form.studentEmail}
                        onChange={handleChange}
                        required
                        placeholder="name@example.com"
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
                      />
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Forgot Password Link */}
                  <motion.div variants={itemVariants} className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </motion.div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {status && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          status.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {status.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm">{status.message}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showTechnicianStatus && (
                    <TechnicianLoginStatus 
                      technicianEmail={technicianEmail}
                      onApproved={() => {
                        setShowTechnicianStatus(false);
                        window.location.reload();
                      }}
                    />
                  )}

                  {/* Login Button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <motion.div variants={itemVariants} className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                      Create one now
                    </Link>
                  </p>
                </motion.div>
              </>
            )}

            {!selectedRole && (
              <motion.div variants={itemVariants} className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-600">
                <p>Select your role above to continue</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center mt-6 text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SmartCampus. All rights reserved.
        </motion.div>
      </motion.div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
