import axios from "axios";

import { ApiClient } from "../client";
import { AuthUser, UserEnriched } from "../../types/user";
import { UpdateForm } from "../../types/form";

export class UserService {
  private axios;
  private passwordRegex;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
    this.passwordRegex = new RegExp(
      "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
    );
  }

  public async getOne(userId: string): Promise<AuthUser> {
    try {
      const response = await this.axios.get<AuthUser>(`/user/${userId}`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Utilisateur introuvable.");
        }
      }
      throw error;
    }
  }

  public async getOneEnriched(id: string): Promise<UserEnriched> {
    try {
      const response = await this.axios.get<UserEnriched>(
        `/user/${id}/enriched`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Utilisateur introuvable.");
        }
      }
      throw error;
    }
  }

  public async update(userId: string, data: UpdateForm): Promise<AuthUser> {
    if (data.password && !this.passwordRegex.test(data.password)) {
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
      const response = await this.axios.patch<AuthUser>(
        `/user/${userId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403, 404].includes(error.response?.status ?? 0)) {
          throw new Error("Utilisateur inconnu.");
        }
      }
      throw error;
    }
  }

  public async delete(userId: string) {
    try {
      const response = await this.axios.delete(`/user/${userId}`, {
        withCredentials: true,
      });

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403].includes(error.response?.status ?? 0)) {
          throw new Error("Cette action n'est pas autorisée.");
        } else if (error.response?.status === 404) {
          throw new Error("Cette utilisateur n'existe plus.");
        }
      }
      throw error;
    }
  }
}
