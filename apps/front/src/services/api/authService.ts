import axios from "axios";

import { ApiClient } from "../client";

import type { AuthUser } from "../../types/user";
import type { LoginForm, RegisterForm, UpdateForm } from "../../types/form";

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
      throw new Error(
        "Le mot de passe ne respecte pas les conditions minimales de sécurité.",
      );
    }

    if (data.password !== data.confirmPassword) {
      throw new Error(
        "Le mot de passe et la confirmation doivent être identique.",
      );
    }

    try {
      const response = await this.axios.post<AuthUser>("/auth/register", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error(
            "Ce nom d'utilisateur ou email n'est pas disponible.",
          );
        }
      }
      throw error;
    }
  }

  public async login(data: LoginForm): Promise<AuthUser> {
    if (!this.passwordRegex.test(data.password)) {
      throw new Error("Email ou mot de passe érroné.");
    }

    try {
      const response = await this.axios.post<AuthUser>("/auth/login", data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Email ou mot de passe érroné.");
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
        if ([400, 401, 404].includes(error.response?.status ?? 0)) {
          throw new Error("Utilisateur inconnu.");
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

      console.log(response);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
