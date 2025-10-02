import axios from "axios";
import { t } from "../../i18n/i18n-helper";

import { ApiClient } from "../client";

import type { AuthUser } from "../../types/user";
import type { LoginForm, RegisterForm } from "../../types/form";

export class AuthService {
  private axios;
  private passwordRegex;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
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
      const response = await this.axios.post<AuthUser>("/auth/register", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error(t("auth.error.credentials.unavailable"));
        }
      }
      throw error;
    }
  }

  public async login(data: LoginForm): Promise<AuthUser> {
    if (!this.passwordRegex.test(data.password)) {
      throw new Error(t("auth.error.credentials.unavailable"));
    }

    try {
      const response = await this.axios.post<AuthUser>("/auth/login", data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(t("auth.error.credentials.invalid"));
        }
        if (error.response?.status === 429) {
          throw new Error(t("system.error.attemps"));
        }
      }
      throw error;
    }
  }

  public async apiMe(): Promise<AuthUser> {
    try {
      const response = await this.axios.get<AuthUser>("/auth/me", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403, 404].includes(error.response?.status ?? 0)) {
          throw new Error(t("auth.error.user.notFound"));
        }
      }
      throw error;
    }
  }

  public async logout() {
    try {
      const response = await this.axios.post("/auth/logout", null, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
