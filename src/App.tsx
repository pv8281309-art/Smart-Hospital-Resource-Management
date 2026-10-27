import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoginModal } from './components/LoginModal';
import { LandingSections } from './components/LandingSections';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

// Admin views
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PatientsManagement } from './components/admin/PatientsManagement';
import { DoctorsManagement } from './components/admin/DoctorsManagement';
import { ResourcesManagement } from './components/admin/ResourcesManagement';
import { ResourceAllocation } from './components/admin/ResourceAllocation';
import { ParallelSimulator } from './components/admin/ParallelSimulator';
import { AnalyticsView } from './components/admin/AnalyticsView';

// Doctor views
import { DoctorLayout } from './components/doctor/DoctorLayout';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorPatients } from './components/doctor/DoctorPatients';

// Patient views
import { PatientLayout } from './components/patient/PatientLayout';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { HospitalAvailabilityView } from './components/patient/HospitalAvailabilityView';
import { AmbulanceView } from './components/patient/AmbulanceView';
import { BookAppointmentView } from './components/patient/BookAppointmentView';
import { MyAppointmentsView } from './components/patient/MyAppointmentsView';
import { EmergencySOSView } from './components/patient/EmergencySOSView';
import { MedicalRecordsView } from './components/patient/MedicalRecordsView';
import { NotificationsView } from './components/patient/NotificationsView';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'admin' | 'doctor' | 'patient' }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-cyan-600 font-semibold animate-pulse">Loading system portal...</div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to="/" replace />;
  }

  if (userProfile.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
      <Hero onOpenLogin={() => setIsLoginOpen(true)} />
      <LandingSections />
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="patients" element={<PatientsManagement />} />
              <Route path="doctors" element={<DoctorsManagement />} />
              <Route path="resources" element={<ResourcesManagement />} />
              <Route path="resource-allocation" element={<ResourceAllocation />} />
              <Route path="parallel-processing" element={<ParallelSimulator />} />
              <Route path="analytics" element={<AnalyticsView />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/doctor/dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="patients" element={<DoctorPatients />} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRole="patient">
                <PatientLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/patient/dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="hospitals" element={<HospitalAvailabilityView />} />
              <Route path="book-appointment" element={<BookAppointmentView />} />
              <Route path="appointments" element={<MyAppointmentsView />} />
              <Route path="ambulance" element={<AmbulanceView />} />
              <Route path="emergency-sos" element={<EmergencySOSView />} />
              <Route path="records" element={<MedicalRecordsView />} />
              <Route path="notifications" element={<NotificationsView />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
