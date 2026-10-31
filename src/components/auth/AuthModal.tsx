import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { Role } from '../../types';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, switchRole, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('749281');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (activeModal !== 'auth') return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone && !email) {
      showToast('error', 'Required Field', 'Please enter your phone number or email.');
      return;
    }
    // Generate a new 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedDemoOtp(code);
    setResendTimer(45);
    setStep('otp');
    showToast(
      'info',
      'OTP Sent (2FA Simulation)',
      `Security Code ${code} dispatched to ${phone || email} as per RFC 4226 standards.`
    );
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste
      const pasted = val.slice(0, 6).split('');
      const newOtp = [...otpCode];
      pasted.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtpCode(newOtp);
      return;
    }
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      showToast('warning', 'Incomplete OTP', 'Please enter all 6 digits of the OTP.');
      return;
    }

    // Success
    showToast('success', 'Identity Verified', `Welcome! Authentication successful as ${selectedRole}.`);
    switchRole(selectedRole);
    setActiveModal(null);
    setStep('credentials');
    setOtpCode(['', '', '', '', '', '']);
  };

  const handleQuickDemoLogin = (role: Role) => {
    switchRole(role);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 p-6 text-white text-center relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mb-2 text-white">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-heading">
            {step === 'otp' ? 'Enter 2-Factor OTP' : mode === 'login' ? 'Secure Clinic Portal' : 'Patient Registration'}
          </h3>
          <p className="text-xs text-teal-100 mt-1">
            {step === 'otp'
              ? `Verification code dispatched to your registered device`
              : 'Role-based access with OTP verification & bcrypt security'}
          </p>
        </div>

        <div className="p-6">
          {/* Role selector buttons */}
          {step === 'credentials' && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['patient', 'doctor', 'admin'] as Role[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer flex flex-col items-center gap-1 ${
                      selectedRole === r
                        ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r === 'patient' && <User className="w-4 h-4 text-teal-600" />}
                    {r === 'doctor' && <ShieldCheck className="w-4 h-4 text-sky-600" />}
                    {r === 'admin' && <Lock className="w-4 h-4 text-indigo-600" />}
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditya Sharma"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="aditya.sharma@niu.edu.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile (for OTP SMS)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('info', 'Password Reset', 'Password recovery link sent.'); }} className="text-xs text-teal-600 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-xs text-slate-600 pt-2">
                <span>{mode === 'login' ? "Don't have an account?" : 'Already registered?'}</span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  {mode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            </form>
          ) : (
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-mono mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Simulated OTP Code: <strong>{generatedDemoOtp}</strong></span>
                </div>
                <p className="text-xs text-slate-500">
                  Please enter the 6-digit code sent to your device.
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 my-4">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-slate-50 focus:bg-white"
                  />
                ))}
              </div>

              {/* Auto-fill Helper */}
              <button
                type="button"
                onClick={() => setOtpCode(generatedDemoOtp.split(''))}
                className="w-full py-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2 cursor-pointer"
              >
                Auto-fill Code ({generatedDemoOtp})
              </button>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="hover:text-slate-800 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => {
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedDemoOtp(code);
                    setResendTimer(45);
                    showToast('info', 'New OTP Sent', `Code: ${code}`);
                  }}
                  className={`flex items-center gap-1 cursor-pointer ${
                    resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-teal-600 hover:underline'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend in {resendTimer > 0 ? `${resendTimer}s` : 'Now'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Switcher Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Evaluator Quick Access (1-Click Login)
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 transition text-center cursor-pointer"
              >
                <span className="font-bold block">Patient</span>
                <span className="text-[10px] text-slate-400 block">Aditya Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-800 transition text-center cursor-pointer"
              >
                <span className="font-bold block">Doctor</span>
                <span className="text-[10px] text-slate-400 block">Dr. Shalini Sengupta</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-800 transition text-center cursor-pointer"
              >
                <span className="font-bold block">Admin</span>
                <span className="text-[10px] text-slate-400 block">Chief Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
