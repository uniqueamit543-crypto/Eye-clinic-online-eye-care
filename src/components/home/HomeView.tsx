import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ShoppingBag,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Clock,
  Star,
  Camera,
  Layers,
  Heart,
  FileText
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    doctors,
    products,
    slots,
    reviews,
    setActiveModal,
    setActiveView,
    setSelectedProduct,
    wishlist,
    toggleWishlist
  } = useApp();

  const featuredReviews = reviews.filter(r => r.approved);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-950 to-slate-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Specialized Eye Care & Optical Clinic • Noida Sector 29</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white leading-tight">
                Online Eye Care & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-200">
                  Appointment System
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                A unified platform combining clinical slot-based appointments, doctor digital prescriptions, 
                and precision eyewear e-commerce with UPI & Razorpay checkout.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveModal('book-appointment')}
                  className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>Book Eye Examination</span>
                </button>

                <button
                  onClick={() => setActiveView('catalogue')}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-teal-300" />
                  <span>Shop Prescription Eyewear</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-teal-400 font-bold block text-sm">3 Shifts</span>
                  <span className="text-slate-400">Morning, Aft, Eve</span>
                </div>
                <div>
                  <span className="text-teal-400 font-bold block text-sm">1-Click Rx</span>
                  <span className="text-slate-400">Syncs directly to cart</span>
                </div>
                <div>
                  <span className="text-teal-400 font-bold block text-sm">UPI & Cards</span>
                  <span className="text-slate-400">QR, Razorpay & COD</span>
                </div>
                <div>
                  <span className="text-teal-400 font-bold block text-sm">ISO/IEC 25010</span>
                  <span className="text-slate-400">Standard Quality</span>
                </div>
              </div>
            </div>

            {/* Right Card: Live Shift Availability Widget */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-700/80 p-6 shadow-2xl backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-white text-sm font-heading">Today's Clinic Shift Status</h3>
                  </div>
                  <span className="text-[11px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                    Live Counts
                  </span>
                </div>

                {/* Shift 1: Morning */}
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Morning Shift</span>
                      <span className="text-[11px] text-slate-400">09:00 AM - 12:00 PM • Dr. Abishek Raut</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-800/50">
                    3 Slots Open
                  </span>
                </div>

                {/* Shift 2: Afternoon */}
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
                      <Sunset className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Afternoon Shift</span>
                      <span className="text-[11px] text-slate-400">01:00 PM - 04:00 PM • Dr. Yuvraj Tiwari</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950/50 px-2 py-1 rounded-lg border border-sky-800/50">
                    6 Slots Open
                  </span>
                </div>

                {/* Shift 3: Evening */}
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Evening Shift</span>
                      <span className="text-[11px] text-slate-400">05:00 PM - 08:00 PM • Dr. Suman Jha</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/50 px-2 py-1 rounded-lg border border-indigo-800/50">
                    4 Slots Open
                  </span>
                </div>

                <button
                  onClick={() => setActiveView('appointments')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>View All Real-Time Slot Counts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CLINIC SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            Our Core Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Shift-Based Appointments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organized into Morning, Afternoon, and Evening shifts with real-time capacity management, zero duplicate booking, and automated notifications.
            </p>
            <button
              onClick={() => setActiveView('appointments')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Explore Slots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Digital Eye Prescriptions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optometrists enter OD/OS diopter values (Sphere, Cylinder, Axis, Add, PD) that directly sync to the patient account and attach to the cart with 1 click.
            </p>
            <button
              onClick={() => setActiveView('patient-portal')}
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>View Prescriptions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Eyewear Store & UPI Checkout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Titanium and Italian Acetate spectacles for Men, Women & Kids. Complete purchases via dynamic UPI QR code, Razorpay gateway, or Cash on Delivery.
            </p>
            <button
              onClick={() => setActiveView('catalogue')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED EYEWEAR COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Designer Frames</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Top Prescribed Spectacles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered with hypoallergenic silicone pads and anti-reflective blue-cut precision lenses.
            </p>
          </div>

          <button
            onClick={() => setActiveView('catalogue')}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.length}) Models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setActiveModal('product-detail');
                }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-500 transition shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setActiveModal('virtual-tryon');
                    }}
                    className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-teal-300" />
                    <span>Try On</span>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-teal-700 uppercase tracking-wider text-[10px]">
                        {product.brand}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {product.rating}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition line-clamp-1">
                      {product.name}
                    </h4>

                    <span className="text-[11px] text-slate-500 block mt-1">
                      {product.frameShape} • {product.frameMaterial}
                    </span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>

                    <span className="text-xs text-teal-600 font-bold">Customize →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SPECIALIST DOCTORS TEAM (Section 4.3 in Synopsis) */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Clinical Team Profiles
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-2">
              Meet Our Attending Eye Specialists
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Board-certified ophthalmologists and clinical optometrists offering comprehensive vision care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map(doc => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      {doc.shift} Shift
                    </span>
                    <span className="text-xs font-bold text-amber-500">★ {doc.rating}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 font-heading pt-1">{doc.name}</h4>
                  <p className="text-xs text-slate-500">{doc.degree}</p>
                  <p className="text-xs text-teal-800 font-semibold">{doc.specialty}</p>
                  <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 line-clamp-3 leading-relaxed">
                    {doc.bio}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span>📍 {doc.room}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveModal('book-appointment')}
                    className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white font-bold text-xs transition cursor-pointer"
                  >
                    Book with {doc.name.split(' ')[1] || doc.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PATIENT REVIEWS & SUS USABILITY (Sections 2.1 & 4.5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Experiences</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Verified Clinic Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real feedback from patients receiving diagnostic consultations and prescription eyewear.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReviews.slice(0, 3).map(rev => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">{rev.patientName}</h5>
                  <span className="text-[10px] text-slate-400">{rev.patientLocation}</span>
                </div>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {rev.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
