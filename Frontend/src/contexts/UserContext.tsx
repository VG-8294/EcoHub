import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  totalRewardCoins?: number;
  currentCarbonFootprint?: number | null;
  isAdmin?: boolean;
  mobileNumber?: string;
  dob?: string;
  completedChallenges?: string[];
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, mobileNumber: string, dob: string) => Promise<boolean>;
  logout: () => void;
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  setCarbonFootprint: (footprint: number) => void;
  spendPoints: (points: number) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from stored token on mount
  useEffect(() => {
    const token = authService.getToken();
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(email, password);
      authService.setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    mobileNumber: string,
    dob: string
  ): Promise<boolean> => {
    try {
      const data = await authService.register(name, email, password, mobileNumber, dob);
      // Now register returns a token like login does
      if (data.token) {
        authService.setToken(data.token);
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    authService.removeToken();
    localStorage.removeItem('user');
    setUser(null);
  };

  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, totalRewardCoins: (user.totalRewardCoins || 0) + points };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const completeChallenge = (challengeId: string) => {
    if (user) {
      const completedChallenges = user.completedChallenges || [];
      if (!completedChallenges.includes(challengeId)) {
        const updatedUser = {
          ...user,
          completedChallenges: [...completedChallenges, challengeId],
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  const setCarbonFootprint = (footprint: number) => {
    if (user) {
      const updatedUser = { ...user, currentCarbonFootprint: footprint };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const spendPoints = (points: number): boolean => {
    if (user && (user.totalRewardCoins || 0) >= points) {
      const updatedUser = { ...user, totalRewardCoins: (user.totalRewardCoins || 0) - points };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  if (!isInitialized) {
    return null; // or a loading component
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        addPoints,
        completeChallenge,
        setCarbonFootprint,
        spendPoints,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
