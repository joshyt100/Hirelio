import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/types/AuthContextTypes';
import axios from 'axios';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Function to check authentication status
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user/', {
        withCredentials: true,
      });

      if (response.data && response.data.isAuthenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to login
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to logout
  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Check auth status on initial load and when dependencies change
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Provide the auth context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
