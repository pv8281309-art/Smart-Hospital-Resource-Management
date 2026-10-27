import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { Appointment, Hospital, Ambulance, MedicalRecord, NotificationItem, Doctor } from '../../types';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Building2, 
  Truck, 
  AlertOctagon, 
  FileText, 
  Stethoscope, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  MapPin, 
  Activity,
  HeartPulse
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const unsubAppts = onSnapshot(collection(db, 'appointments'), (snap) => {
      setAppointments(snap.docs.map(d => d.data() as Appointment));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'appointments'));

    const unsubHosp = onSnapshot(collection(db, 'hospitals'), (snap) => {
      setHospitals(snap.docs.map(d => d.data() as Hospital));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'hospitals'));

    const unsubAmb = onSnapshot(collection(db, 'ambulances'), (snap) => {
      setAmbulances(snap.docs.map(d => d.data() as Ambulance));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'ambulances'));

    const unsubRec = onSnapshot(collection(db, 'medicalRecords'), (snap) => {
      setMedicalRecords(snap.docs.map(d => d.data() as MedicalRecord));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'medicalRecords'));

    const unsubNotif = onSnapshot(collection(db, 'notifications'), (snap) => {
      setNotifications(snap.docs.map(d => d.data() as NotificationItem));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'));

    const unsubDoc = onSnapshot(collection(db, 'doctors'), (snap) => {
      setDoctors(snap.docs.map(d => d.data() as Doctor));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'doctors'));

    return () => {
      unsubAppts();
      unsubHosp();
      unsubAmb();
      unsubRec();
      unsubNotif();
      unsubDoc();
    };
  }, []);

  const patientId = userProfile?.patientId || 'P-1001';
  const myAppointments = appointments.filter(a => a.patientId === patientId || a.patientName === userProfile?.name);
  const upcomingAppointment = myAppointments.find(a => a.status === 'Confirmed' || a.status === 'Requested');
  const assignedDoctor = doctors.find(d => d.doctorId === upcomingAppointment?.doctorId) || doctors[0];
  const availableAmbulances = ambulances.filter(a => a.status === 'Available').length;
  const myRecords = medicalRecords.filter(r => r.patientId === patientId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">
            Patient Health Command
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-3">Welcome back, {userProfile?.name || 'Rajesh Kumar'}</h2>
          <p className="text-slate-300 text-sm mt-1">Patient ID: <span className="font-mono text-cyan-300 font-bold">{patientId}</span> • All vitals & health records synchronized.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/patient/emergency-sos')}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-rose-900/50 transition-all animate-pulse"
          >
            <AlertOctagon className="w-5 h-5" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Next Appointment</div>
            <div className="text-lg font-extrabold text-slate-900 truncate max-w-[180px]">
              {upcomingAppointment ? `${upcomingAppointment.doctorName}` : 'No Active Appointment'}
            </div>
            <div className="text-xs text-indigo-600 font-bold mt-1">
              {upcomingAppointment ? `${upcomingAppointment.date} (${upcomingAppointment.timeSlot})` : 'Book a consultation'}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Doctor</div>
            <div className="text-lg font-extrabold text-slate-900">{assignedDoctor?.name || 'Dr. Ramesh Sharma'}</div>
            <div className="text-xs text-slate-500 mt-1">{assignedDoctor?.department || 'Cardiology'}</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Stethoscope className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ambulances Available</div>
            <div className="text-3xl font-extrabold text-cyan-600">{availableAmbulances} Active</div>
            <div className="text-xs text-slate-500 mt-1">Avg ETA: 8-10 mins</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Truck className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Medical Records</div>
            <div className="text-3xl font-extrabold text-slate-900">{myRecords.length || 3} Files</div>
            <div className="text-xs text-emerald-600 font-bold mt-1">Verified & Secure</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Appointment & Hospital Availability */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointment Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 text-lg">Upcoming Appointment</h3>
                  <p className="text-xs text-slate-500">Your scheduled consultation status</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/patient/appointments')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {upcomingAppointment ? (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold">
                      {upcomingAppointment.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {upcomingAppointment.appointmentId}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-950 text-base mt-2">{upcomingAppointment.doctorName} ({upcomingAppointment.department})</h4>
                  <p className="text-xs text-slate-600">Date: <span className="font-bold">{upcomingAppointment.date}</span> at <span className="font-bold">{upcomingAppointment.timeSlot}</span></p>
                  <p className="text-xs text-slate-500">Reason: {upcomingAppointment.reason}</p>
                </div>
                <button
                  onClick={() => navigate('/patient/appointments')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  Manage
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-slate-500">You have no upcoming appointments scheduled.</p>
                <button
                  onClick={() => navigate('/patient/book-appointment')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  Book Appointment Now
                </button>
              </div>
            )}
          </div>

          {/* Hospital Availability Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 text-lg">Hospital & Bed Availability</h3>
                  <p className="text-xs text-slate-500">Real-time capacity across MediCore facilities</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/patient/hospitals')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center space-x-1"
              >
                <span>Explore All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.slice(0, 2).map((hosp) => (
                <div key={hosp.hospitalId} className="border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-cyan-500 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm">{hosp.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{hosp.address}, {hosp.city}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      hosp.emergencyStatus === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {hosp.emergencyStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400">General Beds:</span> <span className="font-bold text-slate-900">{hosp.availableBeds}/{hosp.totalBeds}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">ICU Available:</span> <span className="font-bold text-cyan-700">{hosp.availableIcu}/{hosp.totalIcu}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Notifications & Quick Actions */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-950 text-lg">Recent Notifications</h3>
              <button
                onClick={() => navigate('/patient/notifications')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">No new notifications.</div>
              )}
            </div>
          </div>

          {/* Quick Emergency Dispatch Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-7 text-white shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base">Ambulance Dispatch</h4>
                <p className="text-xs text-slate-400">Instant GPS location tracking</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need immediate transport? Request an Advanced Life Support or ICU Mobile ambulance with one tap.
            </p>
            <button
              onClick={() => navigate('/patient/ambulance')}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs rounded-xl shadow transition-all text-center"
            >
              Request Ambulance Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
