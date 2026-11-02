import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  User,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Stethoscope,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { Role, ShiftType } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    login,
    registerAccount,
    accounts,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('patient');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regLoginId, setRegLoginId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState<number>(28);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regSpecialty, setRegSpecialty] = useState('Senior Optometrist & Contact Lens');
  const [regDegree, setRegDegree] = useState('B.Optom, M.Optom');
  const [regRoom, setRegRoom] = useState('Room 103 (Clinical OPD)');
  const [regShift, setRegShift] = useState<ShiftType>('Morning');
  const [regError, setRegError] = useState('');

  if (activeModal !== 'auth') return null;

  // Auto-generate Login ID helper
  const handleGenerateLoginId = () => {
    const prefix = selectedRole === 'doctor' ? 'doc' : selectedRole === 'admin' ? 'admin' : 'pat';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const generated = `${prefix}_${rand}`;
    setRegLoginId(generated);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginId.trim()) {
      setLoginError('Please enter your Login ID or registered Email.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    const res = login(loginId, loginPassword);
    if (res.success) {
      setActiveModal(null);
      setLoginId('');
      setLoginPassword('');
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regLoginId.trim()) {
      setRegError('Please choose or generate a Login ID.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (!regFullName.trim()) {
      setRegError('Full Name is required.');
      return;
    }

    const res = registerAccount({
      loginId: regLoginId.trim(),
      password: regPassword,
      name: regFullName.trim(),
      email: regEmail.trim() || `${regLoginId.toLowerCase()}@eyeclinic.org`,
      phone: regPhone.trim() || '+91 98000 00000',
      role: selectedRole,
      patientAge: selectedRole === 'patient' ? regAge : undefined,
      patientGender: selectedRole === 'patient' ? regGender : undefined,
      doctorSpecialty: selectedRole === 'doctor' ? regSpecialty : undefined,
      doctorDegree: selectedRole === 'doctor' ? regDegree : undefined,
      doctorRoom: selectedRole === 'doctor' ? regRoom : undefined,
      doctorShift: selectedRole === 'doctor' ? regShift : undefined
    });

    if (res.success) {
      setActiveModal(null);
      setRegLoginId('');
      setRegPassword('');
      setRegFullName('');
      setRegEmail('');
      setRegPhone('');
    } else {
      setRegError(res.message);
    }
  };

  const handleQuickLogin = (demoLoginId: string, demoPass: string) => {
    setLoginId(demoLoginId);
    setLoginPassword(demoPass);
    const res = login(demoLoginId, demoPass);
    if (res.success) {
      setActiveModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              Role-Based Access Control
            </span>
          </div>

          <h2 className="text-2xl font-bold font-heading">
            {mode === 'login' ? 'Sign In to Your Dashboard' : 'Create Login ID & Password'}
          </h2>
          <p className="text-xs text-teal-200/80 mt-1">
            {mode === 'login'
              ? 'Access your Patient, Doctor, or Clinic Admin portal with your credentials.'
              : 'Register your personal Login ID and password for instant access to your dedicated portal.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex mt-4 bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In (Existing User)
            </button>
            <button
              onClick={() => {
                setMode('register');
                setRegError('');
                if (!regLoginId) handleGenerateLoginId();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Create Account (New Login ID)
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Role Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">
              Select Your Role / Perspective
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('patient');
                  if (mode === 'register' && !regLoginId.startsWith('pat_')) {
                    setRegLoginId(`pat_${Math.floor(1000 + Math.random() * 9000)}`);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col items-start gap-1 cursor-pointer ${
                  selectedRole === 'patient'
                    ? 'border-teal-500 bg-teal-50/70 text-teal-900 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'patient' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Patient</div>
                  <div className="text-[10px] text-slate-500">Rx, slots, orders</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('doctor');
                  if (mode === 'register' && !regLoginId.startsWith('doc_')) {
                    setRegLoginId(`doc_${Math.floor(100 + Math.random() * 900)}`);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col items-start gap-1 cursor-pointer ${
                  selectedRole === 'doctor'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-xs ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'doctor' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Doctor</div>
                  <div className="text-[10px] text-slate-500">OPD queue, write Rx</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  if (mode === 'register' && !regLoginId.startsWith('admin_')) {
                    setRegLoginId(`admin_${Math.floor(100 + Math.random() * 900)}`);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col items-start gap-1 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Admin</div>
                  <div className="text-[10px] text-slate-500">Stock & users</div>
                </div>
              </button>
            </div>
          </div>

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login ID input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Login ID or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginId}
                    onChange={e => setLoginId(e.target.value)}
                    placeholder="e.g. patient_aditya, doc_abishek, admin_master"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-teal-600 font-medium">Standard or Created Password</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md shadow-teal-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* One-click quick login credentials helper */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Quick One-Click Demo Credentials:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('patient_aditya', 'patient123')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/80 border border-slate-200 hover:border-teal-300 text-left transition group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-teal-900 group-hover:text-teal-700">Patient Demo</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: patient_aditya</div>
                    <div className="text-[10px] text-slate-400 font-mono">Pass: patient123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('doc_abishek', 'doctor123')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200 hover:border-sky-300 text-left transition group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-sky-900 group-hover:text-sky-700">Doctor Demo</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: doc_abishek</div>
                    <div className="text-[10px] text-slate-400 font-mono">Pass: doctor123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin_master', 'admin123')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 text-left transition group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-indigo-900 group-hover:text-indigo-700">Admin Demo</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: admin_master</div>
                    <div className="text-[10px] text-slate-400 font-mono">Pass: admin123</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE: REGISTER / CREATE LOGIN ID & PASSWORD */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Login ID with Generate Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Create Login ID / Username *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateLoginId}
                    className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto-Generate ID
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regLoginId}
                    onChange={e => setRegLoginId(e.target.value)}
                    placeholder="e.g. rahul_sharma or pat_7491"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-mono"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">This Login ID will be used every time you sign in.</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password * (min 4 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Set your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder={selectedRole === 'doctor' ? 'e.g. Dr. Ramesh Gupta' : 'e.g. Ramesh Gupta'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>

              {/* Contact Details (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Patient Specific Fields */}
              {selectedRole === 'patient' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <div>
                    <label className="block text-xs font-medium text-teal-900 mb-1">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={regAge}
                      onChange={e => setRegAge(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-teal-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-teal-900 mb-1">Gender</label>
                    <select
                      value={regGender}
                      onChange={e => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-teal-200 bg-white text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Doctor Specific Fields */}
              {selectedRole === 'doctor' && (
                <div className="p-3 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-sky-900 mb-1">Qualifications</label>
                      <input
                        type="text"
                        value={regDegree}
                        onChange={e => setRegDegree(e.target.value)}
                        placeholder="MBBS, MS / B.Optom"
                        className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-sky-900 mb-1">OPD Shift</label>
                      <select
                        value={regShift}
                        onChange={e => setRegShift(e.target.value as ShiftType)}
                        className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-sm"
                      >
                        <option value="Morning">Morning (09:00 - 12:00)</option>
                        <option value="Afternoon">Afternoon (13:00 - 16:00)</option>
                        <option value="Evening">Evening (17:00 - 20:00)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-sky-900 mb-1">Specialty</label>
                      <input
                        type="text"
                        value={regSpecialty}
                        onChange={e => setRegSpecialty(e.target.value)}
                        placeholder="Refractive Specialist"
                        className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-sky-900 mb-1">Consultation Room</label>
                      <input
                        type="text"
                        value={regRoom}
                        onChange={e => setRegRoom(e.target.value)}
                        placeholder="Room 103"
                        className="w-full px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md shadow-teal-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account & Log In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
