import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { MedicalRecord, PatientHistoryRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { FileText, Stethoscope, Calendar, Download, ShieldCheck } from 'lucide-react';

export const MedicalRecordsView: React.FC = () => {
  const { userProfile } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [historyRecords, setHistoryRecords] = useState<PatientHistoryRecord[]>([]);

  useEffect(() => {
    const unsubRec = onSnapshot(collection(db, 'medicalRecords'), (snap) => {
      setRecords(snap.docs.map(d => d.data() as MedicalRecord));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'medicalRecords'));

    const unsubHist = onSnapshot(collection(db, 'patientHistory'), (snap) => {
      setHistoryRecords(snap.docs.map(d => d.data() as PatientHistoryRecord));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patientHistory'));

    return () => {
      unsubRec();
      unsubHist();
    };
  }, []);

  const patientId = userProfile?.patientId || 'P-1001';
  const myRecords = records.filter(r => r.patientId === patientId);
  const myHistory = historyRecords.filter(h => h.patientId === patientId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medical Records & History</h2>
          <p className="text-xs text-slate-500">Securely view verified diagnoses, prescriptions, and discharge summaries.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-2xl">
          <ShieldCheck className="w-4 h-4" />
          <span>All records are securely verified by MediCore Clinical Board. Modifications are restricted.</span>
        </div>

        {myRecords.length === 0 && myHistory.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No medical records found in your profile.</div>
        ) : (
          <div className="space-y-4">
            {myRecords.map((rec) => (
              <div key={rec.recordId} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">{rec.department}</span>
                    <span className="text-xs font-mono text-slate-400">{rec.date}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Dr. {rec.doctorName}</span>
                </div>

                <div className="text-sm font-bold text-slate-950">Diagnosis: {rec.diagnosis}</div>
                <div className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <div><span className="font-bold text-slate-700">Prescription:</span> {rec.prescription}</div>
                  <div><span className="font-bold text-slate-700">Clinical Notes:</span> {rec.notes}</div>
                </div>
              </div>
            ))}

            {myHistory.map((hist) => (
              <div key={hist.historyId} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">Clinical Visit</span>
                    <span className="text-xs font-mono text-slate-400">{hist.createdAt.split('T')[0]}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{hist.doctorName}</span>
                </div>

                <div className="text-sm font-bold text-slate-950">Diagnosis: {hist.diagnosis}</div>
                <div className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700">Treatment Notes:</span> {hist.treatmentNotes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
