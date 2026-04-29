// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC295ZCOb7tXpT0RpT0Ezi8_gXbgiZU0ns",
  authDomain: "adaptly-524b9.firebaseapp.com",
  projectId: "adaptly-524b9",
  storageBucket: "adaptly-524b9.firebasestorage.app",
  messagingSenderId: "679466843497",
  appId: "1:679466843497:web:12ef13d0f9e9d6e2b051f8",
  measurementId: "G-74NB3VB0P3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);