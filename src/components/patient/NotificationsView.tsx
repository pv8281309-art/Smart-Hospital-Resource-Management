import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { NotificationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'notifications'), (snap) => {
      setNotifications(snap.docs.map(d => d.data() as NotificationItem));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'));

    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-xs text-slate-500">Real-time alerts regarding appointments, ambulances, and hospital updates.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No notifications right now.</div>
        ) : (
          notifications.map((notif, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{notif.type}</span>
                  <span className="text-xs font-mono text-slate-400">{notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                </div>
                <h4 className="font-extrabold text-slate-950 text-sm mt-1">{notif.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
