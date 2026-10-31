import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Eye,
  CheckCircle,
  Plus,
  Trash2,
  Stethoscope,
  Info
} from 'lucide-react';

export const WritePrescriptionModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedAppointmentForRx,
    createPrescription,
    currentUser
  } = useApp();

  const apt = selectedAppointmentForRx;

  // Prescription Form State
  const [odSph, setOdSph] = useState('-1.50');
  const [odCyl, setOdCyl] = useState('-0.50');
  const [odAxis, setOdAxis] = useState('90');
  const [odAdd, setOdAdd] = useState('+0.00');

  const [osSph, setOsSph] = useState('-1.75');
  const [osCyl, setOsCyl] = useState('-0.25');
  const [osAxis, setOsAxis] = useState('85');
  const [osAdd, setOsAdd] = useState('+0.00');

  const [pd, setPd] = useState('63');
  const [recommendedLens, setRecommendedLens] = useState<any>('Blue-Cut Digital Protection');
  const [clinicalAdvice, setClinicalAdvice] = useState(
    'Mild compound myopic astigmatism with digital eye strain. Advised 20-20-20 break intervals and anti-reflective eyewear for all computer and reading work.'
  );

  const [medications, setMedications] = useState([
    { name: 'TearGel Eye Drops (Lubricant)', dosage: '1 drop', frequency: 'Twice daily', duration: '30 days' }
  ]);

  if (activeModal !== 'write-prescription' || !apt) return null;

  const handleAddMedication = () => {
    setMedications(prev => [
      ...prev,
      { name: '', dosage: '1 drop', frequency: 'Twice daily', duration: '15 days' }
    ]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const handleMedChange = (index: number, field: string, value: string) => {
    setMedications(prev =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const validUntil = expiry.toISOString().split('T')[0];

    createPrescription({
      appointmentId: apt.id,
      patientId: apt.patientId,
      patientName: apt.patientName,
      doctorId: currentUser.id || 'doc-1',
      doctorName: currentUser.name || 'Dr. Shalini Sengupta',
      doctorDegree: 'MBBS, MS (Ophthalmology), FICO',
      date: today,
      validUntil,
      od: {
        sph: odSph,
        cyl: odCyl,
        axis: odAxis,
        add: odAdd
      },
      os: {
        sph: osSph,
        cyl: osCyl,
        axis: osAxis,
        add: osAdd
      },
      pd: pd,
      recommendedLens,
      clinicalAdvice,
      medications: medications.filter(m => m.name.trim() !== '')
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Digital Prescription Console
            </span>
            <span className="text-sky-200 text-xs">Appt #{apt.id}</span>
          </div>

          <h3 className="text-xl font-bold font-heading">Issue Official Optical Prescription</h3>
          <p className="text-xs text-sky-100 mt-1">
            Patient: <span className="font-semibold text-white">{apt.patientName}</span> ({apt.patientAge}y, {apt.patientGender}) • Service: {apt.serviceType}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Refraction Values Matrix (OD / OS) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-600" />
                Refractive Power Matrix (Diopter D)
              </h4>
              <span className="text-[11px] text-slate-500">Values automatically link to patient eyewear cart</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-xs text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Eye</th>
                    <th className="py-2.5 px-3">Sphere (SPH)</th>
                    <th className="py-2.5 px-3">Cylinder (CYL)</th>
                    <th className="py-2.5 px-3">Axis (deg)</th>
                    <th className="py-2.5 px-3">Addition (ADD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* OD - Right Eye */}
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50/50">
                      OD <span className="text-xs font-normal text-slate-500">(Right Eye)</span>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={odSph}
                        onChange={e => setOdSph(e.target.value)}
                        placeholder="-1.50"
                        className="w-24 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={odCyl}
                        onChange={e => setOdCyl(e.target.value)}
                        placeholder="-0.50"
                        className="w-24 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={odAxis}
                        onChange={e => setOdAxis(e.target.value)}
                        placeholder="90"
                        className="w-20 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={odAdd}
                        onChange={e => setOdAdd(e.target.value)}
                        placeholder="+0.00"
                        className="w-20 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                  </tr>

                  {/* OS - Left Eye */}
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50/50">
                      OS <span className="text-xs font-normal text-slate-500">(Left Eye)</span>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={osSph}
                        onChange={e => setOsSph(e.target.value)}
                        placeholder="-1.75"
                        className="w-24 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={osCyl}
                        onChange={e => setOsCyl(e.target.value)}
                        placeholder="-0.25"
                        className="w-24 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={osAxis}
                        onChange={e => setOsAxis(e.target.value)}
                        placeholder="85"
                        className="w-20 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={osAdd}
                        onChange={e => setOsAdd(e.target.value)}
                        placeholder="+0.00"
                        className="w-20 px-2 py-1 text-sm rounded-lg border border-slate-300 focus:border-sky-500 outline-hidden font-mono text-center"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pupillary Distance and Lens Recommendation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pupillary Distance (PD mm)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pd}
                  onChange={e => setPd(e.target.value)}
                  placeholder="63"
                  className="w-28 px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-hidden font-mono"
                />
                <span className="text-xs text-slate-500">millimeters (Adult standard: 58-68mm)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recommended Optical Lens Design
              </label>
              <select
                value={recommendedLens}
                onChange={e => setRecommendedLens(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-hidden bg-white"
              >
                <option value="Single Vision">Single Vision (Distance or Reading)</option>
                <option value="Blue-Cut Digital Protection">Blue-Cut Digital Protection (Screen Defense)</option>
                <option value="Bifocal">Bifocal (Kryptok / D-Segment)</option>
                <option value="Progressive">Progressive (No-line Multifocal)</option>
                <option value="High Index 1.67">High Index 1.67 Ultra-Thin Aspheric</option>
              </select>
            </div>
          </div>

          {/* Clinical Advice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Advice & Diagnostic Summary
            </label>
            <textarea
              rows={2}
              value={clinicalAdvice}
              onChange={e => setClinicalAdvice(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-hidden"
            />
          </div>

          {/* Medications / Eye Drops Section */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Prescribed Drops & Eye Medications (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddMedication}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medication
              </button>
            </div>

            <div className="space-y-2">
              {medications.map((med, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Medication name (e.g. Refresh Tears 0.5%)"
                    value={med.name}
                    onChange={e => handleMedChange(idx, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (1 drop)"
                    value={med.dosage}
                    onChange={e => handleMedChange(idx, 'dosage', e.target.value)}
                    className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (Twice daily)"
                    value={med.frequency}
                    onChange={e => handleMedChange(idx, 'frequency', e.target.value)}
                    className="w-28 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Duration (30 days)"
                    value={med.duration}
                    onChange={e => handleMedChange(idx, 'duration', e.target.value)}
                    className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Issue & Link Prescription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
