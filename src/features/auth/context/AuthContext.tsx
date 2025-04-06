import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState, LoginRequest, UserRole } from '../types/auth';
import authApi from '../services/authService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Separate hook function declaration for better HMR compatibility
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    role: localStorage.getItem('role') as UserRole | null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    try {
      const profile = await authApi.getUserProfile();
      setState(prev => ({
        ...prev,
        user: profile,
      }));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Don't logout on profile fetch failure, just log the error
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { token, role } = authApi.initializeAuth();
      
      setState(prev => ({
        ...prev,
        role: role as UserRole | null,
        token,
        isAuthenticated: !!token && !!role,
        isLoading: false,
      }));

      // If we have a token, try to fetch the user profile
      if (token) {
        await fetchUserProfile();
      }
    };

    initializeAuth();
  }, []);

  const refreshProfile = async () => {
    if (state.isAuthenticated) {
      await fetchUserProfile();
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const { access, role } = await authApi.login(credentials);
      setState(prev => ({
        ...prev,
        role,
        token: access,
        isAuthenticated: true,
        isLoading: false,
      }));

      // Fetch user profile after successful login
      await fetchUserProfile();

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Redirect based on role
      switch (role) {
        case 'ADMIN':
          navigate('/dashboard');
          break;
        case 'VENDOR':
          navigate('/vendor-dashboard');
          break;
        case 'DRIVER':
          navigate('/driver-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setState({
      role: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!state.role) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(state.role);
    }
    
    return state.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasRole,
        refreshProfile,
      }}
    >
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
}; 