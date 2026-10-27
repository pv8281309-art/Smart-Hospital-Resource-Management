import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { Doctor, Appointment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CalendarPlus, Search, Stethoscope, Star, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookAppointmentView: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Booking Modal state
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'doctors'), (snap) => {
      setDoctors(snap.docs.map(d => d.data() as Doctor));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'doctors'));

    return () => unsub();
  }, []);

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || d.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctor) return;
    setSubmitting(true);
    try {
      const appointmentId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newAppointment: Appointment = {
        appointmentId,
        patientId: userProfile?.patientId || 'P-1001',
        patientName: userProfile?.name || 'Rajesh Kumar',
        doctorId: activeDoctor.doctorId,
        doctorName: activeDoctor.name,
        department: activeDoctor.department,
        date,
        timeSlot,
        reason,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'appointments', appointmentId), newAppointment);
      
      // Also add a patient history record or notification
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveDoctor(null);
        navigate('/patient/appointments');
      }, 1500);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'appointments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Book Doctor Appointment</h2>
          <p className="text-xs text-slate-500">Search specialized physicians and select preferred consultation time slots.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 text-slate-900"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium w-full sm:w-auto"
        >
          <option value="All">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Emergency">Emergency</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((docObj) => (
          <div key={docObj.doctorId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-indigo-500 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-base">{docObj.name}</h3>
                    <p className="text-xs text-indigo-600 font-bold">{docObj.department}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  docObj.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {docObj.availability}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Specialization: <span className="font-bold text-slate-900">{docObj.specialization}</span></div>
                <div>Qualification: <span className="font-bold text-slate-900">{docObj.qualification || 'MBBS, MD'}</span></div>
                <div>Experience: <span className="font-bold text-slate-900">{docObj.experience || '10+ Years'}</span></div>
              </div>
            </div>

            <button
              onClick={() => setActiveDoctor(docObj)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all mt-4"
            >
              Book Consultation
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-8 relative">
            <h3 className="text-xl font-extrabold text-slate-950 mb-1">Book Appointment with {activeDoctor.name}</h3>
            <p className="text-xs text-slate-500 mb-6">{activeDoctor.department} • {activeDoctor.specialization}</p>

            {success ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Appointment Confirmed!</div>
                <p className="text-xs text-emerald-600">Redirecting to your appointments...</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows={3}
                    placeholder="Briefly describe your symptoms or reason for consultation..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveDoctor(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
