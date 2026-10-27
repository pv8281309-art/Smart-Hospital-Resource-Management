import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';

export const DoctorLayout: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/patients', label: 'My Patients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
          <Logo className="w-10 h-10" />
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block leading-none font-sans">MediCore</span>
            <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-widest mt-1 block">Doctor Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-1 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                {userProfile?.name?.charAt(0) || 'D'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{userProfile?.name || 'Doctor'}</div>
                <div className="text-[10px] text-slate-400 truncate">{userProfile?.email}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium px-4 py-2.5 rounded-xl text-xs transition-colors border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-950">Clinical Portal</h1>
            <p className="text-xs text-slate-500 font-medium">Welcome, {userProfile?.name || 'Doctor'}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-2 text-xs font-semibold px-3.5 py-1.5 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>Doctor Active Shift</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
