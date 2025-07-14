// services/user.js
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function storeGoogleUserData(user) {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
      interests: [],
      age: null,
    });
    console.log('📁 User profile created');
  }
  else {
    console.log('User already exists');
  }
}
