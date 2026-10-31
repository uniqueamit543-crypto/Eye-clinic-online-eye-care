/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/home/HomeView';
import { AppointmentSection } from './components/appointments/AppointmentSection';
import { ProductCatalog } from './components/shop/ProductCatalog';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';

// Modals
import { BookAppointmentModal } from './components/appointments/BookAppointmentModal';
import { AuthModal } from './components/auth/AuthModal';
import { WritePrescriptionModal } from './components/doctor/WritePrescriptionModal';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { CartDrawer } from './components/shop/CartDrawer';
import { CheckoutModal } from './components/shop/CheckoutModal';
import { VirtualTryOnModal } from './components/future/VirtualTryOnModal';
import { AIFrameRecommendationModal } from './components/future/AIFrameRecommendationModal';
import { ProjectSynopsisModal } from './components/project/ProjectSynopsisModal';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'appointments' && <AppointmentSection />}
        {activeView === 'catalogue' && <ProductCatalog />}
        {activeView === 'patient-portal' && <PatientDashboard />}
        {activeView === 'doctor-portal' && <DoctorDashboard />}
        {activeView === 'admin-panel' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <BookAppointmentModal />
      <AuthModal />
      <WritePrescriptionModal />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <VirtualTryOnModal />
      <AIFrameRecommendationModal />
      <ProjectSynopsisModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
