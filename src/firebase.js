// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQxurdCA33HSgvL7x0jcu_PxLvDL81ePA",
  authDomain: "nuki-slot.firebaseapp.com",
  databaseURL: "https://nuki-slot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nuki-slot",
  storageBucket: "nuki-slot.appspot.com",
  messagingSenderId: "970081205559",
  appId: "1:970081205559:web:7ab0860b4a7c9edd6b6eb2",
  measurementId: "G-9GYV1KDK53",
  databaseURL: "https://nuki-slot-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);