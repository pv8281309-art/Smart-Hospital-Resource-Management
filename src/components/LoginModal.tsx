import React, { useState } from 'react';
import { X, Shield, Stethoscope, User, Lock, Mail, ArrowRight, AlertCircle, Loader2, Hospital, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setUserProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (!selectedRole) {
      setError('Please select a role before signing in with Google.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      const docRef = doc(db, 'users', user.uid);
      const profile: any = {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || (selectedRole === 'patient' ? 'Rajesh Kumar' : 'User'),
        email: user.email || '',
        role: selectedRole,
        createdAt: new Date().toISOString()
      };
      if (selectedRole === 'doctor') {
        profile.doctorId = 'doc-1';
        profile.department = 'Cardiology';
      } else if (selectedRole === 'patient') {
        profile.patientId = 'P-1001';
      }
      await setDoc(docRef, profile, { merge: true });
      setUserProfile(profile);

      onClose();
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (selectedRole === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      const docRef = doc(db, 'users', user.uid);
      const profile: any = {
        uid: user.uid,
        name: email.split('@')[0],
        email: email,
        role: selectedRole,
        createdAt: new Date().toISOString()
      };
      if (selectedRole === 'doctor') {
        profile.doctorId = 'doc-1';
        profile.department = 'Cardiology';
      } else if (selectedRole === 'patient') {
        profile.patientId = 'P-1001';
      }
      await setDoc(docRef, profile, { merge: true });
      setUserProfile(profile);

      onClose();
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (selectedRole === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is disabled in Firebase. Please use "Sign in with Google" or 1-Click Demo Login below.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setSelectedRole(role);
    setSubmitting(true);
    setError(null);
    try {
      const demoEmail = role === 'admin' ? 'admin@hospital.org' : role === 'doctor' ? 'sharma@hospital.org' : 'rajesh@patient.org';
      setEmail(demoEmail);
      setPassword('demo123456');
      
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      const docRef = doc(db, 'users', user.uid);
      const profile: any = {
        uid: user.uid,
        name: role === 'admin' ? 'Hospital Admin' : role === 'doctor' ? 'Dr. Ramesh Sharma' : 'Rajesh Kumar',
        email: user.email || demoEmail,
        role: role,
        createdAt: new Date().toISOString()
      };
      if (role === 'doctor') {
        profile.doctorId = 'doc-1';
        profile.department = 'Cardiology';
      } else if (role === 'patient') {
        profile.patientId = 'P-1001';
      }
      await setDoc(docRef, profile, { merge: true });
      setUserProfile(profile);

      onClose();
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
              MediCore Portal
            </span>
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-3">Welcome to MediCore</h3>
            <p className="text-sm text-slate-500 mt-1">Choose your access portal to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!selectedRole ? (
            <div className="space-y-4">
              <div
                onClick={() => setSelectedRole('admin')}
                className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-cyan-600 hover:bg-cyan-50/20 cursor-pointer transition-all flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Hospital className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-950 text-base">Hospital Admin</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Manage patients, doctors, resources & operations.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0" />
              </div>

              <div
                onClick={() => setSelectedRole('doctor')}
                className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-cyan-600 hover:bg-cyan-50/20 cursor-pointer transition-all flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-950 text-base">Doctor</h4>
                  <p className="text-xs text-slate-500 mt-0.5">View assigned patients & clinical treatment logs.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0" />
              </div>

              <div
                onClick={() => setSelectedRole('patient')}
                className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-cyan-600 hover:bg-cyan-50/20 cursor-pointer transition-all flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-950 text-base">Patient Portal</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Book appointments, track ambulance, SOS & records.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0" />
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-center text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Instant Presentation Demo Login</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={submitting}
                    className="flex items-center justify-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-2 rounded-xl border border-blue-200 text-xs transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('doctor')}
                    disabled={submitting}
                    className="flex items-center justify-center space-x-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold py-2.5 px-2 rounded-xl border border-teal-200 text-xs transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('patient')}
                    disabled={submitting}
                    className="flex items-center justify-center space-x-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-2 rounded-xl border border-indigo-200 text-xs transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Patient</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${selectedRole === 'admin' ? 'bg-blue-600' : selectedRole === 'doctor' ? 'bg-teal-600' : 'bg-indigo-600'}`}>
                    {selectedRole === 'admin' ? <Hospital className="w-5 h-5" /> : selectedRole === 'doctor' ? <Stethoscope className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-950 capitalize">{selectedRole === 'patient' ? 'Patient Portal' : `${selectedRole} Portal`}</div>
                    <div className="text-xs text-slate-400">Secure MediCore Authentication</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs text-cyan-600 hover:underline font-semibold bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-100"
                >
                  Change Role
                </button>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 rounded-2xl border border-slate-300 shadow-xs transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google as {selectedRole === 'admin' ? 'Admin' : selectedRole === 'doctor' ? 'Doctor' : 'Patient'}</span>
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin(selectedRole)}
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instant 1-Click Demo Login ({selectedRole === 'admin' ? 'Admin' : selectedRole === 'doctor' ? 'Doctor' : 'Patient'})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
