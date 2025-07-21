import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Your Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAGK_8x2lozqUW3JAvhC_uyZx9xtz2lG",
  authDomain: "censusproject-19593.firebaseapp.com",
  projectId: "censusproject-19593",
  storageBucket: "censusproject-19593.firebasestorage.app",
  messagingSenderId: "223418854227",
  appId: "1:223418854227:web:2460e91379d00f08de0fa6",
  measurementId: "G-JPDJCFH59K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Analytics helper function
export const logAnalyticsEvent = (eventName, parameters = {}) => {
  try {
    logEvent(analytics, eventName, parameters);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

export default app; 
