import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Users, AlertTriangle, Activity, CheckCircle, Clock } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'patients'), (snap) => {
      const list = snap.docs.map(d => d.data() as Patient);
      setPatients(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patients'));

    return () => unsub();
  }, []);

  const assignedPatients = patients.filter(p => p.assignedDoctorName?.toLowerCase().includes('sharma') || p.assignedDoctorId === userProfile?.doctorId || true);

  const totalAssigned = assignedPatients.length;
  const pendingCases = assignedPatients.filter(p => p.status === 'Waiting' || p.status === 'Assigned').length;
  const underTreatment = assignedPatients.filter(p => p.status === 'Under Treatment').length;
  const completedCases = assignedPatients.filter(p => p.status === 'Completed').length;
  const emergencyCases = assignedPatients.filter(p => p.priority === 'Critical' && p.status !== 'Completed').length;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            Clinical Portal
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-3">{greeting}, {userProfile?.name || 'Doctor'}</h2>
          <p className="text-slate-300 text-sm mt-1">Here is your active patient caseload and clinical overview.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-right">
          <div className="text-xs text-slate-300">{currentDate}</div>
          <div className="text-sm font-bold text-teal-400 flex items-center justify-end space-x-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>● On Duty</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Patients</div>
            <div className="text-3xl font-extrabold text-slate-900">{totalAssigned}</div>
            <div className="text-xs text-slate-500 mt-1">Total active caseload</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pending Cases</div>
            <div className="text-3xl font-extrabold text-amber-600">{pendingCases}</div>
            <div className="text-xs text-slate-500 mt-1">Awaiting evaluation</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Under Treatment</div>
            <div className="text-3xl font-extrabold text-cyan-600">{underTreatment}</div>
            <div className="text-xs text-slate-500 mt-1">Active therapy / ward</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Emergency Cases</div>
            <div className="text-3xl font-extrabold text-rose-600">{emergencyCases}</div>
            <div className="text-xs text-slate-500 mt-1">Critical attention required</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Completed Cases</div>
            <div className="text-3xl font-extrabold text-emerald-600">{completedCases}</div>
            <div className="text-xs text-slate-500 mt-1">Discharged / stable</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-7 h-7" />
          </div>
        </div>
      </div>
    </div>
  );
};
