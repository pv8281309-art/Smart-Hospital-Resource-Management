import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Patient, Doctor, PatientPriority, PatientStatus } from '../../types';
import { Plus, Search, Trash2, Edit3, UserCheck, AlertTriangle, X, CheckCircle, Loader2 } from 'lucide-react';

export const PatientsManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterDept, setFilterDept] = useState<string>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [patientId, setPatientId] = useState(`P-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [department, setDepartment] = useState('Cardiology');
  const [priority, setPriority] = useState<PatientPriority>('Medium');
  const [icuRequired, setIcuRequired] = useState(false);
  const [assignedDoctorId, setAssignedDoctorId] = useState('');

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, 'patients'), (snap) => {
      setPatients(snap.docs.map(d => d.data() as Patient));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'patients'));

    const unsubD = onSnapshot(collection(db, 'doctors'), (snap) => {
      setDoctors(snap.docs.map(d => d.data() as Doctor));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'doctors'));

    return () => {
      unsubP();
      unsubD();
    };
  }, []);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedDoc = doctors.find(d => d.doctorId === assignedDoctorId);
      const newPatient: any = {
        patientId,
        name,
        age: Number(age),
        gender,
        department,
        priority,
        status: assignedDoctorId ? 'Assigned' : 'Waiting',
        icuRequired,
        createdAt: new Date().toISOString()
      };

      if (assignedDoctorId) {
        newPatient.assignedDoctorId = assignedDoctorId;
      }
      if (selectedDoc) {
        newPatient.assignedDoctorName = selectedDoc.name;
      }

      await setDoc(doc(db, 'patients', patientId), newPatient);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `patients/${patientId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setPatientId(`P-${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setAge(45);
    setGender('Male');
    setDepartment('Cardiology');
    setPriority('Medium');
    setIcuRequired(false);
    setAssignedDoctorId('');
  };

  const handleDelete = async (pid: string) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      await deleteDoc(doc(db, 'patients', pid));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `patients/${pid}`);
    }
  };

  const handleUpdateStatus = async (pid: string, newStatus: PatientStatus) => {
    try {
      await updateDoc(doc(db, 'patients', pid), { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `patients/${pid}`);
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPatients = patients.filter(p => {
    const q = debouncedSearch.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q);
    const matchesPriority = filterPriority === 'All' || p.priority === filterPriority;
    const matchesDept = filterDept === 'All' || p.department === filterDept;
    return matchesSearch && matchesPriority && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Management</h2>
          <p className="text-xs text-slate-500">Register, triage, and assign doctors to incoming patients.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Emergency">Emergency</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">No matching patient records</h4>
            <p className="text-xs text-slate-500 mb-4">No patients match your current search query or filter criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterPriority('All'); setFilterDept('All'); }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Name / Age</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">ICU</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{patient.patientId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{patient.name} <span className="text-slate-400 font-normal">({patient.age}y, {patient.gender})</span></td>
                    <td className="py-3.5 px-4 text-slate-600">{patient.department}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        patient.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                        patient.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                        patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {patient.icuRequired ? (
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Required</span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={patient.status}
                        onChange={(e) => handleUpdateStatus(patient.patientId, e.target.value as PatientStatus)}
                        className="text-xs font-medium px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 border border-slate-200"
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Under Treatment">Under Treatment</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {patient.assignedDoctorName || <span className="text-amber-600 italic">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(patient.patientId)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete patient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Register New Patient</h3>
              <p className="text-xs text-slate-500 mb-6">Enter patient details and clinical priority for intelligent allocation.</p>

              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Patient ID</label>
                    <input
                      type="text"
                      required
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
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
                      placeholder="e.g. John Doe"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Age</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
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
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Clinical Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as PatientPriority)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold"
                    >
                      <option value="Critical" className="text-rose-600">Critical</option>
                      <option value="High" className="text-amber-600">High</option>
                      <option value="Medium" className="text-yellow-600">Medium</option>
                      <option value="Low" className="text-emerald-600">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assign Doctor</label>
                    <select
                      value={assignedDoctorId}
                      onChange={(e) => setAssignedDoctorId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                    >
                      <option value="">-- Unassigned --</option>
                      {doctors.map(d => (
                        <option key={d.doctorId} value={d.doctorId}>{d.name} ({d.department})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={icuRequired}
                        onChange={(e) => setIcuRequired(e.target.checked)}
                        className="w-4 h-4 text-cyan-600 rounded accent-cyan-600"
                      />
                      <span className="text-xs font-bold text-slate-700">ICU Bed Required</span>
                    </label>
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
                    <span>Save Patient</span>
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
