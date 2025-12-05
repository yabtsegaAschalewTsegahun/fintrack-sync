import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getAccessToken, clearTokens } from '@/lib/api';

interface User {
  username: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getAccessToken();
    if (token) {
      // In a real app, you'd validate the token or fetch user data
      setUser({ username: 'User' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    await authApi.login(username, password);
    setUser({ username });
  };

  const signup = async (data: {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }) => {
    await authApi.signup(data);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authApi.resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
