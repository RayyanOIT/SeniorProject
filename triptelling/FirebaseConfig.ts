// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaMBoQ4wnIvARsq3TwYpEfdi5jEQ2V1h0",
  authDomain: "triptelligent-24e40.firebaseapp.com",
  projectId: "triptelligent-24e40",
  storageBucket: "triptelligent-24e40.firebasestorage.app",
  messagingSenderId: "160220500329",
  appId: "1:160220500329:web:d7c4d9b4a723179866edf8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
