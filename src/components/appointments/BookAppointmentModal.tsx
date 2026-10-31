import React, { useState } from 'react';
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
  Sparkles
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
    currentUser
  } = useApp();

  // Form inputs
  const [patientName, setPatientName] = useState(currentUser.name || 'Aditya Sharma');
  const [patientPhone, setPatientPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [patientEmail, setPatientEmail] = useState(currentUser.email || 'aditya.sharma@niu.edu.in');
  const [patientAge, setPatientAge] = useState<number>(23);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  
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

  if (activeModal !== 'book-appointment') return null;

  // Filter slots for the selected shift and calculate live availability for the selected date
  const filteredSlots = slots.filter(s => s.shift === selectedShift);

  const getSlotAvailability = (time: string, shift: ShiftType) => {
    // Count existing active appointments on that date & slot
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
    const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

    const result = bookAppointment({
      patientId: currentUser.id || 'patient-demo',
      patientName,
      patientPhone,
      patientEmail,
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
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
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
              Slot-Based Scheduling
            </span>
            <span className="text-teal-200 text-xs">• Real-Time Clashes Prevention</span>
          </div>

          <h3 className="text-2xl font-bold font-heading">Book Clinical Eye Consultation</h3>
          <p className="text-xs text-teal-100 mt-1">
            Choose your preferred date, shift (Morning, Afternoon, Evening), and dedicated specialist.
          </p>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
          {/* Patient Details Row */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              1. Patient Demographics
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Email (for digital Rx)</label>
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
      </div>
    </div>
  );
};
