import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDD6QRvw60cG6pRfxnnAMGQwi2uYexGqEU",
  authDomain: "mockup-f0f01.firebaseapp.com",
  projectId: "mockup-f0f01",
  storageBucket: "mockup-f0f01.firebasestorage.app",
  messagingSenderId: "221470090937",
  appId: "1:221470090937:web:cd67f59b838ed8c713dd68"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'us-central1');

// Uncomment for local development
// connectFunctionsEmulator(functions, 'localhost', 5001);