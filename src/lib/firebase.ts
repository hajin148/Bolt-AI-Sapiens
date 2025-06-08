import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAJ8AZnI_6OT38mV8FOZIqSxSMg6QCsVC4",
  authDomain: "ai-sapiens-bolt.firebaseapp.com",
  projectId: "ai-sapiens-bolt",
  storageBucket: "ai-sapiens-bolt.firebasestorage.app",
  messagingSenderId: "950428126244",
  appId: "1:950428126244:web:6106120b8889c12ce0dcb1",
  databaseURL: "https://ai-sapiens-bolt-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);