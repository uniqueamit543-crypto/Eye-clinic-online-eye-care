import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Lock,
  LogIn,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { ShiftType } from '../../types';

export const AppointmentSection: React.FC = () => {
  const {
    doctors,
    slots,
    appointments,
    bookAppointment,
    currentUser,
    isAuthenticated,
    signInWithGoogle,
    setActiveModal,
    setActiveView,
    signOutUser
  } = useApp();

  // Patient inputs
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientAge, setPatientAge] = useState<number>(currentUser?.patientAge || 26);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.patientGender || 'Male');
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  // Sync with logged in user
  React.useEffect(() => {
    if (currentUser && isAuthenticated) {
      if (currentUser.name) setPatientName(currentUser.name);
      if (currentUser.phone) setPatientPhone(currentUser.phone);
      if (currentUser.email) setPatientEmail(currentUser.email);
      if (currentUser.patientAge) setPatientAge(currentUser.patientAge);
      if (currentUser.patientGender) setPatientGender(currentUser.patientGender);
    }
  }, [currentUser, isAuthenticated]);

  // Date selection
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
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      setActiveModal('user-auth');
      return;
    }

    const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

    const result = bookAppointment({
      userId: currentUser.id,
      patientId: currentUser.id || 'patient-user',
      patientName: patientName || currentUser.name,
      patientPhone: patientPhone || currentUser.phone || '',
      patientEmail: patientEmail || currentUser.email || '',
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
      setBookingSuccess(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold uppercase tracking-wider mb-3">
          <CalendarIcon className="w-3.5 h-3.5" />
          Shift-Wise Slot Availability Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Book Your Clinical Eye Examination
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Select consultation date and shift (Morning, Afternoon, or Evening). Real-time slot availability counts
          prevent clashes and guarantee zero waiting time at the clinic.
        </p>
      </div>

      {bookingSuccess ? (
        <div className="bg-white rounded-3xl border border-teal-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xl space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Appointment Confirmed!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your appointment for <strong>{serviceType}</strong> on <strong>{selectedDate}</strong> at{' '}
            <strong>{selectedSlotTime} ({selectedShift} Shift)</strong> has been booked in our clinical records.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
            <button
              onClick={() => setActiveView('patient-portal')}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Go to Patient Portal & Track
            </button>
            <button
              onClick={() => setBookingSuccess(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
            >
              Book Another Patient
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Patient Authentication Status & Prompt */}
              <div className="mb-4">
                {isAuthenticated ? (
                  <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-xs font-bold text-teal-900">Signed In as {currentUser?.name}</span>
                        </div>
                        <p className="text-[11px] text-teal-700/90">{currentUser?.email} • Synced to Cloud Medical Records</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOutUser()}
                      className="text-xs font-semibold text-teal-800 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Switch Account</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-400/30">
                          <Lock className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-teal-200 uppercase tracking-wider">Patient Authentication Required</h4>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Please sign in or create an account before booking so your consultation slot and optical history are securely saved.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          await signInWithGoogle();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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

                      <button
                        type="button"
                        onClick={() => setActiveModal('user-auth')}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In / Create Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Demographics */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-600" />
                  1. Patient Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={e => setPatientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={e => setPatientAge(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Service Type</label>
                    <select
                      value={serviceType}
                      onChange={e => setServiceType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
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
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-teal-600" />
                  2. Select Date & Clinic Shift
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      required
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Select Doctor</label>
                    <select
                      value={selectedDoctorId}
                      onChange={e => setSelectedDoctorId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.specialty} ({d.shift} Shift)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shift Selector */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedShift('Morning')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      selectedShift === 'Morning'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sun className={`w-5 h-5 ${selectedShift === 'Morning' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Morning</span>
                      <span className="text-[10px] text-slate-500">09:00 AM - 12:00 PM</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedShift('Afternoon')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      selectedShift === 'Afternoon'
                        ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sunset className={`w-5 h-5 ${selectedShift === 'Afternoon' ? 'text-sky-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Afternoon</span>
                      <span className="text-[10px] text-slate-500">01:00 PM - 04:00 PM</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedShift('Evening')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      selectedShift === 'Evening'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Moon className={`w-5 h-5 ${selectedShift === 'Evening' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Evening</span>
                      <span className="text-[10px] text-slate-500">05:00 PM - 08:00 PM</span>
                    </div>
                  </button>
                </div>

                {/* Slots Grid */}
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
                          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                            isFull
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/40'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
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

              {/* Symptoms / Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Symptoms or Previous Prescription Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Headache after long screen sessions, blurred distant street signs..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  isAuthenticated
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25'
                    : 'bg-gradient-to-r from-teal-700 to-slate-800 hover:from-teal-600 hover:to-slate-700 shadow-slate-800/20'
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Consultation Booking (Save to My Profile)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-teal-300" />
                    <span>Sign In & Confirm Consultation Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Doctor Preview & Live Shift Info */}
          <div className="lg:col-span-4 space-y-5">
            {/* Selected Doctor Card */}
            {(() => {
              const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
              return (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                    Selected Specialist
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg font-heading">{doc.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.degree}</p>
                    <span className="text-xs text-teal-700 font-semibold mt-1 block">
                      {doc.specialty} • ★ {doc.rating} ({doc.experienceYears}+ Yrs Exp)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {doc.bio}
                  </p>
                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span>📍 {doc.room}</span>
                  </div>
                </div>
              );
            })()}

            {/* Clinic Shift Schedules */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
              <h4 className="font-bold font-heading text-sm text-teal-300">OPD Shift Hours & Guidelines</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-semibold text-amber-300">Morning Shift</span>
                  <span>09:00 AM – 12:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-semibold text-sky-300">Afternoon Shift</span>
                  <span>01:00 PM – 04:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-indigo-300">Evening Shift</span>
                  <span>05:00 PM – 08:00 PM</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                Please arrive 10 minutes prior to your allocated slot for auto-refractometer pupil alignment test.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
