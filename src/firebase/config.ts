import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

/**
 * Firebase Configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 * 
 * All services are initialized:
 * - Authentication (Email, Google, GitHub, Phone)
 * - Firestore (Database)
 * - Storage (File uploads, certificates)
 * - Analytics (Usage tracking)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAeC19EdIEguzrzb5QCQXlf17-GEPvo6eY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skill-coders-48476.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skill-coders-48476",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skill-coders-48476.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "406339300833",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:406339300833:web:283903626c0c68999676a0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6729JQN6M6",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Authentication Service
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Storage Service
export const storage = getStorage(app);

// Initialize Analytics (optional, only if supported in browser)
let analytics: any = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };
export default app;
