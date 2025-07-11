import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase'; // adjust path if needed
import { signIn, signUp, logout, getCurrentUserId } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser({ uid: user.uid, email: user.email });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
