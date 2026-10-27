import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Truck, 
  CalendarPlus, 
  Calendar, 
  AlertOctagon, 
  FileText, 
  Bell, 
  LogOut, 
  User, 
  Menu, 
  X,
  Activity,
  ShieldCheck
} from 'lucide-react';

export const PatientLayout: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Hospital Availability', path: '/patient/hospitals', icon: Building2 },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus },
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Ambulance & Tracking', path: '/patient/ambulance', icon: Truck },
    { label: 'Emergency SOS', path: '/patient/emergency-sos', icon: AlertOctagon, highlight: true },
    { label: 'Medical Records', path: '/patient/records', icon: FileText },
    { label: 'Notifications', path: '/patient/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/patient/dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-950 text-lg tracking-tight">MediCore</div>
              <div className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest">Patient Portal</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {userProfile?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{userProfile?.name || 'Patient'}</div>
                <div className="text-[10px] text-slate-500 font-mono">ID: {userProfile?.patientId || 'P-1001'}</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-2`}>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2 tracking-wider">Patient Navigation</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : item.highlight
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Emergency SOS Quick Banner */}
          <div className="bg-gradient-to-br from-rose-600 to-red-700 p-5 rounded-3xl text-white shadow-lg space-y-3">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-6 h-6 animate-pulse text-white" />
              <div className="font-extrabold text-sm">Medical Emergency?</div>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              Trigger instant SOS to dispatch an ambulance and notify hospital emergency staff immediately.
            </p>
            <button
              onClick={() => navigate('/patient/emergency-sos')}
              className="w-full py-2.5 bg-white text-rose-700 font-extrabold text-xs rounded-xl shadow hover:bg-rose-50 transition-all text-center"
            >
              Trigger Emergency SOS
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="lg:col-span-3 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
