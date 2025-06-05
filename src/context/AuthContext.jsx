// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // Import axios to set default header
import { getUserProfile } from '../api/userApi'; // Import API to fetch profile

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create a provider component
export const AuthProvider = ({ children }) => {
  // State for the actual token
  const [token, setToken] = useState(null);
  // State to track if the initial auth check is done
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  // State for the authenticated user object
  const [user, setUser] = useState(null);

  // Effect to check localStorage for token on initial load AND validate it
  useEffect(() => {
    console.log("AuthProvider: Checking for existing token...");
    const validateToken = async () => {
      setIsLoadingAuth(true);
      const storedUserInfoString = localStorage.getItem('userInfo'); // Use 'userInfo'
      let storedToken = null;
      let storedUser = null;

      if (storedUserInfoString) {
        try {
          const storedUserInfo = JSON.parse(storedUserInfoString);
          storedToken = storedUserInfo.token;
          storedUser = storedUserInfo.user; // Assuming user object is stored
        } catch (e) {
          console.error("AuthProvider: Failed to parse stored userInfo", e);
          localStorage.removeItem('userInfo'); // Clear invalid item
        }
      }

      if (!storedToken || !storedUser) { // Check for both token and user
        console.log("AuthProvider: No valid token or user found in localStorage.");
        setToken(null);
        setUser(null);
        setIsLoadingAuth(false); // Finish loading
        return;
      }

      console.log("AuthProvider: Found token, attempting validation...");
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`; // Set default for future requests
      setUser(storedUser); // Optimistically set user, will be overwritten or cleared

      try {
        const userDataFromApi = await getUserProfile();
        console.log("AuthProvider: Token validation successful, user data:", userDataFromApi);
        setUser(userDataFromApi); // Update user with fresh data from the API
        // Token is already set, axios default header is already set
        localStorage.setItem('userInfo', JSON.stringify({ token: storedToken, user: userDataFromApi }));
      } catch (error) {
        console.error("AuthProvider: Token validation failed:", error.message);
        localStorage.removeItem('userInfo');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setIsLoadingAuth(false);
        console.log("AuthProvider: Auth check complete.");
      }
    };

    validateToken();
  }, []);

  const login = (tokenString, userData) => {
    console.log("AuthContext: login function CALLED.");
    if (typeof tokenString !== 'string' || tokenString.trim().length === 0) {
      console.error("AuthContext login function received invalid token:", tokenString);
      return;
    }
    if (!userData || typeof userData !== 'object') {
      console.error("AuthContext login function received invalid userData:", userData);
      return;
    }
    console.log("AuthContext: Attempting to set token:", tokenString);
    console.log("AuthContext: Attempting to set user data:", JSON.stringify(userData, null, 2));

    const userInfoToStore = { token: tokenString, user: userData };
    localStorage.setItem('userInfo', JSON.stringify(userInfoToStore));
    setToken(tokenString);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenString}`;

    console.log("AuthContext: localStorage 'userInfo' AFTER setItem:", localStorage.getItem('userInfo'));
  };

  const logout = () => {
    console.log("Logging out via context...");
    localStorage.removeItem('userInfo');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Function to update parts of the user object in context and localStorage
  const updateUserContext = (updatedUserDetails) => {
    setUser(prevUser => {
      if (!prevUser) return null; // Should not happen if user is logged in

      const newUserState = { ...prevUser, ...updatedUserDetails };

      // Update localStorage as well
      const storedUserInfoString = localStorage.getItem('userInfo');
      if (storedUserInfoString) {
        try {
          const storedUserInfo = JSON.parse(storedUserInfoString);
          localStorage.setItem('userInfo', JSON.stringify({
            ...storedUserInfo, // Keep existing token and other non-user parts
            user: newUserState,
          }));
          console.log("AuthContext: User context and localStorage updated with:", updatedUserDetails);
        } catch (e) {
          console.error("AuthContext: Failed to update localStorage during user context update", e);
        }
      }
      return newUserState;
    });
  };

  // Value provided to consuming components
  const value = {
    token,
    isLoggedIn: !!token && !!user,
    isLoadingAuth,
    login,
    logout,
    user,
    updateUserContext, // Expose the new function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook to use the context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
