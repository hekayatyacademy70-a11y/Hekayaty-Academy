import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'Guest' | 'Student' | 'Instructor' | 'Reviewer' | 'Parent' | 'Admin' | 'SuperAdmin';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  user: any | null;
}

const AuthContext = createContext<AuthContextType>({
  role: 'Guest',
  setRole: () => {},
  isAuthenticated: false,
  user: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('hekayaty-role') as Role) || 'Guest';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('hekayaty-role', newRole);
  };

  const user = role !== 'Guest' ? {
    name: 'محمد الشريف',
    email: 'mohamed@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  } : null;

  return (
    <AuthContext.Provider value={{
      role,
      setRole,
      isAuthenticated: role !== 'Guest',
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
