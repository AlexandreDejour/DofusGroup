import { t } from "../../i18n/i18n-helper";

import type { AuthUser } from "../../types/user";
import type { LoginForm, RegisterForm } from "../../types/form";

import { ApiClient } from "../client";
import handleApiError from "../utils/handleApiError";
import { backApiClient } from "../http/backApiClient";

export class AuthService {
  private passwordRegex;

  constructor(private apiClient: ApiClient) {
    this.passwordRegex = new RegExp(
      "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
    );
  }

  public async register(data: RegisterForm): Promise<AuthUser> {
    if (!this.passwordRegex.test(data.password)) {
      throw new Error(t("auth.password.error.rules"));
    }

    if (data.password !== data.confirmPassword) {
      throw new Error(t("auth.password.error.mismatch"));
    }

    try {
      const response = await this.apiClient.post<AuthUser>(
        "/auth/register",
        data,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async login(data: LoginForm): Promise<AuthUser> {
    if (!this.passwordRegex.test(data.password)) {
      throw new Error(t("auth.error.credentials.unavailable"));
    }

    try {
      const response = await this.apiClient.post<AuthUser>(
        "/auth/login",
        data,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async apiMe(): Promise<AuthUser | null> {
    try {
      const response = await this.apiClient.get<AuthUser>("/auth/me", {
        withCredentials: true,
      });

      if (response.status === 401) return null;

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async logout() {
    try {
      const response = await this.apiClient.post("/auth/logout", null, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const authService = new AuthService(backApiClient);
