import React from 'react';
import { ShieldCheck, Cpu, Database, ArrowRight, Activity, Users, BedDouble, Stethoscope, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-24 lg:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2000&auto=format&fit=crop"
          alt="Modern Hospital Technology"
          className="w-full h-full object-cover opacity-20 scale-105 transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Cpu className="w-4 h-4" />
              <span>Smart Hospital Resource Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 font-sans">
              Smarter Hospital Operations. <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                Better Resource Decisions.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
              MediCore helps hospitals monitor resources, prioritize patients, and intelligently allocate critical resources using efficient processing techniques.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 mb-14">
              <button
                onClick={onOpenLogin}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 text-base"
              >
                <span>Login to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#how-it-works"
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-xl border border-white/10 backdrop-blur-md transition-all text-base"
              >
                <span>Explore MediCore</span>
              </a>
            </div>

            {/* Check Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-800 text-sm font-medium text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>Intelligent Allocation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>Resource Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>Parallel Processing</span>
              </div>
            </div>
          </div>

          {/* Right Floating Dashboard Preview */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Hospital Status</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  Operational
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Beds Occupancy</div>
                  <div className="text-2xl font-extrabold text-white">78 / 100</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 uppercase font-semibold mb-1">ICU Units</div>
                  <div className="text-2xl font-extrabold text-teal-400">16 / 20</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">Doctors Available</span>
                  </div>
                  <span className="font-bold text-blue-400">18 Shifted</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">Emergency Queue</span>
                  </div>
                  <span className="font-bold text-rose-400">07 Critical</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
