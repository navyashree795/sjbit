import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC295ZCOb7tXpT0RpT0Ezi8_gXbgiZU0ns",
  authDomain: "adaptly-524b9.firebaseapp.com",
  databaseURL: "https://adaptly-524b9-default-rtdb.firebaseio.com",
  projectId: "adaptly-524b9",
  storageBucket: "adaptly-524b9.firebasestorage.app",
  messagingSenderId: "679466843497",
  appId: "1:679466843497:web:12ef13d0f9e9d6e2b051f8",
  measurementId: "G-74NB3VB0P3"
};

let app, auth, db;

if (getApps().length === 0) {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  // Initialize Firebase Auth with React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  // Use existing Firebase instances during Fast Refresh
  app = getApp();
  auth = getAuth(app);
}

// Initialize Firestore
db = getFirestore(app);

export { app, auth, db }; 