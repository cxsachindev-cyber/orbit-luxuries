// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAL-F2ujiBjZ9hcZW2Uqe8_PfxeRG_qR24",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "orbit-luxuries-cb440.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "orbit-luxuries-cb440",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "orbit-luxuries-cb440.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "168524588812",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:168524588812:web:95b5f07de1acd7dfd34b29"
};

// ✅ The Clean, Type-Safe Initialization Pattern
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };