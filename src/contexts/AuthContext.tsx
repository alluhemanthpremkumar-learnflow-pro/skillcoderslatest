import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
  logout: () => Promise<void>;
  isAdmin: boolean;
  isInstructor: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const createOrGetUserProfile = async (user: User, role: UserRole = 'student'): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'User',
    photoURL: user.photoURL || undefined,
    role,
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

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === 'admin';
  const isInstructor = userProfile?.role === 'instructor';

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signInWithGithub,
      sendPhoneOTP,
      logout,
      isAdmin,
      isInstructor,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
