import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKSOlrtW_EeCjPoSZimymhWdLXC90TbDc",
  authDomain: "finfreela.firebaseapp.com",
  projectId: "finfreela",
  storageBucket: "finfreela.firebasestorage.app",
  messagingSenderId: "911301529089",
  appId: "1:911301529089:web:bffaa388c7ccdabb96ba00"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);