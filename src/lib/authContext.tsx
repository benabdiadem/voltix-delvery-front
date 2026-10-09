'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'COURIER' | 'CLIENT';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('voltix_admin_access_token');
    const savedUser = localStorage.getItem('voltix_admin_user');

    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'ADMIN') {
          setUser(parsed);
        } else {
          localStorage.removeItem('voltix_admin_access_token');
          localStorage.removeItem('voltix_admin_user');
        }
      } catch {
        localStorage.removeItem('voltix_admin_access_token');
        localStorage.removeItem('voltix_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('voltix_admin_access_token', token);
    localStorage.setItem('voltix_admin_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('voltix_admin_access_token');
    localStorage.removeItem('voltix_admin_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

