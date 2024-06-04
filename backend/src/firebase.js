// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWsWznD4P6WzQxUPA-XygHzFLf_qIkG7o",
  authDomain: "zeroanonymity-13.firebaseapp.com",
  projectId: "zeroanonymity-13",
  storageBucket: "zeroanonymity-13.appspot.com",
  messagingSenderId: "647521720140",
  appId: "1:647521720140:web:e6f37feacfbba1170e21e9",
  measurementId: "G-7KLK0B99YN",
  databaseURL: "https://zeroanonymity-13-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
