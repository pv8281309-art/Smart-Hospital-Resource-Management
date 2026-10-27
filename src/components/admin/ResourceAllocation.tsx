import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Patient, Doctor, HospitalResource } from '../../types';
import { Sliders, CheckCircle, AlertTriangle, Stethoscope, BedDouble, ArrowRight } from 'lucide-react';

export const ResourceAllocation: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [resources, setResources] = useState<HospitalResource[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [allocating, setAllocating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, 'patients'), (snap) => {
      const list = snap.docs.map(d => d.data() as Patient);
      setPatients(list);
      if (list.length > 0 && !selectedPatientId) {
        const waiting = list.find(p => p.status === 'Waiting');
        if (waiting) setSelectedPatientId(waiting.patientId);
      }
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

  const currentPatient = patients.find(p => p.patientId === selectedPatientId);
  const availableDocsForDept = doctors.filter(d => !currentPatient || d.department === currentPatient.department);
  const icuRes = resources.find(r => r.resourceId === 'res-icu');
  const bedRes = resources.find(r => r.resourceId === 'res-beds');

  const handleAllocate = async () => {
    if (!currentPatient || !selectedDoctorId) return;
    setAllocating(true);
    setSuccessMsg(null);
    try {
      const docObj = doctors.find(d => d.doctorId === selectedDoctorId);
      await updateDoc(doc(db, 'patients', currentPatient.patientId), {
        status: 'Assigned',
        assignedDoctorId: selectedDoctorId,
        assignedDoctorName: docObj ? docObj.name : 'Assigned Doctor'
      });

      setSuccessMsg(`Successfully allocated ${docObj?.name || 'Doctor'} and bed resource to patient ${currentPatient.patientId}!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `patients/${currentPatient.patientId}`);
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Intelligent Resource Allocation</h2>
        <p className="text-xs text-slate-500">Automated triage recommendation engine for patient-to-doctor and bed matching.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Select Patient */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">1. Select Patient in Queue</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {patients.filter(p => p.status === 'Waiting').length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No waiting patients in queue.</div>
            ) : (
              patients.filter(p => p.status === 'Waiting').map(p => (
                <div
                  key={p.patientId}
                  onClick={() => setSelectedPatientId(p.patientId)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPatientId === p.patientId ? 'border-cyan-600 bg-cyan-50/40' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">{p.name} ({p.patientId})</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.priority}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">Dept: {p.department} • ICU: {p.icuRequired ? 'Yes' : 'No'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Middle: System Evaluation & Recommendation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">2. System Evaluation</h3>
          {currentPatient ? (
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{currentPatient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-bold text-rose-600">{currentPatient.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-900">{currentPatient.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ICU Required:</span>
                  <span className="font-bold text-slate-900">{currentPatient.icuRequired ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{currentPatient.department} specialist available</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{currentPatient.icuRequired ? `ICU Bed available (${icuRes?.available || 0} left)` : `General Bed available (${bedRes?.available || 0} left)`}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">Select a patient to view evaluation.</div>
          )}
        </div>

        {/* Right: Allocation Action */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">3. Recommended Allocation</h3>
          {currentPatient ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Select Specialist Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
                >
                  <option value="">-- Choose Doctor --</option>
                  {availableDocsForDept.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>{d.name} ({d.specialization || d.department})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAllocate}
                disabled={!selectedDoctorId || allocating}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Allocate Resources & Doctor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">Select a patient first.</div>
          )}
        </div>
      </div>
    </div>
  );
};
