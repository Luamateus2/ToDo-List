import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbyjE9DYpby3ShuxoPFF4SDvTyHlifoRY",
  authDomain: "luatask.firebaseapp.com",
  projectId: "luatask",
  storageBucket: "luatask.firebasestorage.app",
  messagingSenderId: "630035217655",
  appId: "1:630035217655:web:35644adee238c0379ba7f2",
  measurementId: "G-JB0JDWP71R"
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore 👈 AGORA SIM
export const db = getFirestore(app);

export default app;
