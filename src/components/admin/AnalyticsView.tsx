import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Patient, Doctor, HospitalResource } from '../../types';
import { BarChart3, Users, BedDouble, Stethoscope } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [resources, setResources] = useState<HospitalResource[]>([]);

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, 'patients'), (snap) => {
      setPatients(snap.docs.map(d => d.data() as Patient));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patients'));

    const unsubD = onSnapshot(collection(db, 'doctors'), (snap) => {
      setDoctors(snap.docs.map(d => d.data() as Doctor));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'doctors'));

    const unsubR = onSnapshot(collection(db, 'resources'), (snap) => {
      setResources(snap.docs.map(d => d.data() as HospitalResource));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'resources'));

    return () => {
      unsubP();
      unsubD();
      unsubR();
    };
  }, []);

  const totalPatients = patients.length;
  const criticalCount = patients.filter(p => p.priority === 'Critical').length;
  const highCount = patients.filter(p => p.priority === 'High').length;
  const mediumCount = patients.filter(p => p.priority === 'Medium').length;
  const lowCount = patients.filter(p => p.priority === 'Low').length;
  const completedCount = patients.filter(p => p.status === 'Completed').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Hospital Analytics & Metrics</h2>
        <p className="text-xs text-slate-500">Real-time statistics derived from Firestore database collections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Priority Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-600" />
            <span>Patient Priority Breakdown</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Critical Priority</span>
                <span>{criticalCount} ({totalPatients ? Math.round((criticalCount / totalPatients) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                <div className="bg-rose-600 h-full" style={{ width: `${totalPatients ? (criticalCount / totalPatients) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>High Priority</span>
                <span>{highCount} ({totalPatients ? Math.round((highCount / totalPatients) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${totalPatients ? (highCount / totalPatients) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Medium Priority</span>
                <span>{mediumCount} ({totalPatients ? Math.round((mediumCount / totalPatients) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: `${totalPatients ? (mediumCount / totalPatients) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Low Priority</span>
                <span>{lowCount} ({totalPatients ? Math.round((lowCount / totalPatients) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${totalPatients ? (lowCount / totalPatients) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BedDouble className="w-5 h-5 text-cyan-600" />
            <span>Resource Utilization Summary</span>
          </h3>

          <div className="space-y-4">
            {resources.map((res) => {
              const occ = Math.round(((res.total - res.available) / res.total) * 100) || 0;
              return (
                <div key={res.resourceId}>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>{res.type}</span>
                    <span>{occ}% Used ({res.total - res.available}/{res.total})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden">
                    <div className="bg-cyan-600 h-full" style={{ width: `${occ}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
