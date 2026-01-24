import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  completedChallenges: string[];
  carbonFootprint: number | null;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  setCarbonFootprint: (footprint: number) => void;
  spendPoints: (points: number) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in production, this would hit an API
    if (email && password) {
      const savedUser = localStorage.getItem(`user_${email}`);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        return true;
      }
      // Demo login
      setUser({
        id: '1',
        name: email.split('@')[0],
        email,
        points: 100,
        completedChallenges: [],
        carbonFootprint: null,
      });
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    if (name && email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        points: 50, // Starting bonus
        completedChallenges: [],
        carbonFootprint: null,
      };
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user) {
      localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
    }
    setUser(null);
  };

  const addPoints = (points: number) => {
    if (user) {
      setUser({ ...user, points: user.points + points });
    }
  };

  const completeChallenge = (challengeId: string) => {
    if (user && !user.completedChallenges.includes(challengeId)) {
      setUser({
        ...user,
        completedChallenges: [...user.completedChallenges, challengeId],
      });
    }
  };

  const setCarbonFootprint = (footprint: number) => {
    if (user) {
      setUser({ ...user, carbonFootprint: footprint });
    }
  };

  const spendPoints = (points: number): boolean => {
    if (user && user.points >= points) {
      setUser({ ...user, points: user.points - points });
      return true;
    }
    return false;
  };

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
