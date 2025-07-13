import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db, logAnalyticsEvent } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  // Validate user data before saving
  const validateUserData = (email, role, displayName) => {
    const errors = [];
    
    if (!email?.trim()) errors.push('Email is required');
    if (!role) errors.push('Role is required');
    if (!displayName?.trim()) errors.push('Display name is required');
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return true;
  };

  async function signup(email, password, role, displayName) {
    try {
      // Validate input data
      validateUserData(email, role, displayName);
      
      // Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, {
        displayName: displayName
      });

      // Store user data in Firestore
      const userDataToSave = {
        email: email.toLowerCase().trim(),
        role: role,
        displayName: displayName.trim(),
        createdAt: serverTimestamp(),
        isActive: true,
        lastUpdated: serverTimestamp()
      };

      await setDoc(doc(db, 'users', result.user.uid), userDataToSave);

      // Log analytics event
      logAnalyticsEvent('user_registration', {
        method: 'email',
        role: role
      });

      return result;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message.includes('Validation failed')) {
        errorMessage = error.message;
      } else {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
      }
      
      throw new Error(errorMessage);
    }
  }

  async function login(email, password) {
    try {
      if (!email?.trim() || !password) {
        throw new Error('Email and password are required.');
      }

      // Authenticate with Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if user is active
        if (!userData.isActive) {
          await signOut(auth);
          throw new Error('Your account has been deactivated. Please contact your administrator.');
        }
        
        setUserRole(userData.role);
        setUserData(userData);
        console.log(`User logged in: ${userData.displayName} (${userData.role})`);
      } else {
        console.warn('User document not found in Firestore');
        setUserRole(null);
        setUserData(null);
        throw new Error('User profile not found. Please contact support.');
      }

      // Log analytics event
      logAnalyticsEvent('user_login', {
        method: 'email',
        role: userDoc.data()?.role
      });

      return { result, userRole: userDoc.data()?.role };
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (error.message.includes('are required') || 
          error.message.includes('not found') || 
          error.message.includes('deactivated')) {
        errorMessage = error.message;
      } else {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
      }
      
      throw new Error(errorMessage);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserRole(null);
      setUserData(null);
      
      // Log analytics event
      logAnalyticsEvent('user_logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  }

  async function getUserRole(uid) {
    try {
      if (!uid) {
        console.warn('No UID provided to getUserRole');
        return null;
      }
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.isActive ? userData.role : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  async function getUserData(uid) {
    try {
      if (!uid) {
        console.warn('No UID provided to getUserData');
        return null;
      }
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const role = await getUserRole(user.uid);
          const userData = await getUserData(user.uid);
          setUserRole(role);
          setUserData(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
          setUserRole(null);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userData,
    signup,
    login,
    logout,
    getUserRole,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 