import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  signOut,
  User,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import type { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  sendPhoneOTP: (phone: string, recaptchaContainer: string) => Promise<ConfirmationResult>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  mockLoginAsAdmin: () => void;
  mockLoginAsInstructor: () => void;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isInstructor: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAIL = 'alluhemanth5063@gmail.com';

const createOrGetUserProfile = async (user: User, role: UserRole = 'student'): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  // Automatically promote official admin email if it's not already admin
  const effectiveRole = user.email === ADMIN_EMAIL ? 'admin' : role;

  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    // Ensure official admin always has admin role even if Firestore says otherwise
    if (user.email === ADMIN_EMAIL && data.role !== 'admin') {
      const updatedProfile = { ...data, role: 'admin' as UserRole };
      await setDoc(userRef, updatedProfile);
      return updatedProfile;
    }
    return data;
  }

  const profile: UserProfile = {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'User',
    photoURL: user.photoURL || undefined,
    role: effectiveRole,
    phone: user.phoneNumber || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(userRef, profile);
  return profile;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMockAdmin, setIsMockAdmin] = useState(() => localStorage.getItem('mockAdmin') === 'true');
  const [isMockInstructor, setIsMockInstructor] = useState(() => localStorage.getItem('mockInstructor') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await createOrGetUserProfile(firebaseUser);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const sendPhoneOTP = async (phone: string, recaptchaContainer: string) => {
    const verifier = new RecaptchaVerifier(auth, recaptchaContainer, { size: 'invisible' });
    return signInWithPhoneNumber(auth, phone, verifier);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const mockLoginAsAdmin = () => {
    setIsMockAdmin(true);
    localStorage.setItem('mockAdmin', 'true');
    setUserProfile({
      id: 'mock-admin-id',
      email: ADMIN_EMAIL,
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const mockLoginAsInstructor = () => {
    setIsMockInstructor(true);
    localStorage.setItem('mockInstructor', 'true');
    setUserProfile({
      id: 'mock-instructor-id',
      email: 'leeleshlee08@gmail.com',
      displayName: 'Instructor User',
      role: 'instructor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    setIsMockAdmin(false);
    setIsMockInstructor(false);
    localStorage.removeItem('mockAdmin');
    localStorage.removeItem('mockInstructor');
    await signOut(auth);
    setUserProfile(null);
  };

  const isAdmin = isMockAdmin || userProfile?.role === 'admin';
  const isInstructor = isMockInstructor || userProfile?.role === 'instructor';

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signInWithGithub,
      sendPhoneOTP,
      signInWithEmail,
      mockLoginAsAdmin,
      mockLoginAsInstructor,
      logout,
      isAdmin,
      isInstructor,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
