import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Ambulance, AmbulanceRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Truck, AlertOctagon, Phone, MapPin, Clock, CheckCircle2, X } from 'lucide-react';

export const AmbulanceView: React.FC = () => {
  const { userProfile } = useAuth();
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [requests, setRequests] = useState<AmbulanceRequest[]>([]);
  const [pickupLocation, setPickupLocation] = useState('22 Civil Lines, New Delhi');
  const [requesting, setRequesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubAmb = onSnapshot(collection(db, 'ambulances'), (snap) => {
      setAmbulances(snap.docs.map(d => d.data() as Ambulance));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'ambulances'));

    const unsubReq = onSnapshot(collection(db, 'ambulanceRequests'), (snap) => {
      setRequests(snap.docs.map(d => d.data() as AmbulanceRequest));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'ambulanceRequests'));

    return () => {
      unsubAmb();
      unsubReq();
    };
  }, []);

  const patientId = userProfile?.patientId || 'P-1001';
  const myRequests = requests.filter(r => r.patientId === patientId);

  const handleRequestAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    setSuccessMsg(null);
    try {
      const requestId = `AMB-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReq: AmbulanceRequest = {
        requestId,
        patientId,
        patientName: userProfile?.name || 'Rajesh Kumar',
        pickupLocation,
        status: 'Requested',
        etaMinutes: 10,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'ambulanceRequests', requestId), newReq);
      setSuccessMsg('Ambulance requested successfully! Dispatcher has been notified.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'ambulanceRequests');
    } finally {
      setRequesting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this ambulance request?')) return;
    try {
      await updateDoc(doc(db, 'ambulanceRequests', requestId), { status: 'Cancelled' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `ambulanceRequests/${requestId}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ambulance Dispatch & Tracking</h2>
          <p className="text-xs text-slate-500">Request emergency transport or track live ambulance arrival.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Request Ambulance Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-950 text-lg">Request Emergency Ambulance</h3>
            <p className="text-xs text-slate-500">Instant dispatch to your GPS or specified location</p>
          </div>
        </div>

        <form onSubmit={handleRequestAmbulance} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Location / Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={requesting}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>{requesting ? 'Dispatching...' : 'Dispatch Ambulance Now'}</span>
          </button>
        </form>
      </div>

      {/* Active Requests Tracking */}
      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
        <h3 className="font-extrabold text-slate-950 text-lg">Your Ambulance Requests</h3>
        {myRequests.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">No active ambulance requests.</div>
        ) : (
          <div className="space-y-4">
            {myRequests.map((req) => (
              <div key={req.requestId} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      req.status === 'Arrived' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'Cancelled' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {req.requestId}</span>
                  </div>
                  <div className="font-bold text-slate-950 text-sm mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{req.pickupLocation}</span>
                  </div>
                  <div className="text-xs text-slate-500">Estimated Arrival: <span className="font-extrabold text-cyan-700">{req.etaMinutes || 8} mins</span></div>
                </div>

                {req.status !== 'Cancelled' && req.status !== 'Arrived' && (
                  <button
                    onClick={() => handleCancelRequest(req.requestId)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Fleet Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
        <h3 className="font-extrabold text-slate-950 text-lg">Available Fleet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambulances.map((amb) => (
            <div key={amb.ambulanceId} className="border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-950 text-sm">{amb.vehicleNumber}</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  amb.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700'
                }`}>
                  {amb.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <div>Type: <span className="font-bold text-slate-700">{amb.type}</span></div>
                <div>Driver: <span className="font-bold text-slate-700">{amb.driverName} ({amb.driverPhone})</span></div>
                <div>Current Location: <span className="font-bold text-slate-700">{amb.currentLocation}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
