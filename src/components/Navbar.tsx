import React from 'react';
import { Logo } from './Logo';
import { LogIn, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo className="w-11 h-11" />
          <div>
            <span className="text-xl font-extrabold text-slate-950 tracking-tight block leading-none font-sans">
              MediCore
            </span>
            <span className="text-[11px] font-semibold text-cyan-600 uppercase tracking-widest mt-0.5 block">
              Intelligent Hospital System
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-cyan-600 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
          <a href="#architecture" className="hover:text-cyan-600 transition-colors">Architecture</a>
          <a href="#parallel-sim" className="hover:text-cyan-600 transition-colors">Parallel Lab</a>
          <a href="#about" className="hover:text-cyan-600 transition-colors">About</a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>System Operational</span>
          </div>

          <button
            onClick={onOpenLogin}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
