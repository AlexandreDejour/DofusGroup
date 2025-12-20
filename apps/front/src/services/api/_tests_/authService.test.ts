import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { t } from "../../../i18n/i18n-helper";

import type { LoginForm, RegisterForm } from "../../../types/form";
import type { AuthUser } from "../../../types/user";

import { AuthService } from "../authService";
import handleApiError from "../../utils/handleApiError";
import type { ApiClient } from "../../client";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("AuthService", () => {
  let apiClientMock: {
    post: Mock;
    get: Mock;
  };

  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      post: vi.fn(),
      get: vi.fn(),
    };

    authService = new AuthService(apiClientMock as unknown as ApiClient);
  });

  describe("register", () => {
    it("Reject if password is too weak", async () => {
      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "abc",
        confirmPassword: "abc",
      };

      await expect(authService.register(data)).rejects.toThrow(
        t("auth.password.error.rules"),
      );

      expect(apiClientMock.post).not.toHaveBeenCalled();
    });

    it("Reject if password and confirmPassword are not similar", async () => {
      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd12345!",
      };

      await expect(authService.register(data)).rejects.toThrow(
        t("auth.password.error.mismatch"),
      );

      expect(apiClientMock.post).not.toHaveBeenCalled();
    });

    it("Return user if request is successful", async () => {
      const user: AuthUser = {
        id: "1",
        username: "user",
        mail: "user@mail.com",
        password: "secret",
      };

      apiClientMock.post.mockResolvedValue({ data: user });

      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      };

      await expect(authService.register(data)).resolves.toEqual(user);

      expect(apiClientMock.post).toHaveBeenCalledWith("/auth/register", data);
    });

    it("Call handleApiError and return undefined", async () => {
      const error = new Error("Conflict");
      apiClientMock.post.mockRejectedValue(error);

      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      };

      const result = await authService.register(data);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        authService.register({
          username: "user",
          mail: "user@mail.com",
          password: "Abcd1234!",
          confirmPassword: "Abcd1234!",
        }),
      ).rejects.toThrow("Network error");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("Reject if password is too weak", async () => {
      const data: LoginForm = {
        mail: "toto@mail.com",
        password: "abc",
      };

      await expect(authService.login(data)).rejects.toThrow(
        t("auth.error.credentials.unavailable"),
      );

      expect(apiClientMock.post).not.toHaveBeenCalled();
    });

    it("Return user if request is successful", async () => {
      const user: AuthUser = {
        id: "1",
        username: "user",
        mail: "user@mail.com",
        password: "secret",
      };

      apiClientMock.post.mockResolvedValue({ data: user });

      const data: LoginForm = {
        mail: "toto@mail.com",
        password: "Abcd1234!",
      };

      await expect(authService.login(data)).resolves.toEqual(user);

      expect(apiClientMock.post).toHaveBeenCalledWith("/auth/login", data, {
        withCredentials: true,
      });
    });

    it("Call handleApiError and return undefined when server returns 401", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
        message: "Unauthorized",
      };
      apiClientMock.post.mockRejectedValue(axiosError);
      const data: LoginForm = {
        mail: "toto@mail.com",
        password: "Abcd1234!",
      };

      const result = await authService.login(data);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementationOnce(() => {
        throw error;
      });

      const data: LoginForm = {
        mail: "toto@mail.com",
        password: "Abcd1234!",
      };

      await expect(authService.login(data)).rejects.toThrow("Network error");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("apiMe", () => {
    it("Return user if authenticated", async () => {
      const user: AuthUser = {
        id: "1",
        username: "user",
        mail: "user@mail.com",
        password: "secret",
      };

      apiClientMock.get.mockResolvedValue({ data: user, status: 200 });

      await expect(authService.apiMe()).resolves.toEqual(user);
    });

    it("Return null if 401", async () => {
      apiClientMock.get.mockResolvedValue({ status: 401 });

      await expect(authService.apiMe()).resolves.toBeNull();
    });

    it("Call handleApiError and return undefined for 400, 401 or 404", async () => {
      for (const status of [400, 401, 404]) {
        const axiosError = {
          isAxiosError: true,
          response: { status },
          message: "Unauthorized",
        };
        apiClientMock.get.mockRejectedValueOnce(axiosError);

        const result = await authService.apiMe();

        expect(handleApiError).toHaveBeenCalledWith(axiosError);
        expect(result).toBeUndefined();
      }
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(authService.apiMe()).rejects.toThrow("Network error");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("logout", () => {
    it("Return data if request is successful", async () => {
      apiClientMock.post.mockResolvedValue({ data: "ok" });

      await expect(authService.logout()).resolves.toEqual("ok");

      expect(apiClientMock.post).toHaveBeenCalledWith("/auth/logout", null, {
        withCredentials: true,
      });
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(authService.logout()).rejects.toThrow("Network error");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
