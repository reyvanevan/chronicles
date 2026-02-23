import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNlRbW_S34r4m3RGOhutNW1p8GAoB7YeA",
    authDomain: "zalfauniverse-50531.firebaseapp.com",
    projectId: "zalfauniverse-50531",
    storageBucket: "zalfauniverse-50531.firebasestorage.app",
    messagingSenderId: "187990396550",
    appId: "1:187990396550:web:bd3eee6011b3c5a33d8b07",
    measurementId: "G-GMGBCHLN9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { analytics, app, auth, db };

