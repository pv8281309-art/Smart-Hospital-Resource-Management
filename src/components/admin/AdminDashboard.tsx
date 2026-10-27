import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Users, AlertTriangle, BedDouble, Stethoscope, Activity, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Patient, Doctor, HospitalResource } from '../../types';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [resources, setResources] = useState<HospitalResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubPatients = onSnapshot(collection(db, 'patients'), (snap) => {
      const list = snap.docs.map(doc => doc.data() as Patient);
      setPatients(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patients'));

    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snap) => {
      const list = snap.docs.map(doc => doc.data() as Doctor);
      setDoctors(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'doctors'));

    const unsubResources = onSnapshot(collection(db, 'resources'), (snap) => {
      const list = snap.docs.map(doc => doc.data() as HospitalResource);
      setResources(list);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'resources'));

    return () => {
      unsubPatients();
      unsubDoctors();
      unsubResources();
    };
  }, []);

  // Calculate KPIs
  const totalPatients = patients.length;
  const emergencyPatients = patients.filter(p => p.priority === 'Critical' && p.status !== 'Completed').length;
  
  const bedsResource = resources.find(r => r.resourceId === 'res-beds');
  const availableBeds = bedsResource ? bedsResource.available : 32;
  const totalBeds = bedsResource ? bedsResource.total : 100;

  const icuResource = resources.find(r => r.resourceId === 'res-icu');
  const availableIcu = icuResource ? icuResource.available : 6;
  const totalIcu = icuResource ? icuResource.total : 20;

  const availableDoctors = doctors.filter(d => d.availability === 'Available').length;
  const totalDoctors = doctors.length;

  const totalCapacity = totalBeds + totalIcu;
  const usedCapacity = (totalBeds - availableBeds) + (totalIcu - availableIcu);
  const resourceUtilization = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 78;

  // Priority queue sort
  const priorityRank: Record<string, number> = { Critical: 1, High: 2, Medium: 3, Low: 4 };
  const sortedPatients = [...patients]
    .filter(p => p.status !== 'Completed')
    .sort((a, b) => (priorityRank[a.priority] || 5) - (priorityRank[b.priority] || 5));

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">
            Command Center
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-3">{greeting}, Admin</h2>
          <p className="text-slate-300 text-sm mt-1">Here's what's happening across the hospital today.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-right">
          <div className="text-xs text-slate-300">{currentDate}</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center justify-end space-x-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>● Operational</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Patients</div>
            <div className="text-3xl font-extrabold text-slate-950">{totalPatients}</div>
            <div className="text-xs text-slate-500 mt-1">Active hospital registry</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Emergency Cases</div>
            <div className="text-3xl font-extrabold text-rose-600">{emergencyPatients}</div>
            <div className="text-xs text-rose-500 mt-1">Critical priority queue</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Available Beds</div>
            <div className="text-3xl font-extrabold text-blue-600">{availableBeds}</div>
            <div className="text-xs text-slate-500 mt-1">General ward capacity</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BedDouble className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ICU Available</div>
            <div className="text-3xl font-extrabold text-teal-600">{availableIcu}</div>
            <div className="text-xs text-slate-500 mt-1">Critical care units</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doctors Available</div>
            <div className="text-3xl font-extrabold text-indigo-600">{availableDoctors}</div>
            <div className="text-xs text-slate-500 mt-1">Ready for shift duty</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Stethoscope className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Resource Utilization</div>
            <div className="text-3xl font-extrabold text-slate-950">{resourceUtilization}%</div>
            <div className="text-xs text-slate-500 mt-1">Overall hospital load</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emergency Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Emergency Queue</h3>
                <p className="text-xs text-slate-500">Highest priority patients awaiting allocation</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                {emergencyPatients} Critical
              </span>
            </div>

            {sortedPatients.filter(p => p.priority === 'Critical').length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">All clear. No critical cases currently waiting.</div>
            ) : (
              <div className="space-y-3">
                {sortedPatients.filter(p => p.priority === 'Critical').slice(0, 4).map(p => (
                  <div key={p.patientId} className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-950 text-sm">{p.name} ({p.patientId})</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Critical</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Dept: {p.department} • Age: {p.age}</div>
                    </div>
                    <Link
                      to="/admin/resource-allocation"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                    >
                      Allocate
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 text-right">
            <Link to="/admin/patients" className="text-xs font-bold text-cyan-600 hover:underline inline-flex items-center space-x-1">
              <span>View Full Patient Registry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Resource Utilization Bars */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950 mb-1">Resource Utilization Breakdown</h3>
            <p className="text-xs text-slate-500 mb-6">Real-time capacity across key hospital departments</p>

            <div className="space-y-5">
              {resources.map(res => {
                const used = res.total - res.available;
                const pct = Math.round((used / res.total) * 100) || 0;
                return (
                  <div key={res.resourceId}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>{res.type}</span>
                      <span>{used} / {res.total} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${pct > 80 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-cyan-600'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 text-right">
            <Link to="/admin/resources" className="text-xs font-bold text-cyan-600 hover:underline inline-flex items-center space-x-1">
              <span>Manage Hospital Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
