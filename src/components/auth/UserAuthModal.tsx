import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface UserAuthModalProps {
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  onSuccess,
  title,
  subtitle
}) => {
  const {
    activeModal,
    setActiveModal,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  if (activeModal !== 'user-auth') return null;

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          setActiveModal(null);
        }
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          setError('Please provide your phone number.');
          setLoading(false);
          return;
        }

        const res = await signUpWithEmail({
          name,
          email,
          password,
          phone,
          age,
          gender
        });

        if (res.success) {
          if (onSuccess) {
            onSuccess();
          } else {
            setActiveModal(null);
          }
        } else {
          setError(res.message);
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.success) {
          if (onSuccess) {
            onSuccess();
          } else {
            setActiveModal(null);
          }
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden relative my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Patient Access & Verification
            </span>
          </div>

          <h3 className="text-xl font-bold font-heading">
            {title || (mode === 'signup' ? 'Create Patient Account' : 'Sign In to EyeClinic')}
          </h3>
          <p className="text-xs text-teal-200/80 mt-1">
            {subtitle || 'Sign in or register before booking your eye consultation to securely store your data and appointments.'}
          </p>

          {/* Mode switch */}
          <div className="flex mt-4 bg-black/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center justify-center gap-3 transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password {mode === 'signin' ? '(Optional)' : '(6+ characters)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a secure password' : 'Enter your password'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 25)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Connecting to Firebase...</span>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Complete Registration & Continue' : 'Sign In & Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Encrypted patient profile & bookings stored in Firestore</span>
          </div>
        </div>
      </div>
    </div>
  );
};
