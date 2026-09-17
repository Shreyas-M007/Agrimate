// MandiMate Firebase Configuration & Offline Firestore Setup
// Implements Cloud Firestore with persistent offline caching

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  type Firestore 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyMandiMateSparkPlan2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mandimate-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mandimate-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mandimate-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "108374928172",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:108374928172:web:a9841f38bc38d94e"
};

let app: FirebaseApp;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Enable persistent local cache for zero-latency offline farmer access
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("[Firebase] Initializing fallback client:", e);
  app = {} as FirebaseApp;
  db = {} as Firestore;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY);
}

export function getFirebaseConfig() {
  return {
    provider: "Google Firebase (Spark Free Plan)",
    projectId: firebaseConfig.projectId,
    features: ["Cloud Firestore", "Firebase Hosting", "Firebase AI Logic / Gemini", "Offline Cache"],
    isConfigured: isFirebaseConfigured()
  };
}

export { app, db };
