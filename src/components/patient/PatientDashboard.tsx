import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  FileText,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  ArrowRight,
  Star,
  Download,
  Stethoscope,
  Sparkles,
  MapPin,
  KeyRound,
  Lock,
  UserCheck
} from 'lucide-react';
import { Prescription } from '../../types';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    prescriptions,
    orders,
    setActiveModal,
    setActiveView,
    addReview,
    resetPassword,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions' | 'orders'>('prescriptions');
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<Prescription | null>(null);

  // Password reset modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Leave review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewService, setReviewService] = useState('Comprehensive Eye Exam');
  const [reviewComment, setReviewComment] = useState('');

  // Filter patient's appointments and orders
  const myAppointments = appointments.filter(
    a => a.patientEmail === currentUser.email || a.patientId === currentUser.id
  );
  const myOrders = orders.filter(
    o => o.customerEmail === currentUser.email || o.patientId === currentUser.id
  );

  const handlePrintRx = (rx: Prescription) => {
    setSelectedRxForPrint(rx);
  };

  const handleUseRxForShopping = (rx: Prescription) => {
    showToast(
      'success',
      'Prescription Selected',
      `Browsing eyewear catalogue with active Rx ${rx.id} (${rx.recommendedLens}).`
    );
    setActiveView('catalogue');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment) return;
    addReview({
      patientName: currentUser.name,
      patientLocation: 'Greater Noida',
      rating: reviewRating,
      comment: reviewComment,
      service: reviewService
    });
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Profile Header Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/30 border-2 border-teal-300 flex items-center justify-center text-2xl font-bold font-mono text-teal-100">
              {(currentUser?.name || 'User').charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-semibold">
                  Registered Patient
                </span>
                <span className="text-teal-200 text-xs font-mono bg-teal-950/50 px-2 py-0.5 rounded border border-teal-800">
                  Login ID: <strong className="text-white">@{currentUser?.loginId || 'patient_aditya'}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">{currentUser?.name || 'Patient'}</h1>
              <p className="text-xs text-teal-200">{currentUser?.email || ''} • {currentUser?.phone || ''}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setNewPasswordVal(currentUser?.password || '');
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white font-medium text-xs border border-teal-400/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            <button
              onClick={() => setActiveModal('book-appointment')}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Eye Exam</span>
            </button>

            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Star className="w-4 h-4 text-amber-300" />
              <span>Leave Feedback</span>
            </button>
          </div>
        </div>

        {/* Password change modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPasswordVal.trim()) return;
                resetPassword(currentUser.id, newPasswordVal.trim());
                setShowPasswordModal(false);
              }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-900 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-teal-600" />
                  <span>Update Account Password</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-900">
                <span>Account Login ID: </span>
                <strong className="font-mono">@{currentUser?.loginId || 'patient_aditya'}</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-teal-800/80">
          <div className="text-center sm:text-left">
            <span className="text-xs text-teal-300">Active Prescriptions</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white block mt-0.5">
              {prescriptions.length}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs text-teal-300">Appointments</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white block mt-0.5">
              {myAppointments.length}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs text-teal-300">Optical Orders</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white block mt-0.5">
              {myOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Review submission popup */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base font-heading">Rate Your Eye Clinic Experience</h3>
              <button type="button" onClick={() => setShowReviewForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Received</label>
              <select
                value={reviewService}
                onChange={e => setReviewService(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              >
                <option value="Comprehensive Eye Exam">Comprehensive Eye Exam</option>
                <option value="Vision Refraction & Glasses">Vision Refraction & Glasses</option>
                <option value="Glaucoma Screening">Glaucoma Screening</option>
                <option value="Contact Lens Fitting">Contact Lens Fitting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-2xl text-amber-400 cursor-pointer"
                  >
                    {star <= reviewRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review</label>
              <textarea
                rows={3}
                required
                placeholder="How was your consultation with the optometrist?"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-xs text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'prescriptions' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-600" />
          <span>My Digital Eye Prescriptions ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'appointments' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>My Appointments ({myAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'orders' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-teal-600" />
          <span>My Optical Orders ({myOrders.length})</span>
        </button>
      </div>

      {/* Content: TAB 1 Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.map(rx => (
              <div
                key={rx.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition relative flex flex-col justify-between"
              >
                <div>
                  {/* Prescription Top Banner */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                          {rx.id}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                          Valid Clinical Rx
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{rx.doctorName}</h3>
                      <p className="text-xs text-slate-500">{rx.doctorDegree}</p>
                    </div>

                    <button
                      onClick={() => handlePrintRx(rx)}
                      className="p-2 text-slate-500 hover:text-teal-700 rounded-xl hover:bg-slate-50 border border-slate-200 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                      title="Print Official Medical Rx"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                  </div>

                  {/* Refraction Matrix */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs mb-4">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Refraction Power Measurements
                    </span>
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-teal-800 block text-xs">OD (Right Eye)</span>
                        <p className="text-slate-600 mt-1">SPH: <strong>{rx.od.sph}</strong></p>
                        <p className="text-slate-600">CYL: <strong>{rx.od.cyl}</strong></p>
                        <p className="text-slate-600">AXIS: <strong>{rx.od.axis}°</strong></p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-teal-800 block text-xs">OS (Left Eye)</span>
                        <p className="text-slate-600 mt-1">SPH: <strong>{rx.os.sph}</strong></p>
                        <p className="text-slate-600">CYL: <strong>{rx.os.cyl}</strong></p>
                        <p className="text-slate-600">AXIS: <strong>{rx.os.axis}°</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200">
                      <span><strong>Pupillary Distance (PD):</strong> {rx.pd} mm</span>
                      <span className="font-semibold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded">
                        {rx.recommendedLens}
                      </span>
                    </div>
                  </div>

                  {/* Clinical Advice */}
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                    💡 <strong>Optometrist's Advice:</strong> "{rx.clinicalAdvice}"
                  </p>
                </div>

                {/* Direct Link to Eyewear Cart CTA (As described in synopsis section 1.1) */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Valid until {rx.validUntil}</span>
                  <button
                    onClick={() => handleUseRxForShopping(rx)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Order Glasses With This Rx</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content: TAB 2 Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {myAppointments.map(apt => (
            <div key={apt.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{apt.serviceType}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                      apt.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : apt.status === 'confirmed'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    ● {apt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Doctor: <strong>{apt.doctorName}</strong> ({apt.doctorSpecialty})
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>📅 {apt.date}</span>
                  <span>•</span>
                  <span>⏰ {apt.timeSlot} ({apt.shift} Shift)</span>
                  <span>•</span>
                  <span>Ref: {apt.id}</span>
                </div>
              </div>

              {apt.prescriptionId && (
                <button
                  onClick={() => setActiveTab('prescriptions')}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>View Attached Rx ({apt.prescriptionId})</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content: TAB 3 Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                    {order.orderNumber}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Placed on {order.createdAt} • Delivery in 3-5 days</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{order.total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block uppercase">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  Optical Glazing & Dispatch Timeline
                </span>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {['Confirmed', 'Lens Glazing', 'Quality Check', 'Dispatched', 'Delivered'].map((step, idx) => {
                    const steps = ['Confirmed', 'Lens Glazing', 'Quality Check', 'Dispatched', 'Delivered'];
                    const currentIdx = steps.indexOf(order.orderStatus);
                    const isDone = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div key={step} className="space-y-1">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isDone ? 'bg-teal-600' : 'bg-slate-200'
                          }`}
                        />
                        <span
                          className={`text-[10px] block font-semibold ${
                            isCurrent ? 'text-teal-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs space-y-2">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{it.product.name}</span>
                      <span className="text-slate-500 block text-[11px]">
                        Package: {it.lensType.replace(/-/g, ' ')} {it.prescriptionId ? `(Rx: ${it.prescriptionId})` : ''}
                      </span>
                    </div>
                    <span className="font-mono text-slate-700">x{it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Prescription Modal */}
      {selectedRxForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 border border-slate-200">
            {/* Clinical Header */}
            <div className="border-b-2 border-teal-600 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">EYECLINIC HEALTHCARE</h2>
                <p className="text-xs text-slate-500">Noida sector 29, Uttar Pradesh</p>
                <p className="text-[10px] text-slate-400">Tel: 9540295833 • Email: uniqueamit543@gmail.com</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-teal-700 block">Rx Slip: {selectedRxForPrint.id}</span>
                <span className="text-xs text-slate-500">{selectedRxForPrint.date}</span>
              </div>
            </div>

            {/* Doctor & Patient Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-bold text-slate-900">{selectedRxForPrint.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Attending Consultant:</span>
                <span className="font-bold text-slate-900">{selectedRxForPrint.doctorName}</span>
                <span className="text-[10px] text-slate-500 block">{selectedRxForPrint.doctorDegree}</span>
              </div>
            </div>

            {/* Optical Rx Grid */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-center font-mono">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 text-left">Eye</th>
                    <th className="p-2">Sphere</th>
                    <th className="p-2">Cylinder</th>
                    <th className="p-2">Axis</th>
                    <th className="p-2">Addition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-bold text-left bg-slate-50">OD (Right Eye)</td>
                    <td className="p-2">{selectedRxForPrint.od.sph}</td>
                    <td className="p-2">{selectedRxForPrint.od.cyl}</td>
                    <td className="p-2">{selectedRxForPrint.od.axis}°</td>
                    <td className="p-2">{selectedRxForPrint.od.add || '+0.00'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-left bg-slate-50">OS (Left Eye)</td>
                    <td className="p-2">{selectedRxForPrint.os.sph}</td>
                    <td className="p-2">{selectedRxForPrint.os.cyl}</td>
                    <td className="p-2">{selectedRxForPrint.os.axis}°</td>
                    <td className="p-2">{selectedRxForPrint.os.add || '+0.00'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-xs space-y-1">
              <p><strong>Pupillary Distance (PD):</strong> {selectedRxForPrint.pd} mm</p>
              <p><strong>Recommended Lens:</strong> {selectedRxForPrint.recommendedLens}</p>
              <p><strong>Clinical Advice:</strong> {selectedRxForPrint.clinicalAdvice}</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedRxForPrint(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setSelectedRxForPrint(null);
                }}
                className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
