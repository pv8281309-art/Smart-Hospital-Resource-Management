import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <Logo className="w-8 h-8" />
          <span className="text-white font-extrabold text-sm tracking-tight font-sans">
            MediCore • Intelligent Hospital Resource Processing System
          </span>
        </div>
        <div className="text-xs text-slate-500 text-center sm:text-right">
          Computer Architecture & Parallel Processing Academic Project • Powered by React & Firebase
        </div>
      </div>
    </footer>
  );
};
