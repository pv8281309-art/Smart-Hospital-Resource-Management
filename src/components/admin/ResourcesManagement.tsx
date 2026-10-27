import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { HospitalResource } from '../../types';
import { BedDouble, Activity, ShieldCheck, Truck, Plus, Minus, Loader2 } from 'lucide-react';

export const ResourcesManagement: React.FC = () => {
  const [resources, setResources] = useState<HospitalResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'resources'), (snap) => {
      setResources(snap.docs.map(d => d.data() as HospitalResource));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'resources'));

    return () => unsub();
  }, []);

  const handleUpdateAvailable = async (resourceId: string, currentAvailable: number, total: number, delta: number) => {
    const next = Math.max(0, Math.min(total, currentAvailable + delta));
    try {
      await updateDoc(doc(db, 'resources', resourceId), {
        available: next,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `resources/${resourceId}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Hospital Resources & Equipment</h2>
        <p className="text-xs text-slate-500">Real-time inventory monitoring for beds, ICU units, nurses, and medical machinery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => {
          const occupancyRate = Math.round(((res.total - res.available) / res.total) * 100) || 0;
          return (
            <div key={res.resourceId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    occupancyRate > 80 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {occupancyRate}% Occupied
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{res.type}</h3>
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-extrabold text-slate-900">{res.available}</span>
                  <span className="text-sm text-slate-500 font-medium">available of {res.total} total</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Adjust Available:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateAvailable(res.resourceId, res.available, res.total, -1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateAvailable(res.resourceId, res.available, res.total, 1)}
                    className="w-8 h-8 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 flex items-center justify-center transition-colors font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
