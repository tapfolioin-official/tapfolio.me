import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCKHc3Gt5zosmGmTVzc-LLSR42e8Gjbedc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tapfolio-d39fa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tapfolio-d39fa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tapfolio-d39fa.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "533947683458",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:533947683458:web:ee2ab6597c85bf5e811a9b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E0MSYNBHWT"
};

// Initialize Firebase (singleton pattern for Next.js SSR)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (runs on client-side only when supported)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
