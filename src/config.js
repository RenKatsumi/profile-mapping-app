// src/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyAwONLfKKisl-Ho2UEYavxQrVA42k209Ok',
  authDomain: 'profilemappingapp1.firebaseapp.com',
  projectId: 'profilemappingapp1',
  storageBucket: 'profilemappingapp1.firebasestorage.app',
  messagingSenderId: '589171427955',
  appId: '1:589171427955:web:bd984f034f4f3d55d4f806',
  measurementId: 'G-0XXPK4GRM9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
const db = getFirestore(app);

// Export db as default
export default db;
