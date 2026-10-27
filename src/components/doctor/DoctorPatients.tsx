import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { Patient, PatientHistoryRecord, PatientStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, CheckCircle, X, Loader2, Plus } from 'lucide-react';

export const DoctorPatients: React.FC = () => {
  const { userProfile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [historyList, setHistoryList] = useState<PatientHistoryRecord[]>([]);
  
  // Treatment form state
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [newStatus, setNewStatus] = useState<PatientStatus>('Under Treatment');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'patients'), (snap) => {
      setPatients(snap.docs.map(d => d.data() as Patient));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patients'));

    return () => unsub();
  }, []);

  const openPatientModal = async (patient: Patient) => {
    setSelectedPatient(patient);
    setNewStatus(patient.status);
    // Fetch history
    try {
      const q = query(collection(db, 'patientHistory'));
      const snap = await getDocs(q);
      const allHistory = snap.docs.map(d => d.data() as PatientHistoryRecord);
      setHistoryList(allHistory.filter(h => h.patientId === patient.patientId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setSubmitting(true);
    try {
      const historyId = `HIST-${Math.floor(10000 + Math.random() * 90000)}`;
      const record: PatientHistoryRecord = {
        historyId,
        patientId: selectedPatient.patientId,
        doctorId: userProfile?.doctorId || 'doc-1',
        doctorName: userProfile?.name || 'Doctor',
        diagnosis,
        treatmentNotes,
        status: newStatus,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'patientHistory', historyId), record);
      await updateDoc(doc(db, 'patients', selectedPatient.patientId), { status: newStatus });

      setHistoryList([record, ...historyList]);
      setSelectedPatient({ ...selectedPatient, status: newStatus });
      setDiagnosis('');
      setTreatmentNotes('');
      alert('Treatment record successfully saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `patientHistory`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Assigned Patients</h2>
        <p className="text-xs text-slate-500">View patient case files, clinical history timeline, and update treatment records.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {patients.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No patients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Name / Age</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {patients.map((patient) => (
                  <tr key={patient.patientId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{patient.patientId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{patient.name} ({patient.age}y)</td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.department}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        patient.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.assignedDoctorName || 'Unassigned'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openPatientModal(patient)}
                        className="px-4 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded-lg text-xs transition-colors"
                      >
                        View & Treat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail & Treatment Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden relative my-8">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Patient Case File</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedPatient.name} ({selectedPatient.patientId})</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPatient.age} years old • {selectedPatient.gender} • Dept: {selectedPatient.department}</p>
              </div>

              {/* Treatment Update Form */}
              <form onSubmit={handleSaveTreatment} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Update Treatment Record</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as PatientStatus)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
                    >
                      <option value="Under Treatment">Under Treatment</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Diagnosis</label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Myocardial Infarction"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Treatment Notes</label>
                  <textarea
                    rows={3}
                    required
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                    placeholder="Enter medication, procedures, and clinical observations..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center space-x-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Save Treatment Record</span>
                  </button>
                </div>
              </form>

              {/* History Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-4">Patient Clinical History Timeline</h4>
                {historyList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No prior treatment history records found.</div>
                ) : (
                  <div className="space-y-4">
                    {historyList.map((h) => (
                      <div key={h.historyId} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{h.doctorName}</span>
                          <span className="text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="font-semibold text-sm text-teal-700">Diagnosis: {h.diagnosis}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{h.treatmentNotes}</p>
                        <div className="pt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                            Status: {h.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
