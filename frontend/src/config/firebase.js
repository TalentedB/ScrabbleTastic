// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-zUlXc1lZ1P3lo716rB72-dvlbg7PNto",
  authDomain: "scrabbletastic-6f7a1.firebaseapp.com",
  projectId: "scrabbletastic-6f7a1",
  storageBucket: "scrabbletastic-6f7a1.firebasestorage.app",
  messagingSenderId: "948579694152",
  appId: "1:948579694152:web:589444214eebf95793ca7d",
  measurementId: "G-6Q9PFGM3VM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
