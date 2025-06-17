import React, { createContext, useEffect, useState } from 'react';

// Creating the context to manage authentication state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Check localStorage for token when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && storedToken !== 'null') {
      setToken(storedToken);
    } else {
      setToken(null); // If no valid token found, set token to null
    }
  }, []);

  // Function to log in the user and store the token
  const loginUser = (newToken) => {
    if (newToken && typeof newToken === 'string') {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      console.error("Invalid token provided.");
    }
  };

  // Function to log out the user and remove the token
  const logoutUser = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('access_token', access);
    // localStorage.removeItem('refresh_token', refresh);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
