import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Upload, X, Users, BookOpen, Wrench } from 'lucide-react';
import { signup } from '../api';

const ROLE_OPTIONS = [
  { value: 'STUDENT', label: 'Student', icon: Users },
  { value: 'LECTURER', label: 'Lecturer', icon: BookOpen },
  { value: 'TECHNICIAN', label: 'Technician', icon: Wrench },
];

const TECHNICIAN_TYPES = [
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'CARPENTER', label: 'Carpenter' },
  { value: 'PAINTER', label: 'Painter' },
  { value: 'HVAC', label: 'HVAC Technician' },
  { value: 'GENERAL', label: 'General Maintenance' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    itNumber: '',
    studentEmail: '',
    nicNumber: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    role: '',
    technicianType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setFormData(prev => ({ ...prev, role: value, technicianType: value === 'TECHNICIAN' ? prev.technicianType : '' }));
      setFieldErrors(prev => ({ ...prev, role: '', technicianType: '' }));
    } else if (name === 'itNumber') {
      let v = value.toUpperCase();
      v = v.replace(/[^A-Z0-9]/gi, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: v }));
      setFieldErrors(prev => ({ ...prev, itNumber: '' }));
    } else if (name === 'nicNumber') {
      let v = value.toUpperCase();
      v = v.replace(/[^0-9VX]/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, [name]: v }));
      setFieldErrors(prev => ({ ...prev, nicNumber: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setErrors([]);
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validateField = (name) => {
    let msg = '';
    switch (name) {
      case 'firstName':
        if (!formData.firstName || formData.firstName.trim() === '') msg = '❌ First name is required';
        break;
      case 'lastName':
        if (!formData.lastName || formData.lastName.trim() === '') msg = '❌ Last name is required';
        break;
      case 'username':
        if (!formData.username || formData.username.trim() === '') msg = '❌ Username is required';
        break;
      case 'itNumber':
        if (formData.role === 'STUDENT' || formData.role === '') {
          if (!formData.itNumber || formData.itNumber.trim() === '') {
            msg = '❌ Student number is required (e.g., IT23456789)';
          } else if (!/^[A-Za-z]{2}\d{8}$/.test(formData.itNumber)) {
            msg = '❌ Student number must be 2 letters followed by 8 digits (e.g., IT23456789)';
          }
        }
        break;
      case 'studentEmail':
        if (!formData.studentEmail || formData.studentEmail.trim() === '') msg = '❌ Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) msg = '❌ Enter a valid email address';
        break;
      case 'nicNumber':
        if (!formData.nicNumber || formData.nicNumber.trim() === '') msg = '❌ NIC number is required';
        break;
      case 'password':
        if (!formData.password) msg = '❌ Password is required';
        else if (!passwordRegex.test(formData.password)) msg = '❌ Password must have uppercase, lowercase, digit, special char (@$!%*?&), and 8+ characters';
        break;
      case 'confirmPassword':
        if (!formData.confirmPassword) msg = '❌ Confirm password is required';
        else if (formData.password !== formData.confirmPassword) msg = '❌ Passwords do not match';
        break;
      case 'role':
        if (!formData.role) msg = 'Role is required';
        break;
      case 'technicianType':
        if (formData.role === 'TECHNICIAN' && !formData.technicianType) msg = 'Technician type is required';
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [name]: msg }));
    return !msg;
  };

  const fieldClassName = (name, extra = '') => {
    const hasError = Boolean(fieldErrors[name]);
    const base = hasError
      ? 'w-full px-4 py-2.5 border border-red-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white'
      : 'w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white';
    return `${base} ${extra}`.trim();
  };

  const showFieldError = (name) => {
    if (!fieldErrors[name]) return null;
    return <p className="text-xs text-red-600 mt-1">{fieldErrors[name]}</p>;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(['❌ Please select a valid image file']);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(['❌ Image size must be less than 5MB']);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
      setProfilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: null }));
    setProfilePreview(null);
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.push('❌ First name is required');
    }

    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.push('❌ Last name is required');
    }

    if (!formData.username || formData.username.trim() === '') {
      newErrors.push('❌ Username is required');
    }

    if (!formData.role) {
      newErrors.push('Role is required');
    }

    if (formData.role === 'TECHNICIAN' && !formData.technicianType) {
      newErrors.push('Technician type is required');
    }

    if (formData.role === 'STUDENT' || formData.role === '') {
      if (!formData.itNumber || formData.itNumber.trim() === '') {
        newErrors.push('❌ Student number is required (format: 2 letters + 8 digits)');
      } else if (!/^[A-Za-z]{2}\d{8}$/.test(formData.itNumber)) {
        newErrors.push('❌ Student number must be 2 letters followed by 8 digits (e.g., IT23456789)');
      }
    }

    if (!formData.studentEmail || formData.studentEmail.trim() === '') {
      newErrors.push('❌ Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      newErrors.push('❌ Enter a valid email address');
    }

    if (!formData.nicNumber || formData.nicNumber.trim() === '') {
      newErrors.push('❌ NIC number is required');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!formData.password) {
      newErrors.push('❌ Password is required');
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.push('❌ Password must have uppercase, lowercase, digit, special char (@$!%*?&), and 8+ characters');
    }

    if (!formData.confirmPassword) {
      newErrors.push('❌ Confirm password is required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push('❌ Passwords do not match');
    }

    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await signup(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.itNumber,
        formData.studentEmail,
        formData.nicNumber,
        formData.password,
        formData.confirmPassword,
        formData.profilePhoto,
        formData.role,
        formData.role === 'TECHNICIAN' ? formData.technicianType : null
      );

      if (formData.role === 'TECHNICIAN' || !result.token) {
        setSuccess(result.message || 'Technician registration submitted. Please wait for admin approval before logging in.');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
        return;
      }

      setSuccess('✅ Account created successfully! Redirecting...');

      const safeEmail = (result.studentEmail || result.email || formData.studentEmail || '').trim();
      const safeName = [result.firstName, result.lastName].filter(Boolean).join(' ').trim() || result.username || safeEmail;

      localStorage.setItem('token', result.token);
      localStorage.setItem('userEmail', safeEmail);
      localStorage.setItem('userName', safeName);
      localStorage.setItem('userRole', result.role);
      localStorage.setItem('isLoggedIn', 'true');

      setTimeout(() => {
        navigate(result.role === 'ADMIN' ? '/admin' : '/dashboard');
      }, 1500);
    } catch (err) {
      setErrors([err.message || 'Signup failed']);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
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
            Create Account
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 mt-2">
            
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 backdrop-blur-sm"
        >
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <form onSubmit={handleSignup} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Register As
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'role', value } })}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-all ${
                        formData.role === value
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      {label}
                    </button>
                  ))}
                </div>
                {showFieldError('role')}
              </motion.div>

              {formData.role === 'TECHNICIAN' && (
                <motion.div variants={itemVariants} className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Technician Type</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {TECHNICIAN_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'technicianType', value: type.value } })}
                        className={`rounded-lg px-3 py-2 text-xs font-medium border transition-all ${
                          formData.technicianType === type.value
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {showFieldError('technicianType')}
                  <p className="mt-3 text-xs text-slate-500">
                    Technician accounts need admin approval before login is enabled.
                  </p>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {profilePreview ? (
                    <div className="relative">
                      <img
                        src={profilePreview}
                        alt="profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <Upload className="w-8 h-8" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => validateField('firstName')}
                    placeholder="John"
                    className={fieldClassName('firstName')}
                  />
                  {showFieldError('firstName')}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => validateField('lastName')}
                    placeholder="Doe"
                    className={fieldClassName('lastName')}
                  />
                  {showFieldError('lastName')}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => validateField('username')}
                  placeholder="johndoe"
                  className={fieldClassName('username')}
                />
                {showFieldError('username')}
              </motion.div>

              {formData.role === 'STUDENT' ? (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Student Number <span className="text-xs text-slate-500">(2 letters + 8 digits)</span>
                </label>
                <input
                  type="text"
                  name="itNumber"
                  value={formData.itNumber}
                  onChange={handleChange}
                  onBlur={() => validateField('itNumber')}
                  placeholder="IT23456789"
                  maxLength="10"
                  inputMode="text"
                  className={fieldClassName('itNumber', 'font-mono')}
                />
                {showFieldError('itNumber')}
                {!fieldErrors.itNumber && formData.itNumber && /^[A-Za-z]{2}\d{8}$/.test(formData.itNumber) && (
                  <p className="text-xs text-green-600 mt-1">✓ Valid ID</p>
                )}
              </motion.div>
              ) : null}

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  onBlur={() => validateField('studentEmail')}
                  placeholder="name@example.com"
                  className={fieldClassName('studentEmail')}
                />
                {showFieldError('studentEmail')}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  NIC Number
                </label>
                <input
                  type="text"
                  name="nicNumber"
                  value={formData.nicNumber}
                  onChange={handleChange}
                  onBlur={() => validateField('nicNumber')}
                  placeholder="9876543210"
                  inputMode="numeric"
                  className={fieldClassName('nicNumber', 'font-mono')}
                />
                {showFieldError('nicNumber')}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => validateField('password')}
                    placeholder="••••••••"
                    className={fieldClassName('password', 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Uppercase, lowercase, digit, special char (@$!%*?&), 8+ chars
                </p>
                {showFieldError('password')}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => validateField('confirmPassword')}
                    placeholder="••••••••"
                    className={fieldClassName('confirmPassword', 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {showFieldError('confirmPassword')}
              </motion.div>

              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200"
                >
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700 space-y-1">
                      {errors.map((error, idx) => (
                        <div key={idx}>{error}</div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </motion.div>
              )}

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>

            <motion.div variants={itemVariants} className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

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
      `}</style>
    </div>
  );
}
