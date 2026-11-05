import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { ShiftType } from '../../types';

export const BookAppointmentModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    doctors,
    slots,
    appointments,
    bookAppointment,
    currentUser,
    isAuthenticated,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOutUser
  } = useApp();

  // Auth step state if user is not authenticated
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sign up/in fields
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Booking Form inputs
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientAge, setPatientAge] = useState<number>(currentUser?.patientAge || 26);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.patientGender || 'Male');

  // Date selection: default tomorrow
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedShift, setSelectedShift] = useState<ShiftType>('Morning');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('09:45 AM');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc-1');
  const [serviceType, setServiceType] = useState<any>('Comprehensive Eye Exam');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      if (currentUser.name) setPatientName(currentUser.name);
      if (currentUser.phone) setPatientPhone(currentUser.phone);
      if (currentUser.email) setPatientEmail(currentUser.email);
      if (currentUser.patientAge) setPatientAge(currentUser.patientAge);
      if (currentUser.patientGender) setPatientGender(currentUser.patientGender);
    }
  }, [currentUser, isAuthenticated]);

  if (activeModal !== 'book-appointment') return null;

  // Filter slots for the selected shift and calculate live availability for the selected date
  const filteredSlots = slots.filter(s => s.shift === selectedShift);

  const getSlotAvailability = (time: string, shift: ShiftType) => {
    const bookedOnDate = appointments.filter(
      a => a.date === selectedDate && a.timeSlot === time && a.status !== 'cancelled'
    ).length;
    const slotDef = slots.find(s => s.time === time && s.shift === shift);
    const maxCapacity = slotDef ? slotDef.maxCapacity : 4;
    const remaining = Math.max(0, maxCapacity - bookedOnDate);
    const isFull = remaining <= 0;
    return { remaining, maxCapacity, isFull };
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setAuthError(res.message);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (!authName.trim() || !authPhone.trim() || !authEmail.trim()) {
          setAuthError('Please fill in your name, email, and phone number.');
          setAuthLoading(false);
          return;
        }
        const res = await signUpWithEmail({
          name: authName,
          email: authEmail,
          phone: authPhone,
          password: authPassword
        });
        if (!res.success) {
          setAuthError(res.message);
        }
      } else {
        if (!authEmail.trim()) {
          setAuthError('Please enter your email.');
          setAuthLoading(false);
          return;
        }
        const res = await signInWithEmail(authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.message);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

    const result = bookAppointment({
      userId: currentUser?.id,
      patientId: currentUser?.id || 'patient-demo',
      patientName: patientName || currentUser?.name || 'Patient',
      patientPhone: patientPhone || currentUser?.phone || '',
      patientEmail: patientEmail || currentUser?.email || '',
      patientAge,
      patientGender,
      date: selectedDate,
      timeSlot: selectedSlotTime,
      shift: selectedShift,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      serviceType,
      notes
    });

    if (result.success) {
      setActiveModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-800 p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-300" />
              Verified Patient Booking
            </span>
            <span className="text-teal-200 text-xs">• Real-Time Firestore Sync</span>
          </div>

          <h3 className="text-2xl font-bold font-heading">Book Clinical Eye Consultation</h3>
          <p className="text-xs text-teal-100 mt-1">
            {!isAuthenticated
              ? 'Please sign in or create your account to securely reserve slots and save your records.'
              : `Logged in as ${currentUser.name}. Select your preferred date, shift, and specialist.`}
          </p>
        </div>

        {/* STEP 1: If not authenticated, require Sign In / Sign Up */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Sign in required before appointment booking</strong>
                <span>
                  To ensure appointments and digital prescriptions are stored in your profile and synced to our Firestore database, please sign in or register below.
                </span>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {authError}
              </div>
            )}

            {/* 1-Click Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold shadow-xs flex items-center justify-center gap-3 transition cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>{authLoading ? 'Signing in with Google...' : 'Continue with Google Account'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Mode switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Create New Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  authMode === 'signin' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Sign In Existing User
              </button>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      placeholder="e.g. Rohini Sen"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
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
                    required
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={e => setAuthPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password {authMode === 'signin' ? '(Optional)' : '(Minimum 6 characters)'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder={authMode === 'signup' ? 'Choose a password' : 'Enter your password'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {authLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{authMode === 'signup' ? 'Create Account & Proceed to Booking' : 'Sign In & Proceed'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Authenticated Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
            {/* Authenticated user banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                  {(currentUser?.name || 'U').charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-slate-500 text-[11px]">{currentUser?.email} • {currentUser?.phone || 'No phone saved'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={signOutUser}
                className="text-slate-500 hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                title="Sign out or switch account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch User</span>
              </button>
            </div>

            {/* Patient Details Row */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                1. Patient Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    value={patientAge}
                    onChange={e => setPatientAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={e => setPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Clinical Service</label>
                  <select
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-white"
                  >
                    <option value="Comprehensive Eye Exam">Comprehensive Eye Exam (Acuity & Fundus)</option>
                    <option value="Vision Refraction">Vision Refraction & Spectacle Power</option>
                    <option value="Glaucoma Screening">Glaucoma Screening (Tonometry)</option>
                    <option value="Pediatric Optometry">Pediatric Optometry (Kids Vision)</option>
                    <option value="Contact Lens Fitting">Contact Lens Trial & Fitting</option>
                    <option value="Dry Eye Clinic">Dry Eye & Computer Vision Strain</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Shift Selection */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                2. Appointment Date & Shift
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Select Consultation Date</label>
                  <input
                    type="date"
                    min={todayStr}
                    required
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Specialist</label>
                  <select
                    value={selectedDoctorId}
                    onChange={e => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-white"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialty} ({d.shift} Shift)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shift Selector Buttons */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-2">Select Clinic Shift</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedShift('Morning')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      selectedShift === 'Morning'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sun className={`w-5 h-5 ${selectedShift === 'Morning' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Morning</span>
                      <span className="text-[11px] text-slate-500">09:00 AM - 12:00 PM</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedShift('Afternoon')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      selectedShift === 'Afternoon'
                        ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sunset className={`w-5 h-5 ${selectedShift === 'Afternoon' ? 'text-sky-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Afternoon</span>
                      <span className="text-[11px] text-slate-500">01:00 PM - 04:00 PM</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedShift('Evening')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      selectedShift === 'Evening'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Moon className={`w-5 h-5 ${selectedShift === 'Evening' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Evening</span>
                      <span className="text-[11px] text-slate-500">05:00 PM - 08:00 PM</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Time Slot Availability Grid */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Available Time Slots on {selectedDate} ({selectedShift})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {filteredSlots.map(slot => {
                    const { remaining, maxCapacity, isFull } = getSlotAvailability(slot.time, slot.shift);
                    const isSelected = selectedSlotTime === slot.time;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlotTime(slot.time)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer relative ${
                          isFull
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/40'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{slot.time}</span>
                        </div>
                        <div className="text-[10px] mt-1 font-medium">
                          {isFull ? (
                            <span className="text-rose-500 font-semibold">Fully Booked</span>
                          ) : (
                            <span className={isSelected ? 'text-teal-100' : 'text-emerald-600'}>
                              {remaining} of {maxCapacity} open
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notes field */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Symptoms / Chief Complaint (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Blurry distance vision, eye strain after screen usage, existing glasses prescription check"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Reserve Slot</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
