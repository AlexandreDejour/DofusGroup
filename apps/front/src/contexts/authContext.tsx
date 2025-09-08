import React, { createContext, useContext, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import type { AuthUser } from "../types/user";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AuthService } from "../services/api/authService";
import { useNotification } from "./notificationContext";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { showInfo } = useNotification();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.apiMe();
        setUser(response);
      } catch (error) {
        setUser(null);
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);

    showInfo("À bientôt !", "Vous avez été déconnecté(e) avec succès.", 3000);
  };

  const contextValues: AuthContextType = {
    user,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("authModal must be used in authProvider");
  }

  return context;
}
