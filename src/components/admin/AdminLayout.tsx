import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, BedDouble, Sliders, Cpu, BarChart3, LogOut, Database, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { seedDemoDataIfEmpty } from '../../utils/seedData';
import { Logo } from '../Logo';

export const AdminLayout: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSeed = async () => {
    await seedDemoDataIfEmpty();
    alert('Demo data successfully seeded into Firestore!');
    window.location.reload();
  };

  const overviewItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const managementItems = [
    { to: '/admin/patients', label: 'Patients', icon: Users },
    { to: '/admin/doctors', label: 'Doctors', icon: UserCheck },
    { to: '/admin/resources', label: 'Resources', icon: BedDouble },
  ];

  const intelligenceItems = [
    { to: '/admin/resource-allocation', label: 'Resource Allocation', icon: Sliders },
    { to: '/admin/parallel-processing', label: 'Parallel Processing', icon: Cpu },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
          <Logo className="w-10 h-10" />
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block leading-none font-sans">MediCore</span>
            <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-widest mt-1 block">Hospital Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Overview</div>
            <div className="space-y-1">
              {overviewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Management</div>
            <div className="space-y-1">
              {managementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Intelligence</div>
            <div className="space-y-1">
              {intelligenceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button
            onClick={handleSeed}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-semibold px-4 py-3 rounded-xl text-xs transition-colors border border-slate-800"
          >
            <Database className="w-4 h-4" />
            <span>Seed Demo Data</span>
          </button>

          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                {userProfile?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{userProfile?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{userProfile?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-900 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-950">Hospital Command Center</h1>
            <p className="text-xs text-slate-500 font-medium">MediCore Intelligence Engine Active</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-2 text-xs font-semibold px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>● Online</span>
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
