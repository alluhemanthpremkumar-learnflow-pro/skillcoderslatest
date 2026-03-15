import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyReplace",
  authDomain: "skill-coders-2025.firebaseapp.com",
  projectId: "skill-coders-2025",
  storageBucket: "skill-coders-2025.firebasestorage.app",
  messagingSenderId: "246429310624",
  appId: "1:246429310624:web:8c9688ee467c160a5133c5",
  measurementId: "G-FWHRNEGEXX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
