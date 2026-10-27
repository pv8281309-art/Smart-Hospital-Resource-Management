import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { seedDemoDataIfEmpty } from '../utils/seedData';

interface AuthContextType {
  user: any;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  signIn: (email: string, pass: string, expectedRole: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // Fallback profile if missing in Firestore
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'patient',
              patientId: 'P-1001',
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, defaultProfile);
            setUserProfile(defaultProfile);
          }
          await seedDemoDataIfEmpty();
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string, expectedRole: UserRole) => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const docRef = doc(db, 'users', cred.user.uid);
      const docSnap = await getDoc(docRef);
      
      let profile: UserProfile;
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
        // Allow updating role if it matches expected or force set
        profile.role = expectedRole;
        await setDoc(docRef, profile, { merge: true });
      } else {
        profile = {
          uid: cred.user.uid,
          name: email.split('@')[0],
          email: email,
          role: expectedRole,
          patientId: expectedRole === 'patient' ? 'P-1001' : undefined,
          doctorId: expectedRole === 'doctor' ? 'doc-1' : undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, profile);
      }
      setUserProfile(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      throw err;
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUserProfile(null);
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, userProfile, setUserProfile, loading, signIn, signOut, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
