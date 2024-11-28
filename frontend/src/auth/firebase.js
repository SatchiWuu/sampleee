// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAN7Top9dSYaL0JJ3CUWWprgS4Un4T_KGY",
  authDomain: "juna-b53f1.firebaseapp.com",
  projectId: "juna-b53f1",
  storageBucket: "juna-b53f1.firebasestorage.app",
  messagingSenderId: "497614448304",
  appId: "1:497614448304:web:1720065d9619c9ecf37d75",
  measurementId: "G-LPK14BJ8VS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };