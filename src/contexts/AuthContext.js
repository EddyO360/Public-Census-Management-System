import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, logAnalyticsEvent } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  async function signup(email, password, role, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, {
        displayName: displayName
      });

      // Store user role in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: email,
        role: role,
        displayName: displayName,
        createdAt: new Date(),
        isActive: true
      });

      // Log analytics event
      logAnalyticsEvent('user_registration', {
        method: 'email',
        role: role
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }

      // Log analytics event
      logAnalyticsEvent('user_login', {
        method: 'email'
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserRole(null);
      
      // Log analytics event
      logAnalyticsEvent('user_logout');
    } catch (error) {
      throw error;
    }
  }

  async function getUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 