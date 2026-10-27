import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Appointment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Stethoscope, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export const MyAppointmentsView: React.FC = () => {
  const { userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'appointments'), (snap) => {
      setAppointments(snap.docs.map(d => d.data() as Appointment));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'appointments'));

    return () => unsub();
  }, []);

  const patientId = userProfile?.patientId || 'P-1001';
  const myAppointments = appointments.filter(a => a.patientId === patientId || a.patientName === userProfile?.name);

  const handleCancel = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), { status: 'Cancelled' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${appointmentId}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Appointments</h2>
          <p className="text-xs text-slate-500">View and manage your upcoming and past doctor consultations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
        {myAppointments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No appointment history found. Book your first appointment today.</div>
        ) : (
          <div className="space-y-4">
            {myAppointments.map((apt) => (
              <div key={apt.appointmentId} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {apt.appointmentId}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-950 text-base">{apt.doctorName} <span className="text-xs text-slate-500 font-normal">({apt.department})</span></h3>
                  <div className="flex items-center space-x-4 text-xs text-slate-600">
                    <div className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5 text-indigo-600" /><span>{apt.date}</span></div>
                    <div className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5 text-indigo-600" /><span>{apt.timeSlot}</span></div>
                  </div>
                  <p className="text-xs text-slate-500">Reason: <span className="font-medium text-slate-700">{apt.reason}</span></p>
                </div>

                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                  <button
                    onClick={() => handleCancel(apt.appointmentId)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
