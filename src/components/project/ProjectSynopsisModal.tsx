import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  GraduationCap,
  Users,
  Award,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  BookOpen
} from 'lucide-react';

export const ProjectSynopsisModal: React.FC = () => {
  const { activeModal, setActiveModal } = useApp();

  if (activeModal !== 'synopsis-info') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Capstone Synopsis</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            “EYECLINIC: ONLINE EYE CARE AND APPOINTMENT MANAGEMENT SYSTEM”
          </h2>
          <p className="text-xs text-teal-200 mt-2">
            Bachelor of Technology (Computer Science & Engineering) • Dec 2026
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto text-slate-700 text-xs sm:text-sm">
          {/* Institutional and Supervision Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block mb-1">
                Academic Institution
              </span>
              <h4 className="font-bold text-slate-900 text-sm">NOIDA INTERNATIONAL UNIVERSITY</h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Department of Computer Science & Engineering<br />
                School of Engineering and Technology (SET)<br />
                Greater Noida, Uttar Pradesh
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block mb-1">
                Project Coordinator & Supervisor
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Sonam Bhati</h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Project Coordinator, CSE<br />
                School of Engineering and Technology, NIU
              </p>
            </div>
          </div>

          {/* Student Team */}
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Project Development Team</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Aditya Yadav', reg: 'NIU-23-5271' },
                { name: 'Aditya Tiwari', reg: 'NIU-23-14046' },
                { name: 'Keshav Sharma', reg: 'NIU-23-18857' },
                { name: 'Amit Tiwari', reg: 'NIUINT-23-3803' }
              ].map(student => (
                <div key={student.reg} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-900 block text-xs">{student.name}</span>
                  <span className="text-[10px] text-teal-700 font-mono block mt-0.5">Reg: {student.reg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Three-Tier System Architecture */}
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Three-Tier System Architecture</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200">
                <span className="text-[10px] font-bold uppercase text-teal-800 block">Tier 1: Presentation</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">Client Interface</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Responsive HTML5, CSS3, JavaScript, React components, Tailwind styling, WCAG 2.1 accessibility.
                </p>
              </div>

              <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200">
                <span className="text-[10px] font-bold uppercase text-sky-800 block">Tier 2: Application</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">Business Logic Layer</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Node.js REST-style APIs, OTP generation (RFC 4226), bcrypt password hashing, slot clash prevention rules.
                </p>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200">
                <span className="text-[10px] font-bold uppercase text-indigo-800 block">Tier 3: Data</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">Relational Database</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  MySQL 8.0+ relational tables for users, slots, appointments, products, orders, prescriptions & reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Research Gaps & Novelty */}
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading mb-2">
              Research Gaps Addressed & Platform Novelty
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Unified Clinical & Eyewear Retail Pipeline:</strong> Eliminates fragmented records by linking doctor digital prescriptions directly to cart and glazing operations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Shift-Wise Slot Availability:</strong> Categorized into Morning, Afternoon, and Evening slots with live capacity counters preventing double-booking.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Robust Multi-Role Security:</strong> Enforced access boundaries for Admin, Doctor, and Patient with 2FA OTP verification simulation (RFC 4226).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Indian Payment Ecosystem Support:</strong> Instant dynamic UPI QR Code, Razorpay gateway, and Cash on Delivery (COD).
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Synopsis Overview
          </button>
        </div>
      </div>
    </div>
  );
};
