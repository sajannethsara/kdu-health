// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWXlupV1aVszJG2YtmeIf-fnGtlQ5d2Ds",
  authDomain: "kdu-health.firebaseapp.com",
  projectId: "kdu-health",
  storageBucket: "kdu-health.firebasestorage.app",
  messagingSenderId: "327125413129",
  appId: "1:327125413129:web:081484da0247fbb4fd77d8"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);