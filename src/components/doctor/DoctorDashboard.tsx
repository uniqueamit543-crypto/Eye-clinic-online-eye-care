import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  User,
  Activity,
  AlertCircle,
  Eye,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { Appointment, Prescription } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    updateAppointmentStatus,
    prescriptions,
    setActiveModal,
    setSelectedAppointmentForRx,
    doctors
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'prescriptions'>('queue');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Find active doctor details
  const activeDoctor = doctors.find(d => d.id === currentUser.id) || doctors[0];

  // Appointments assigned to this doctor
  const doctorAppointments = appointments.filter(
    apt => apt.doctorId === activeDoctor.id || apt.doctorName.includes(activeDoctor.name) || true // Show all for demo if filter allows
  );

  // Filtered appointments
  const filteredAppointments = doctorAppointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift = filterShift === 'all' || apt.shift === filterShift;
    return matchesSearch && matchesShift;
  });

  const pendingCount = doctorAppointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const completedCount = doctorAppointments.filter(a => a.status === 'completed').length;
  const doctorPrescriptions = prescriptions.filter(p => p.doctorId === activeDoctor.id || true);

  const handleOpenRxModal = (apt: Appointment) => {
    setSelectedAppointmentForRx(apt);
    setActiveModal('write-prescription');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Profile & Header */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-semibold">
                Attending Consultant
              </span>
              <span className="text-sky-300 text-xs">{activeDoctor.room}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading mt-1">{activeDoctor.name}</h1>
            <p className="text-sm text-sky-200">{activeDoctor.degree} • {activeDoctor.specialty}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[90px]">
              <span className="text-xs text-sky-200 block">Queue</span>
              <span className="text-2xl font-bold text-white font-mono">{pendingCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[90px]">
              <span className="text-xs text-sky-200 block">Completed</span>
              <span className="text-2xl font-bold text-emerald-300 font-mono">{completedCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[90px]">
              <span className="text-xs text-sky-200 block">Issued Rx</span>
              <span className="text-2xl font-bold text-amber-300 font-mono">{doctorPrescriptions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-sky-600" />
            <span>Patient Consultation Queue ({filteredAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Issued Prescriptions ({doctorPrescriptions.length})</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patient, service, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden"
            />
          </div>

          <select
            value={filterShift}
            onChange={e => setFilterShift(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-hidden"
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning (09-12)</option>
            <option value="Afternoon">Afternoon (13-16)</option>
            <option value="Evening">Evening (17-20)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'queue' ? (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No Patient Appointments Found</h3>
              <p className="text-xs text-slate-500 mt-1">There are no consultations matching your current filter.</p>
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const isDone = apt.status === 'completed';
              const isPending = apt.status === 'pending';
              const isConfirmed = apt.status === 'confirmed';

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 p-5 shadow-xs transition hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center font-bold font-mono shrink-0">
                      {apt.timeSlot.split(' ')[0]}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{apt.patientName}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {apt.patientAge ? `${apt.patientAge}y` : '24y'}, {apt.patientGender || 'Male'}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isConfirmed
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          ● {apt.status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold">
                          {apt.shift} Shift
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-800">
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          {apt.serviceType}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {apt.date} at {apt.timeSlot}
                        </span>
                        <span>•</span>
                        <span>📞 {apt.patientPhone}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          Patient notes: "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {isPending && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                        className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold transition cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                    )}

                    {!isDone ? (
                      <button
                        onClick={() => handleOpenRxModal(apt)}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Write Digital Prescription</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Prescription Issued ({apt.prescriptionId || 'Rx-Ready'})
                        </span>
                        <button
                          onClick={() => handleOpenRxModal(apt)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          Edit Rx
                        </button>
                      </div>
                    )}

                    {!isDone && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                        className="px-3 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition cursor-pointer"
                        title="Mark complete without prescription"
                      >
                        Done ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Prescriptions Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctorPrescriptions.map(rx => (
            <div key={rx.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <span className="text-[11px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                    {rx.id}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{rx.patientName}</h4>
                  <p className="text-xs text-slate-500">Issued: {rx.date} • Valid to: {rx.validUntil}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {rx.recommendedLens}
                  </span>
                </div>
              </div>

              {/* Diopter values */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs font-mono mb-3">
                <div>
                  <span className="font-bold text-slate-700 block">OD (Right Eye):</span>
                  <span>SPH: {rx.od.sph} | CYL: {rx.od.cyl} | AXIS: {rx.od.axis}°</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">OS (Left Eye):</span>
                  <span>SPH: {rx.os.sph} | CYL: {rx.os.cyl} | AXIS: {rx.os.axis}°</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><strong className="text-slate-800">Pupillary Distance:</strong> {rx.pd} mm</p>
                <p><strong className="text-slate-800">Clinical Advice:</strong> {rx.clinicalAdvice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
