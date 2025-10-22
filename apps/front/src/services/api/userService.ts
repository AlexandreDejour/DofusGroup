import { t } from "../../i18n/i18n-helper";

import { ApiClient } from "../client";
import handleApiError from "../utils/handleApiError";

import { UpdateForm } from "../../types/form";
import { AuthUser, UserEnriched } from "../../types/user";

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
      handleApiError(error);
    }
  }

  public async getOneEnriched(id: string): Promise<UserEnriched> {
    try {
      const response = await this.axios.get<UserEnriched>(
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
      const response = await this.axios.patch<AuthUser>(
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
      const response = await this.axios.delete(`/user/${userId}`, {
        withCredentials: true,
      });

      return response;
    } catch (error) {
      handleApiError(error);
    }
  }
}
