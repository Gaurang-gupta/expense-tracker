import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDDKN_sZkB3b54RC96evsBQbn7HboNunkc",
  authDomain: "expense-tracker-a697e.firebaseapp.com",
  projectId: "expense-tracker-a697e",
  storageBucket: "expense-tracker-a697e.firebasestorage.app",
  messagingSenderId: "684793240554",
  appId: "1:684793240554:web:3a01ff177bc1c19e1a7093",
  measurementId: "G-0BNG8793W7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export { auth, db }