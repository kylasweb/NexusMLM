import { createContext } from 'react';

interface AuthContextType {
  user: any; // Replace 'any' with your user type
  signIn: (credentials: any) => Promise<void>; // Add proper types
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>; // Add proper types
}

export const AuthContext = createContext<AuthContextType | null>(null);