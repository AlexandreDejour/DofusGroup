import { ApiClient } from "../client";

import type { AuthUser } from "../../types/user";
import type { RegisterForm } from "../../types/form";

export class AuthService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async register(data: RegisterForm): Promise<AuthUser> {
    const passwordRegex = new RegExp(
      "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
    );

    if (data.password) {
      if (!passwordRegex.test(data.password)) {
        throw new Error(
          "Le mot de passe ne respecte pas les conditions minimales de sécurité",
        );
      }
      if (data.password !== data.confirmPassword) {
        throw new Error(
          "Le mot de passe et la confirmation doivent être identique",
        );
      }
    }

    const response = await this.axios.post<AuthUser>("/auth/register", data);
    return response.data;
  }
}
