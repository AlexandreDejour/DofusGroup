import { useNavigate } from "react-router";
import React, { createContext, useContext } from "react";
import { useTypedTranslation } from "../i18n/i18n-helper";

import type { AuthUser } from "../types/user";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { useNotification } from "./notificationContext";
import { AuthService } from "../services/api/authService";
import useFetchAuthUser from "../hooks/useFetchAuthUser";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const authService = new AuthService(axios);

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isLoading: boolean;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  const { showInfo } = useNotification();
  const { user, setUser, isLoading } = useFetchAuthUser();

  const logout = async () => {
    await authService.logout();

    setUser(null);
    navigate("/", { replace: true });
    showInfo(t("common.goodbye"), t("auth.success.disconnected"), 3000);
  };

  const contextValues: AuthContextType = {
    user,
    setUser,
    isLoading,
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
