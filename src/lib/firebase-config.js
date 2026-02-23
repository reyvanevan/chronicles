import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "AIzaSyBNlRbW_S34r4m3RGOhutNW1p8GAoB7YeA",
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "zalfauniverse-50531.firebaseapp.com",
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "zalfauniverse-50531",
    storageBucket: "zalfauniverse-50531.firebasestorage.app",
    messagingSenderId: "187990396550",
    appId: "1:187990396550:web:bd3eee6011b3c5a33d8b07",
    measurementId: "G-GMGBCHLN9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { analytics, app, auth, db };
