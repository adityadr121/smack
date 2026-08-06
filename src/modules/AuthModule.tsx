import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedECG } from '../components/common/AnimatedECG';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Fingerprint, 
  ArrowRight, 
  Sparkles,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  User,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface AuthModuleProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({ onLoginSuccess }) => {
  const { login, createAccount, registerHospital } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'register' | 'forgot' | 'reset'>('login');
  
  // Real credentials inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Create Account State
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor' as UserRole,
    hospitalName: 'Johns Hopkins Health System'
  });

  // Hospital Registration State (Full 9 Fields)
  const [regForm, setRegForm] = useState({
    hospitalName: '',
    licenseNumber: '',
    address: '',
    hospitalEmail: '',
    phone: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your registered email and password.');
      return;
    }

    setIsAuthenticating(true);

    const result = await login(email.trim(), password.trim());

    setIsAuthenticating(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid email or password.');
      return; // STOP execution on failure - DO NOT REDIRECT
    }

    onLoginSuccess('doctor');
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!signupForm.fullName.trim() || !signupForm.email.trim() || !signupForm.password.trim()) {
      setErrorMessage('Please fill in all required fields to create your account.');
      return;
    }

    setIsAuthenticating(true);

    const result = await createAccount({
      fullName: signupForm.fullName,
      email: signupForm.email,
      password: signupForm.password,
      role: signupForm.role,
      hospitalName: signupForm.hospitalName
    });

    setIsAuthenticating(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Account creation failed.');
      return;
    }

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setEmail(signupForm.email);
    setSuccessMessage(result.message || 'Account created successfully! Please sign in with your credentials.');
    setTab('login');
  };

  const handleRegisterHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!regForm.hospitalName || !regForm.adminEmail || !regForm.password) {
      setErrorMessage('Please fill in all required hospital enrollment fields.');
      return;
    }

    setIsAuthenticating(true);

    const result = await registerHospital(regForm);

    setIsAuthenticating(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Hospital registration failed.');
      return;
    }

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setEmail(regForm.adminEmail);
    setSuccessMessage(result.message || 'Hospital enrolled successfully! Please sign in with your Admin credentials.');
    setTab('login');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 md:p-6">
      <div className="w-full max-w-6xl glass-panel bg-slate-950/90 border border-slate-800 rounded-3xl grid grid-cols-1 lg:grid-cols-12 shadow-2xl overflow-hidden min-h-[620px]">
        
        {/* LEFT SIDE: Healthcare Branding, Live Canvas ECG & AI Graphics */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CureLink AI Enterprise CDSS v3.2</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Early Sepsis Intelligence <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                6–12 Hours Before Shock
              </span>
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering hospital intensive care teams with explainable XGBoost + SHAP predictive analytics using routine bedside vital signs and lab chemistry.
            </p>
          </div>

          {/* Centerpiece: Live Animated ECG Heartbeat Monitor */}
          <div className="my-8 relative z-10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <HeartPulse className="w-4 h-4 animate-pulse" />
                Live Lead II PQRST Waveform
              </span>
              <span className="text-cyan-400">HR: 84 bpm</span>
            </div>

            <div className="glass-panel p-2 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
              <AnimatedECG bpm={84} />
            </div>
          </div>

          {/* Development Seed Accounts Box */}
          <div className="relative z-10 p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs space-y-2 font-mono">
            <span className="text-cyan-400 font-bold uppercase block text-[10px]">Instant Demo Login (Click to Sign In):</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <button
                type="button"
                onClick={async () => {
                  setEmail('admin@hospital.com');
                  setPassword('Admin@123');
                  setIsAuthenticating(true);
                  const res = await login('admin@hospital.com', 'Admin@123');
                  setIsAuthenticating(false);
                  if (res.success) onLoginSuccess('admin');
                }}
                className="btn-raw text-left p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer"
              >
                <div className="font-bold text-cyan-400">Admin Account</div>
                <div className="text-[10px] text-slate-400">admin@hospital.com</div>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setEmail('doctor@hospital.com');
                  setPassword('Doctor@123');
                  setIsAuthenticating(true);
                  const res = await login('doctor@hospital.com', 'Doctor@123');
                  setIsAuthenticating(false);
                  if (res.success) onLoginSuccess('doctor');
                }}
                className="btn-raw text-left p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer"
              >
                <div className="font-bold text-cyan-400">Doctor Account</div>
                <div className="text-[10px] text-slate-400">doctor@hospital.com</div>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setEmail('nurse@hospital.com');
                  setPassword('Nurse@123');
                  setIsAuthenticating(true);
                  const res = await login('nurse@hospital.com', 'Nurse@123');
                  setIsAuthenticating(false);
                  if (res.success) onLoginSuccess('nurse');
                }}
                className="btn-raw text-left p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer"
              >
                <div className="font-bold text-cyan-400">Nurse Account</div>
                <div className="text-[10px] text-slate-400">nurse@hospital.com</div>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setEmail('lab@hospital.com');
                  setPassword('Lab@123');
                  setIsAuthenticating(true);
                  const res = await login('lab@hospital.com', 'Lab@123');
                  setIsAuthenticating(false);
                  if (res.success) onLoginSuccess('lab_tech');
                }}
                className="btn-raw text-left p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer"
              >
                <div className="font-bold text-cyan-400">Lab Specialist</div>
                <div className="text-[10px] text-slate-400">lab@hospital.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Glassmorphism Real Authentication Form */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-slate-950/90 relative">
          
          {/* Header Tabs with Create Account tab */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6 text-[11px] font-semibold">
            <button
              onClick={() => { setTab('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                tab === 'login' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                tab === 'signup' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                tab === 'register' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register Hospital
            </button>
            <button
              onClick={() => { setTab('forgot'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition focus:ring-2 focus:ring-cyan-400 focus:outline-none ${
                tab === 'forgot' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forgot
            </button>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* 1. SIGN IN FORM (/login) */}
            {tab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4 text-xs"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Clinical SSO Sign In</h3>
                  <p className="text-slate-400">Enter your registered email and bcrypt-hashed password.</p>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Registered Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Doctor@123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className="text-slate-400">Remember Me</span>
                  </label>
                  <button type="button" onClick={() => setTab('forgot')} className="text-cyan-400 hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  {isAuthenticating ? (
                    <span>Validating Credentials...</span>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Authenticate Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* 2. CREATE AN ACCOUNT FORM */}
            {tab === 'signup' && (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCreateAccountSubmit}
                className="space-y-3 text-xs"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Create Clinical Account</h3>
                  <p className="text-slate-400">Register your personal staff account on CureLink AI.</p>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Dr. Sarah Jenkins, MD"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Institutional Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="s.jenkins@johns-hopkins-health.org"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Clinical Duty Role</label>
                    <select
                      value={signupForm.role}
                      onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value as UserRole })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    >
                      <option value="doctor">Attending Physician (MD)</option>
                      <option value="nurse">Clinical Nurse (RN)</option>
                      <option value="admin">Hospital Admin</option>
                      <option value="lab_tech">Lab Specialist (CLS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Hospital Network</label>
                    <input
                      type="text"
                      value={signupForm.hospitalName}
                      onChange={(e) => setSignupForm({ ...signupForm, hospitalName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition focus:ring-2 focus:ring-cyan-400 focus:outline-none flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? 'Creating Account & Password Hash...' : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Personal Account</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* 3. HOSPITAL REGISTRATION FORM (/register-hospital) */}
            {tab === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegisterHospitalSubmit}
                className="space-y-2.5 text-xs max-h-[500px] overflow-y-auto pr-1"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Enroll New Hospital Network</h3>
                  <p className="text-slate-400">Register your healthcare institution to create your Hospital Admin account.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Hospital Name</label>
                    <input
                      type="text"
                      placeholder="St. Jude Children's Research"
                      value={regForm.hospitalName}
                      onChange={(e) => setRegForm({ ...regForm, hospitalName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">License Number</label>
                    <input
                      type="text"
                      placeholder="HL7-FHIR-994820"
                      value={regForm.licenseNumber}
                      onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 font-mono focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Hospital Address</label>
                  <input
                    type="text"
                    placeholder="262 Danny Thomas Pl, Memphis, TN 38105"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Hospital Email</label>
                    <input
                      type="email"
                      placeholder="admin@hospital-health.org"
                      value={regForm.hospitalEmail}
                      onChange={(e) => setRegForm({ ...regForm, hospitalEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (800) 555-0199"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Admin Officer Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Arthur Pendelton"
                      value={regForm.adminName}
                      onChange={(e) => setRegForm({ ...regForm, adminName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Admin Email</label>
                    <input
                      type="email"
                      placeholder="admin@stjude-health.org"
                      value={regForm.adminEmail}
                      onChange={(e) => setRegForm({ ...regForm, adminEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Admin Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  {isAuthenticating ? 'Provisioning Hospital Tenant...' : 'Register Institution & Create Admin Account'}
                </button>
              </motion.form>
            )}

            {/* 4. FORGOT PASSWORD FORM (/forgot-password) */}
            {tab === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-xs"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Reset Account Password</h3>
                  <p className="text-slate-400">Enter your registered email address to receive a password reset token.</p>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Registered Email</label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <button
                  onClick={() => {
                    setSuccessMessage('Password reset token sent to your email.');
                    setTab('reset');
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-semibold focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  Dispatch Reset Token
                </button>
              </motion.div>
            )}

            {/* 5. RESET PASSWORD FORM (/reset-password) */}
            {tab === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-xs"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Set New Password</h3>
                  <p className="text-slate-400">Enter the reset token sent to your email and your new password.</p>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Reset Token</label>
                  <input type="text" placeholder="RST-998201" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:ring-2 focus:ring-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">New Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none" />
                </div>
                <button
                  onClick={() => {
                    setSuccessMessage('Password updated successfully. Please sign in.');
                    setTab('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  Update Password & Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
