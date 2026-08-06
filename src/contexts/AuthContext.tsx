import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hospitalName: string;
  department: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, passwordPlain: string) => Promise<{ success: boolean; message?: string }>;
  createAccount: (data: any) => Promise<{ success: boolean; message?: string }>;
  registerHospital: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  sessionTimeLeft: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('sepsissense_access_token'));
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(900); // 15 minutes

  // Auto restore session on mount if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('sepsissense_access_token');
    if (savedToken && !user) {
      fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const userData = data.data;
            setUser({
              id: userData.id,
              name: userData.fullName,
              email: userData.email,
              role: (userData.role ? userData.role.toLowerCase() : 'doctor') as UserRole,
              hospitalName: userData.hospitalName || 'Johns Hopkins Health System',
              department: userData.department || 'ICU'
            });
            setAccessToken(savedToken);
          }
        })
        .catch(() => {
          localStorage.removeItem('sepsissense_access_token');
        });
    }
  }, []);

  // Auto Session Timeout Countdown
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          logout();
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const login = async (email: string, passwordPlain: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordPlain })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Invalid email or password.'
        };
      }

      const userData = data.data.user;
      const authenticatedUser: AuthUser = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userData.role as UserRole,
        hospitalName: userData.hospitalName,
        department: userData.role === 'doctor' || userData.role === 'nurse' ? 'ICU' : 'Operations'
      };

      setUser(authenticatedUser);
      setAccessToken(data.data.token);
      localStorage.setItem('sepsissense_access_token', data.data.token);
      localStorage.setItem('sepsissense_refresh_token', data.data.refreshToken);
      setSessionTimeLeft(900);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: 'Backend server unreachable. Please check connection to http://localhost:5000'
      };
    }
  };

  const createAccount = async (data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/v1/auth/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        return {
          success: false,
          message: resData.message || 'Account creation failed.'
        };
      }

      return {
        success: true,
        message: resData.message || 'Account created successfully! Please sign in with your credentials.'
      };
    } catch (err: any) {
      return { success: false, message: 'Backend service unreachable. Check connection to server.' };
    }
  };

  const registerHospital = async (data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/v1/auth/register-hospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        return {
          success: false,
          message: resData.message || 'Hospital registration failed.'
        };
      }

      return { 
        success: true, 
        message: resData.message || 'Hospital network registered successfully. Please sign in with your admin credentials.' 
      };
    } catch (err: any) {
      return { success: false, message: 'Backend service unreachable. Check server on http://localhost:5000' };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('sepsissense_access_token');
    localStorage.removeItem('sepsissense_refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        accessToken,
        login,
        createAccount,
        registerHospital,
        logout,
        sessionTimeLeft
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
