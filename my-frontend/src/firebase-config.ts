// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5VkTeYNsCbfBe-JIVkCs_3ROEguzM1aw",
  authDomain: "full-stack-app-127be.firebaseapp.com",
  projectId: "full-stack-app-127be",
  storageBucket: "full-stack-app-127be.firebasestorage.app",
  messagingSenderId: "294515905140",
  appId: "1:294515905140:web:f6e754775b9ce65fcaf721",
  measurementId: "G-NZ5RZ2VH3W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app); // Initialize Firebase Authentication