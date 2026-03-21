/**
 * Enhanced AuthContext with Backend API Integration
 * 
 * This is an example of how to integrate your AuthContext with the backend API.
 * Choose one of the approaches based on your backend architecture:
 * 
 * Option 1: Keep Firebase, add backend sync
 * Option 2: Replace Firebase with custom backend auth
 */

// ==================== OPTION 1: HYBRID (Firebase + Backend) ====================
/**
 * Recommended for gradual migration or if using Firebase for some services
 * 
 * Benefits:
 * - Keep existing Firebase functionality
 * - Add backend API integration
 * - Sync user data between systems
 * 
 * The flow:
 * 1. User logs in with Firebase
 * 2. Get Firebase token
 * 3. Exchange for backend token
 * 4. Store both tokens
 * 5. Use backend API for data, Firebase for auth
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { apiClient } from '@/services';
import type { UserProfile } from '@/types';

interface ExtendedAuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isInstructor: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
}

const ExtendedAuthContext = createContext<ExtendedAuthContextType>({} as ExtendedAuthContextType);

export const useExtendedAuth = () => useContext(ExtendedAuthContext);

/**
 * Example usage:
 * 
 * export const ExtendedAuthProvider = ({ children }: { children: ReactNode }) => {
 *   const [user, setUser] = useState<User | null>(null);
 *   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
 *   const [loading, setLoading] = useState(true);
 *   const [token, setToken] = useState<string | null>(null);
 * 
 *   useEffect(() => {
 *     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
 *       setUser(firebaseUser);
 *       if (firebaseUser) {
 *         try {
 *           // Get Firebase token
 *           const firebaseToken = await firebaseUser.getIdToken();
 *           
 *           // Exchange for backend token
 *           const response = await apiClient.post('/auth/sync-firebase', {
 *             firebaseUser: {
 *               uid: firebaseUser.uid,
 *               email: firebaseUser.email,
 *               displayName: firebaseUser.displayName,
 *             },
 *             firebaseToken,
 *           });
 *           
 *           if (response.success && response.data?.token) {
 *             apiClient.setToken(response.data.token);
 *             setToken(response.data.token);
 *           }
 *           
 *           // Fetch extended user profile from backend
 *           if (response.data?.user) {
 *             setUserProfile(response.data.user);
 *           }
 *         } catch (err) {
 *           console.error('Error syncing with backend:', err);
 *         }
 *       } else {
 *         setUserProfile(null);
 *         setToken(null);
 *         apiClient.setToken(null);
 *       }
 *       setLoading(false);
 *     });
 * 
 *     return unsubscribe;
 *   }, []);
 * 
 *   const logout = async () => {
 *     await signOut(auth);
 *     setUserProfile(null);
 *     setToken(null);
 *     apiClient.setToken(null);
 *     
 *     // Notify backend
 *     await apiClient.post('/auth/logout');
 *   };
 * 
 *   const isAdmin = userProfile?.role === 'admin';
 *   const isInstructor = userProfile?.role === 'instructor';
 * 
 *   return (
 *     <ExtendedAuthContext.Provider value={{
 *       user,
 *       userProfile,
 *       loading,
 *       logout,
 *       isAdmin,
 *       isInstructor,
 *       token,
 *       setToken,
 *     }}>
 *       {children}
 *     </ExtendedAuthContext.Provider>
 *   );
 * };
 */

// ==================== OPTION 2: PURE BACKEND AUTH ====================
/**
 * Complete replacement of Firebase with custom backend auth
 * 
 * Benefits:
 * - Full control over authentication
 * - Consistent backend integration
 * - Can use any auth method (email/password, OAuth, etc.)
 * 
 * Backend requirements:
 * - POST /api/auth/login - returns { token, user }
 * - POST /api/auth/register - returns { token, user }
 * - GET /api/auth/profile - returns user profile
 * - POST /api/auth/logout
 */

interface PureBackendAuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Record<string, unknown>) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isInstructor: boolean;
  token: string | null;
}

const PureBackendAuthContext = createContext<PureBackendAuthContextType>({} as PureBackendAuthContextType);

export const usePureBackendAuth = () => useContext(PureBackendAuthContext);

/**
 * Example implementation:
 * 
 * export const PureBackendAuthProvider = ({ children }: { children: ReactNode }) => {
 *   const [user, setUser] = useState<UserProfile | null>(null);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState<string | null>(null);
 *   const [token, setToken] = useState<string | null>(() => {
 *     return localStorage.getItem('authToken');
 *   });
 * 
 *   // Check if user is logged in on mount
 *   useEffect(() => {
 *     const checkAuth = async () => {
 *       if (token) {
 *         apiClient.setToken(token);
 *         const response = await apiClient.get('/auth/profile');
 *         
 *         if (response.success) {
 *           setUser(response.data as UserProfile);
 *         } else {
 *           setToken(null);
 *           apiClient.setToken(null);
 *         }
 *       }
 *       setLoading(false);
 *     };
 * 
 *     checkAuth();
 *   }, []);
 * 
 *   const login = async (email: string, password: string): Promise<boolean> => {
 *     setError(null);
 *     try {
 *       const response = await apiClient.post('/auth/login', { email, password });
 *       
 *       if (response.success && response.data?.token) {
 *         apiClient.setToken(response.data.token);
 *         setToken(response.data.token);
 *         setUser(response.data.user);
 *         return true;
 *       } else {
 *         setError(response.error || 'Login failed');
 *         return false;
 *       }
 *     } catch (err) {
 *       const message = err instanceof Error ? err.message : 'Login error';
 *       setError(message);
 *       return false;
 *     }
 *   };
 * 
 *   const register = async (data: any): Promise<boolean> => {
 *     setError(null);
 *     try {
 *       const response = await apiClient.post('/auth/register', data);
 *       
 *       if (response.success && response.data?.token) {
 *         apiClient.setToken(response.data.token);
 *         setToken(response.data.token);
 *         setUser(response.data.user);
 *         return true;
 *       } else {
 *         setError(response.error || 'Registration failed');
 *         return false;
 *       }
 *     } catch (err) {
 *       const message = err instanceof Error ? err.message : 'Registration error';
 *       setError(message);
 *       return false;
 *     }
 *   };
 * 
 *   const logout = async () => {
 *     await apiClient.post('/auth/logout');
 *     setUser(null);
 *     setToken(null);
 *     apiClient.setToken(null);
 *   };
 * 
 *   const isAdmin = user?.role === 'admin';
 *   const isInstructor = user?.role === 'instructor';
 * 
 *   return (
 *     <PureBackendAuthContext.Provider value={{
 *       user,
 *       loading,
 *       error,
 *       login,
 *       register,
 *       logout,
 *       isAdmin,
 *       isInstructor,
 *       token,
 *     }}>
 *       {children}
 *     </PureBackendAuthContext.Provider>
 *   );
 * };
 */

// ==================== IMPLEMENTATION STEPS ====================
/**
 * Step 1: Choose your approach (Option 1 or Option 2)
 * 
 * Step 2: Copy the code into src/contexts/AuthContext.tsx
 * 
 * Step 3: Update App.tsx provider hierarchy:
 *   - QueryClientProvider (outermost)
 *     - PureBackendAuthProvider
 *       - BrowserRouter
 *         - AuthProvider
 *           - Your routes
 * 
 * Step 4: Update components using auth:
 *   - Before: useAuth() [Firebase]
 *   - After: usePureBackendAuth() [Backend API]
 * 
 * Step 5: Test authentication flow
 * 
 * Step 6: Replace Firebase calls with API calls throughout the app
 */

export {};
