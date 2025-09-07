import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      // Admin authentication (mock)
      if (email === 'admin@campus.edu' && password === 'admin123') {
        const userData = {
          id: '1',
          name: 'Admin User',
          email: 'admin@campus.edu',
          type: 'admin',
          college_id: '1'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      // Student authentication - fetch real student data from API
      if (userType === 'student') {
        try {
          const response = await fetch(`http://localhost:5000/api/students?email=${encodeURIComponent(email)}`);
          if (response.ok) {
            const studentData = await response.json();
            // Simple password validation (in real app, this would be done on backend)
            if (password === 'student123') {
              const userData = {
                ...studentData,
                type: 'student'
              };
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              return { success: true, user: userData };
            } else {
              return { success: false, error: 'Invalid password' };
            }
          } else {
            // If specific student not found, try to get any student for demo purposes
            if (email === 'student@campus.edu') {
              try {
                const allStudentsResponse = await fetch('http://localhost:5000/api/students');
                if (allStudentsResponse.ok) {
                  const allStudents = await allStudentsResponse.json();
                  if (allStudents.length > 0 && password === 'student123') {
                    const firstStudent = allStudents[0];
                    const userData = {
                      ...firstStudent,
                      type: 'student',
                      email: 'student@campus.edu', // Keep the login email
                      name: 'Demo Student'
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    return { success: true, user: userData };
                  }
                }
              } catch (fallbackError) {
                console.error('Fallback authentication failed:', fallbackError);
              }
            }
            return { success: false, error: 'Student not found' };
          }
        } catch (apiError) {
          return { success: false, error: 'Failed to verify student credentials' };
        }
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
