// Firebase configuration
// You'll need to replace these with your actual Firebase config values
// Get them from: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// For now, we'll use a mock implementation until Firebase is installed
// Uncomment the lines below once you install Firebase and add your config

/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
*/

// Mock implementation for development
export const auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
        // Mock user for demo
        setTimeout(() => callback(null), 100);
        return () => {}; // unsubscribe function
    }
};

export const db = {};