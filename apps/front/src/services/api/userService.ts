import { t } from "../../i18n/i18n-helper";

import { UpdateForm } from "../../types/form";
import { AuthUser, UserEnriched } from "../../types/user";

import { ApiClient } from "../client";
import handleApiError from "../utils/handleApiError";
import { backApiClient } from "../http/backApiClient";

export class UserService {
  private passwordRegex;

  constructor(private apiClient: ApiClient) {
    this.passwordRegex = new RegExp(
      "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
    );
  }

  public async getOne(userId: string): Promise<AuthUser> {
    try {
      const response = await this.apiClient.get<AuthUser>(`/user/${userId}`);

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getOneEnriched(id: string): Promise<UserEnriched> {
    try {
      const response = await this.apiClient.get<UserEnriched>(
        `/user/${id}/enriched`,
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async update(userId: string, data: UpdateForm): Promise<AuthUser> {
    if (data.password && !this.passwordRegex.test(data.password)) {
      throw new Error(t("auth.password.error.rules"));
    }

    if (data.password !== data.confirmPassword) {
      throw new Error(t("auth.password.error.mismatch"));
    }

    try {
      const response = await this.apiClient.patch<AuthUser>(
        `/user/${userId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async delete(userId: string) {
    try {
      const response = await this.apiClient.delete(`/user/${userId}`, {
        withCredentials: true,
      });

      return response;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const userService = new UserService(backApiClient);
