// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqXMPsIrIIboZsgr5aj0j19uM12GOhre8",
  authDomain: "pantrywisely.firebaseapp.com",
  databaseURL: "https://pantrywisely-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pantrywisely",
  storageBucket: "pantrywisely.firebasestorage.app",
  messagingSenderId: "132015617934",
  appId: "1:132015617934:web:8065f1726a62e7cb3f96df",
  measurementId: "G-84LQCNT2VS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app); 
}

export { db };