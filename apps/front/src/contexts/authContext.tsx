import { isAxiosError } from "axios";
import { t } from "../i18n/i18n-helper";
import { useNavigate } from "react-router";
import React, { createContext, useContext, useEffect, useState } from "react";

import type { AuthUser } from "../types/user";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { useNotification } from "./notificationContext";
import { AuthService } from "../services/api/authService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAuthLoading: boolean;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const { showInfo } = useNotification();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

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
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await authService.logout();

    setUser(null);
    navigate("/", { replace: true });
    showInfo(t("common.goodbye"), t("auth.success.disconnected"), 3000);
  };

  const contextValues: AuthContextType = {
    user,
    setUser,
    isAuthLoading,
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
