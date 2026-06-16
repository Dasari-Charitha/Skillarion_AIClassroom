import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import type { User } from "firebase/auth";

import { auth, googleProvider } from "../firebase";

type Role = "student" | "teacher" | "hod" | "principal";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (role: Role) => void;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(() => {
    return localStorage.getItem("demoAuth") === "true";
  });

  const [role, setRoleState] = useState<Role | null>(() => {
    return localStorage.getItem("role") as Role | null;
  });

  const isAuthenticated = Boolean(user) || isDemoAuthenticated;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      localStorage.removeItem("demoAuth");
      setIsDemoAuthenticated(false);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const loginAsDemo = (role: Role) => {
    setRole(role);
    setIsDemoAuthenticated(true);
    localStorage.setItem("demoAuth", "true");
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setRoleState(null);
      setIsDemoAuthenticated(false);
      localStorage.removeItem("role");
      localStorage.removeItem("demoAuth");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const setRole = (role: Role) => {
    setRoleState(role);
    localStorage.setItem("role", role);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loginWithGoogle,
        loginAsDemo,
        logout,
        setRole,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
