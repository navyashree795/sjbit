// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
