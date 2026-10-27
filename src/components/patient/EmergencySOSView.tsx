import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { AlertOctagon, Truck, CheckCircle2, MapPin, ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmergencySOSView: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleTriggerSOS = async () => {
    setLoading(true);
    try {
      const sosId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
      const patientId = userProfile?.patientId || 'P-1001';
      const patientName = userProfile?.name || 'Rajesh Kumar';

      // 1. Create Emergency Request in Firestore
      await setDoc(doc(db, 'emergencyRequests', sosId), {
        sosId,
        patientId,
        patientName,
        location: 'GPS: 28.6139° N, 77.2090° E (Civil Lines, New Delhi)',
        status: 'Dispatched',
        ambulanceAssigned: 'AMB-02 (ICU Mobile)',
        etaMinutes: 6,
        createdAt: new Date().toISOString()
      });

      // 2. Create Ambulance Request
      const ambReqId = `AMB-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(db, 'ambulanceRequests', ambReqId), {
        requestId: ambReqId,
        patientId,
        patientName,
        pickupLocation: 'Emergency GPS Pin (Civil Lines, New Delhi)',
        status: 'Dispatched',
        ambulanceId: 'amb-2',
        etaMinutes: 6,
        createdAt: new Date().toISOString()
      });

      // 3. Create Notification
      const notifId = `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(db, 'notifications', notifId), {
        notificationId: notifId,
        userId: userProfile?.uid || 'user-1',
        title: 'Emergency SOS Triggered',
        message: 'Ambulance AMB-02 dispatched with ICU support. ETA: 6 mins.',
        type: 'emergency',
        read: false,
        createdAt: new Date().toISOString()
      });

      setSosActive(true);
      setConfirmed(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'emergencyRequests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto py-6">
      <div className="bg-gradient-to-br from-rose-600 via-red-700 to-slate-950 rounded-3xl p-8 text-white shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto text-white shadow-inner animate-pulse">
          <AlertOctagon className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-200 uppercase tracking-widest bg-rose-800/50 px-3.5 py-1 rounded-full border border-rose-400/30">
            Critical Emergency SOS
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Immediate Medical Dispatch</h2>
          <p className="text-rose-100 text-sm max-w-lg mx-auto leading-relaxed">
            Activating Emergency SOS instantly pinpoints your GPS location, dispatches the nearest ICU mobile ambulance, and alerts emergency hospital staff.
          </p>
        </div>

        {!confirmed ? (
          <div className="pt-4 space-y-4">
            <button
              onClick={handleTriggerSOS}
              disabled={loading}
              className="w-full sm:w-80 py-4 bg-white hover:bg-slate-100 text-rose-700 font-extrabold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 mx-auto scale-105 hover:scale-110"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertOctagon className="w-5 h-5 text-rose-600 animate-bounce" />}
              <span>ACTIVATE SOS NOW</span>
            </button>
            <p className="text-[11px] text-rose-200">Only use in genuine life-threatening medical emergencies.</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-left space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-extrabold text-base text-white">Ambulance Dispatched Successfully</h4>
                <p className="text-xs text-rose-100">Unit AMB-02 is en route to your location.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/15 text-xs">
              <div>
                <div className="text-rose-200">Estimated Arrival (ETA):</div>
                <div className="text-xl font-extrabold text-cyan-300 mt-0.5">6 Minutes</div>
              </div>
              <div>
                <div className="text-rose-200">Hospital Notified:</div>
                <div className="text-base font-extrabold text-white mt-0.5">MediCore Central</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/patient/ambulance')}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow transition-all text-center mt-2"
            >
              Track Ambulance Live on Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
