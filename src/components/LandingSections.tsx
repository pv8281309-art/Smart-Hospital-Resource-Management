import React, { useState } from 'react';
import { ClipboardList, CheckCircle, Cpu, BarChart3, Users, BedDouble, Shield, Activity, ArrowRight, Play, Layers } from 'lucide-react';
import { Logo } from './Logo';

export const LandingSections: React.FC = () => {
  const [patientsCount, setPatientsCount] = useState(80);
  const [coresCount, setCoresCount] = useState(4);
  const [simRunning, setSimRunning] = useState(false);
  const [simResults, setSimResults] = useState<{ seqTime: number; parTime: number; speedup: number; efficiency: number } | null>(null);

  const runMiniSim = () => {
    setSimRunning(true);
    setSimResults(null);
    setTimeout(() => {
      const seq = Number((patientsCount * 0.12).toFixed(2));
      const overhead = coresCount * 0.03;
      const par = Number(Math.max(0.2, (seq / coresCount) + overhead).toFixed(2));
      const speedup = Number((seq / par).toFixed(2));
      const efficiency = Number(((speedup / coresCount) * 100).toFixed(1));
      setSimResults({ seqTime: seq, parTime: par, speedup, efficiency });
      setSimRunning(false);
    }, 700);
  };

  return (
    <div className="bg-white text-slate-900">
      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
              Workflow Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4">How MediCore Works</h2>
            <p className="text-slate-600 mt-3 text-base">A streamlined 4-step pipeline from patient registration to resource allocation and parallel execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 relative group hover:shadow-md transition-all">
              <div className="text-4xl font-black text-cyan-600/15 mb-4">01</div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Patient Registration</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Patients are registered with priority levels (Critical, High, Medium, Low) and department specifications.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 relative group hover:shadow-md transition-all">
              <div className="text-4xl font-black text-blue-600/15 mb-4">02</div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Resource Check</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Real-time inventory inspection of beds, ICU units, specialized doctors, and medical equipment.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 relative group hover:shadow-md transition-all">
              <div className="text-4xl font-black text-teal-600/15 mb-4">03</div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Intelligent Allocation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Priority queue algorithm matches critical patients instantly with available doctors and beds.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 relative group hover:shadow-md transition-all">
              <div className="text-4xl font-black text-indigo-600/15 mb-4">04</div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Processing & Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Multi-core simulation processes workloads concurrently, optimizing speedup and hospital efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4">Designed for Precision Hospital Ops</h2>
            <p className="text-slate-600 mt-3 text-base">Explore the advanced modules built into the MediCore platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Smart Resource Allocation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Automated recommendation engine matching patient requirements with optimal hospital resources and specialist availability.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Patient Priority Queue</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Strict priority-based ordering ensuring critical emergency cases are processed and allocated ahead of standard queue entries.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Doctor Workload Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Dedicated doctor dashboards for managing assigned patients, updating treatment notes, and recording clinical history.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Live Resource Monitoring</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Track beds, ICU units, ventilators, nurses, and ambulances with real-time Firestore persistence.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Parallel Processing Lab</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Computer architecture simulation comparing sequential vs multi-core parallel execution time and efficiency.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Real-Time Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Comprehensive KPI dashboards monitoring hospital load, patient prioritization breakdown, and resource utilization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Technical Design
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">System Architecture</h2>
            <p className="text-slate-400 mt-3 text-base">Full-stack architecture integrating React, Firebase Authentication, Firestore, and parallel processing algorithms.</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h4 className="font-bold text-white mb-2">Frontend Presentation</h4>
              <p className="text-xs text-slate-400">React 19, TypeScript, Tailwind CSS, responsive dashboards, and interactive UI components.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h4 className="font-bold text-white mb-2">Firebase Backend</h4>
              <p className="text-xs text-slate-400">Firebase Authentication & Firestore NoSQL real-time document database with ABAC rules.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h4 className="font-bold text-white mb-2">Parallel Processing</h4>
              <p className="text-xs text-slate-400">Concurrent multi-core task scheduling algorithm simulating speedup and computational efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parallel Processing Preview Section */}
      <section id="parallel-sim" className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                Parallel Processing Lab
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-4 mb-4">
                Computer Architecture & Speedup Analysis
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                In hospital resource processing, large volumes of incoming patient allocation tasks can bottleneck sequential processors. This simulator demonstrates how multi-core parallel execution reduces total completion time.
              </p>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-cyan-600" />
                  <span>Calculates Amdahl's Law speedup metrics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-cyan-600" />
                  <span>Compares sequential single-core vs multi-core task distribution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-cyan-600" />
                  <span>Evaluates efficiency percentage per processing core</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-950 mb-6 flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-600" />
                <span>Interactive Preview Simulator</span>
              </h3>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Number of Patients / Tasks: {patientsCount}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="20"
                    value={patientsCount}
                    onChange={(e) => setPatientsCount(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Processing Cores: {coresCount}
                  </label>
                  <select
                    value={coresCount}
                    onChange={(e) => setCoresCount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-950"
                  >
                    <option value={2}>2 Cores</option>
                    <option value={4}>4 Cores</option>
                    <option value={8}>8 Cores</option>
                    <option value={16}>16 Cores</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runMiniSim}
                disabled={simRunning}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {simRunning ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{simRunning ? 'Running Simulation...' : 'Run Simulation'}</span>
              </button>

              {simResults && (
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-center animate-fade-in">
                  <div>
                    <div className="text-xs text-slate-500">Sequential Time</div>
                    <div className="text-lg font-bold text-slate-950">{simResults.seqTime}s</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Parallel Time ({coresCount} Cores)</div>
                    <div className="text-lg font-bold text-cyan-600">{simResults.parTime}s</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Speedup</div>
                    <div className="text-lg font-bold text-teal-600">{simResults.speedup}x</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Efficiency</div>
                    <div className="text-lg font-bold text-blue-600">{simResults.efficiency}%</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
            About MediCore
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 mb-6">
            College Academic Project
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-6">
            MediCore is a college project demonstrating how hospital resources can be monitored and allocated efficiently using software algorithms, database systems, and parallel processing concepts.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 font-medium">
            <span>• Resource Management</span>
            <span>• Priority Processing</span>
            <span>• Role-Based Access</span>
            <span>• Parallel Simulation</span>
          </div>
        </div>
      </section>
    </div>
  );
};
