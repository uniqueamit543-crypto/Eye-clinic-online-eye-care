import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveModal, setActiveView } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Academic Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Eye className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight font-heading">
                  Eye<span className="text-teal-400">Clinic</span>
                </span>
                <span className="text-[10px] text-teal-400 block -mt-1">Noida Sector 29</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Online eye care and appointment management platform. Providing shift-wise doctor consultations,
              digital optical prescriptions, and tailored prescription eyewear with UPI and Razorpay payments.
            </p>
          </div>

          {/* Col 2: Clinical Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Eye Care Services</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('appointments')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Comprehensive Eye Exam
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('appointments')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Vision Refraction (Spectacles)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('appointments')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Glaucoma Screening (Tonometry)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('appointments')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Pediatric Optometry (Kids)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('appointments')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Contact Lens Fitting
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Optical Store */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Optical Store</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('catalogue')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Men's Optical Frames
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('catalogue')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Women's Designer Eyewear
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('catalogue')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Junior FlexiShield (Kids)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('ai-frame-finder')}
                  className="hover:text-teal-300 transition cursor-pointer text-teal-400"
                >
                  ✨ AI Frame Face Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('patient-portal')}
                  className="hover:text-teal-300 transition cursor-pointer"
                >
                  Order With Doctor Rx
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Clinic Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Clinic Location</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Noida sector 29</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="tel:9540295833" className="hover:text-teal-300 transition">
                  9540295833
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="mailto:uniqueamit543@gmail.com" className="hover:text-teal-300 transition">
                  uniqueamit543@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 EyeClinic. Noida sector 29 • Contact: 9540295833 • uniqueamit543@gmail.com</p>
          <div className="flex items-center gap-4">
            <span>Specialist Consultation & Optical Lab</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
