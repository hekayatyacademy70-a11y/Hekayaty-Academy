import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGetAuthMe, setAuthTokenGetter, getGetAuthMeQueryKey } from '@workspace/api-client-react';

// Configure the custom fetcher to always inject our token
setAuthTokenGetter(() => localStorage.getItem('hekayaty-token'));

export type Role = 'guest' | 'student' | 'instructor' | 'reviewer' | 'parent' | 'admin' | 'superadmin';

interface AuthContextType {
  role: Role;
  isAuthenticated: boolean;
  user: any | null;
  setToken: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: 'guest',
  isAuthenticated: false,
  user: null,
  setToken: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('hekayaty-token'));

  // Fetch the user from the backend API if we have a token
  const { data: user, isLoading, error } = useGetAuthMe({
    query: {
      queryKey: getGetAuthMeQueryKey(),
      enabled: !!token,
      retry: false, // Don't retry if unauthorized
    }
  });

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('hekayaty-token', newToken);
  };

  const logout = () => {
    setTokenState(null);
    localStorage.removeItem('hekayaty-token');
    window.location.href = "/";
  };

  // If token is invalid/expired, log out automatically
  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error]);

  const role = user?.role || 'guest';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      role: role as Role,
      isAuthenticated,
      user: user || null,
      setToken,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
