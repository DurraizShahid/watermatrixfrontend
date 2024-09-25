// File: /context/AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  UserId: string;
  login: (UserId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UserId, setUserId] = useState('');

  const login = (id: string) => {
    setIsLoggedIn(true);
    setUserId(id);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, UserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
