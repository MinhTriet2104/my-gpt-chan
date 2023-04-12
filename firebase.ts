import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAeiz_g-L0vPLAFCVgH9o47F8YDx-hNWio",
	authDomain: "gpt-chan.firebaseapp.com",
	databaseURL: "https://gpt-chan-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "gpt-chan",
	storageBucket: "gpt-chan.appspot.com",
	messagingSenderId: "421931247384",
	appId: "1:421931247384:web:2b05cd5a7e72aaf8b1606d",
	measurementId: "G-NVNL1ELGRE"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };