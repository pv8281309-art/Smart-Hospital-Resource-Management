import React, { useState } from 'react';
import { Cpu, Play, Activity, CheckCircle, Layers } from 'lucide-react';

export const ParallelSimulator: React.FC = () => {
  const [patientsCount, setPatientsCount] = useState(100);
  const [coresCount, setCoresCount] = useState(4);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'cores'>('comparison');
  const [result, setResult] = useState<{
    seqTime: number;
    parTime: number;
    speedup: number;
    efficiency: number;
    coreWorkloads: number[][];
  } | null>(null);

  const runSimulation = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      const seq = Number((patientsCount * 0.15).toFixed(2));
      const overhead = coresCount * 0.02;
      const par = Number(Math.max(0.3, (seq / coresCount) + overhead).toFixed(2));
      const speedup = Number((seq / par).toFixed(2));
      const efficiency = Number(((speedup / coresCount) * 100).toFixed(1));

      // Generate task chunks for cores
      const chunkSize = Math.ceil(patientsCount / coresCount);
      const workloads: number[][] = [];
      let taskIdx = 1;
      for (let c = 0; c < coresCount; c++) {
        const coreTasks: number[] = [];
        for (let t = 0; t < chunkSize && taskIdx <= patientsCount; t++) {
          coreTasks.push(taskIdx++);
        }
        workloads.push(coreTasks);
      }

      setResult({ seqTime: seq, parTime: par, speedup, efficiency, coreWorkloads: workloads });
      setRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
          Computer Architecture Lab
        </span>
        <h2 className="text-2xl font-extrabold text-slate-950 mt-2">Parallel Processing Lab</h2>
        <p className="text-xs text-slate-500 mt-0.5">Compare sequential and parallel hospital resource processing performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-950">Simulation Parameters</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Number of Patients / Tasks: {patientsCount}
            </label>
            <input
              type="range"
              min="20"
              max="300"
              step="20"
              value={patientsCount}
              onChange={(e) => setPatientsCount(Number(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Number of CPU Cores: {coresCount}
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

          <button
            onClick={runSimulation}
            disabled={running}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {running ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{running ? 'Running Simulation...' : 'Run Parallel Simulation'}</span>
          </button>
        </div>

        {/* Results & Visualization */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-950 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-600" />
              <span>Performance Benchmarks & Core Distribution</span>
            </h3>
            {result && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'comparison' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Metrics Comparison
                </button>
                <button
                  onClick={() => setActiveTab('cores')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'cores' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Core Task Mapping
                </button>
              </div>
            )}
          </div>

          {!result ? (
            <div className="text-center py-24 text-slate-400 text-sm">
              Configure parameters and click "Run Parallel Simulation" to execute benchmarks.
            </div>
          ) : activeTab === 'comparison' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Sequential Time</div>
                  <div className="text-2xl font-extrabold text-slate-950 mt-1">{result.seqTime}s</div>
                </div>

                <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200 text-center">
                  <div className="text-xs text-cyan-700 uppercase font-semibold">Parallel Time</div>
                  <div className="text-2xl font-extrabold text-cyan-600 mt-1">{result.parTime}s</div>
                </div>

                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-center">
                  <div className="text-xs text-teal-700 uppercase font-semibold">Speedup</div>
                  <div className="text-2xl font-extrabold text-teal-600 mt-1">{result.speedup}x</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                  <div className="text-xs text-blue-700 uppercase font-semibold">Efficiency</div>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">{result.efficiency}%</div>
                </div>
              </div>

              {/* Visual Bar Comparison */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Sequential Execution (Single Core)</span>
                    <span>{result.seqTime}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden">
                    <div className="bg-slate-700 h-full transition-all duration-1000" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Parallel Execution ({coresCount} Cores)</span>
                    <span>{result.parTime}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-1000" style={{ width: `${Math.max(12, (result.parTime / result.seqTime) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Multi-Core Task Distribution Map</div>
              <div className="space-y-3">
                {result.coreWorkloads.map((tasks, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm shrink-0">
                        C{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-950 text-sm">Processing Core {idx + 1}</div>
                        <div className="text-xs text-slate-500">{tasks.length} Patient Allocation Tasks Assigned</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {tasks.slice(0, 8).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono font-bold text-slate-700">
                          P-{1000 + t}
                        </span>
                      ))}
                      {tasks.length > 8 && (
                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-md text-[10px] font-bold">
                          +{tasks.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
