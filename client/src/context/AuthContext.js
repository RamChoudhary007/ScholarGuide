import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      // Set the authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch user data from the server
      axios.get('/api/auth/me')
        .then(async (response) => {
          let userData = response.data;

          // If user is a mentor, fetch mentor-specific data
          if (userData.role === 'mentor') {
            try {
              const mentorResponse = await axios.get('/api/mentors/me');
              userData = { ...userData, ...mentorResponse.data };
            } catch (mentorError) {
              console.error('Error fetching mentor data:', mentorError);
            }
          }

          setCurrentUser(userData);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          // If there's an error, remove the invalid token
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch complete user data including mentor fields if applicable
      let userData = user;
      if (user.role === 'mentor') {
        try {
          const mentorResponse = await axios.get('/api/mentors/me');
          userData = { ...user, ...mentorResponse.data };
        } catch (mentorError) {
          console.error('Error fetching mentor data:', mentorError);
        }
      }

      // Update current user state
      setCurrentUser(userData);

      return userData;
    } catch (error) {
      console.error('Login error details:', error);

      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        throw new Error('Login failed: ' + error.message);
      }
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Registration error details:', error);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        throw new Error('Registration failed: ' + error.message);
      }
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Update user function
  const updateUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      let userData = response.data;

      // If user is a mentor, fetch mentor-specific data
      if (userData.role === 'mentor') {
        const mentorResponse = await axios.get('/api/mentors/me');
        userData = { ...userData, ...mentorResponse.data };
      }

      setCurrentUser({ ...userData, _lastUpdated: Date.now() });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  // Value object that will be passed to consumers
  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};