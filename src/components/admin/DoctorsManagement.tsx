import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Doctor, Patient } from '../../types';
import { Stethoscope, Plus, Trash2, X, Loader2, CheckCircle, Clock } from 'lucide-react';

export const DoctorsManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [doctorId, setDoctorId] = useState(`doc-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Cardiology');
  const [specialization, setSpecialization] = useState('');
  const [availability, setAvailability] = useState<'Available' | 'Busy' | 'Unavailable'>('Available');

  useEffect(() => {
    const unsubD = onSnapshot(collection(db, 'doctors'), (snap) => {
      setDoctors(snap.docs.map(d => d.data() as Doctor));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'doctors'));

    const unsubP = onSnapshot(collection(db, 'patients'), (snap) => {
      setPatients(snap.docs.map(d => d.data() as Patient));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patients'));

    return () => {
      unsubD();
      unsubP();
    };
  }, []);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newDoctor: Doctor = {
        doctorId,
        name,
        email,
        department,
        specialization,
        availability,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'doctors', doctorId), newDoctor);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `doctors/${doctorId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDoctorId(`doc-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setEmail('');
    setDepartment('Cardiology');
    setSpecialization('');
    setAvailability('Available');
  };

  const handleDelete = async (did: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await deleteDoc(doc(db, 'doctors', did));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `doctors/${did}`);
    }
  };

  const handleToggleAvailability = async (did: string, current: string) => {
    const next = current === 'Available' ? 'Busy' : current === 'Busy' ? 'Unavailable' : 'Available';
    try {
      await updateDoc(doc(db, 'doctors', did), { availability: next });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `doctors/${did}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Doctors Directory & Workload</h2>
          <p className="text-xs text-slate-500">Manage medical staff profiles, departments, and shift availability.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Doctor</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {doctors.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No doctors found. Seed demo data or add a doctor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Workload</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {doctors.map((doctor) => {
                  const assignedCount = patients.filter(p => p.assignedDoctorId === doctor.doctorId && p.status !== 'Completed').length;
                  return (
                    <tr key={doctor.doctorId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{doctor.name}</div>
                        <div className="text-xs text-slate-400">{doctor.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{doctor.department}</td>
                      <td className="py-3.5 px-4 text-slate-600">{doctor.specialization || 'General'}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                          {assignedCount} Active Patients
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(doctor.doctorId, doctor.availability)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            doctor.availability === 'Available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                            doctor.availability === 'Busy' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                        >
                          {doctor.availability}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleDelete(doctor.doctorId)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Add Medical Doctor</h3>
              <p className="text-xs text-slate-500 mb-6">Create a doctor profile and assign department specialization.</p>

              <form onSubmit={handleCreateDoctor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Doctor ID</label>
                  <input
                    type="text"
                    required
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. John Smith"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="smith@hospital.org"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Trauma Care"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center space-x-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Save Doctor</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
