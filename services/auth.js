import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';

export const loginWithGoogleFirebase = async (idToken, accessToken) => {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential); // logs in to Firebase
};
