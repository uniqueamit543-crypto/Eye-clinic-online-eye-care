import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  Calendar,
  ShoppingBag,
  Heart,
  UserCheck,
  Stethoscope,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    switchRole,
    currentUser,
    cartTotal,
    wishlist,
    setActiveModal,
    activeView,
    setActiveView
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const roles: { id: Role; label: string; icon: React.ReactNode; badge: string; color: string }[] = [
    {
      id: 'patient',
      label: 'Patient',
      icon: <UserCheck className="w-4 h-4" />,
      badge: 'Aditya (Patient)',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'doctor',
      label: 'Doctor',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: 'Dr. Shalini Sengupta',
      color: 'bg-sky-600 text-white'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'Ops Admin',
      color: 'bg-indigo-600 text-white'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                <Eye className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                    Eye<span className="text-teal-600">Clinic</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none">Online Eye Care & Optical Store</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2 rounded-lg transition cursor-pointer ${
                activeView === 'home'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveView('appointments')}
              className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'appointments'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Book Eye Test
            </button>

            <button
              onClick={() => setActiveView('catalogue')}
              className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'catalogue'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              Eyewear Catalogue
            </button>

            {/* Role Dedicated Views */}
            {currentRole === 'patient' && (
              <button
                onClick={() => setActiveView('patient-portal')}
                className={`px-3 py-2 rounded-lg transition cursor-pointer ${
                  activeView === 'patient-portal'
                    ? 'text-teal-700 bg-teal-50/80 font-semibold'
                    : 'hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                My Eye Health & Orders
              </button>
            )}

            {currentRole === 'doctor' && (
              <button
                onClick={() => setActiveView('doctor-portal')}
                className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'doctor-portal'
                    ? 'text-sky-700 bg-sky-50 font-semibold'
                    : 'text-sky-600 hover:text-sky-700 hover:bg-sky-50/60'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Doctor Console
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveView('admin-panel')}
                className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'admin-panel'
                    ? 'text-indigo-700 bg-indigo-50 font-semibold'
                    : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* Right Actions: Role Switcher Pill + Cart + Book CTA */}
          <div className="flex items-center gap-3">
            {/* Quick Interactive Role Switcher */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">Role:</span>
              {roles.map(r => {
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => switchRole(r.id)}
                    title={`Switch to ${r.label} View`}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      isActive
                        ? `${r.color} shadow-xs font-semibold`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveView('catalogue')}
              title="Saved Eyewear"
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setActiveModal('cart-drawer')}
              className="relative p-2 rounded-xl text-slate-700 hover:text-teal-700 hover:bg-teal-50/80 transition cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {cartTotal.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartTotal.itemCount}
                </span>
              )}
            </button>

            {/* Quick Appointment CTA Button */}
            <button
              onClick={() => setActiveModal('book-appointment')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-medium text-sm shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2">
            {/* Mobile Role Switcher */}
            <div className="bg-slate-100 p-2 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-1">Switch Perspective:</p>
              <div className="grid grid-cols-3 gap-1">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium cursor-pointer ${
                      currentRole === r.id ? `${r.color} font-bold shadow-xs` : 'bg-white text-slate-700'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm font-medium">
              <button
                onClick={() => {
                  setActiveView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveView('appointments');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                Book Eye Test & Slot Matrix
              </button>
              <button
                onClick={() => {
                  setActiveView('catalogue');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-teal-600" />
                Eyewear Catalogue (Men/Women/Kids)
              </button>

              {currentRole === 'patient' && (
                <button
                  onClick={() => {
                    setActiveView('patient-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-teal-50 text-teal-800 font-semibold"
                >
                  My Eye Health & Digital Prescriptions
                </button>
              )}

              {currentRole === 'doctor' && (
                <button
                  onClick={() => {
                    setActiveView('doctor-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-sky-50 text-sky-800 font-semibold"
                >
                  Doctor Consultation Console
                </button>
              )}

              {currentRole === 'admin' && (
                <button
                  onClick={() => {
                    setActiveView('admin-panel');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-indigo-50 text-indigo-800 font-semibold"
                >
                  Admin Operations & Stock Control
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setActiveModal('book-appointment');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-medium text-center shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
