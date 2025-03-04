// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth, getReactNativePersistence}  from 'firebase/auth';
import { ReactNativeAsyncStorage } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});