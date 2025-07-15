// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { VITE_API_KEY, VITE_PROJECT_ID } from '@env'
// import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: VITE_API_KEY,
  projectId: VITE_PROJECT_ID,
};
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_PROJECT_ID + '.firebaseapp.com',
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_PROJECT_ID + ".appspot.com",
// };

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// export const auth = initializeAuth(firebaseApp, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
