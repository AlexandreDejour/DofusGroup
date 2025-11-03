import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import axios from "axios";
import { t } from "../../../i18n/i18n-helper";

import type { LoginForm, RegisterForm } from "../../../types/form";
import type { AuthUser } from "../../../types/user";

import { AuthService } from "../authService";
import handleApiError from "../../utils/handleApiError";

vi.mock("axios");

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("AuthService", () => {
  let axiosMock: any;
  let authService: AuthService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    axiosMock = {
      post: vi.fn(),
      get: vi.fn(),
    };
    authService = new AuthService({ instance: axiosMock } as any);
  });

  describe("register", () => {
    it("Reject if password is to weak", async () => {
      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "abc",
        confirmPassword: "abc",
      };

      await expect(authService.register(data)).rejects.toThrow(
        t("auth.password.error.rules"),
      );

      expect(axiosMock.post).not.toHaveBeenCalled();
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

      expect(axiosMock.post).not.toHaveBeenCalled();
    });

    it("Return user if request is successful", async () => {
      const user: AuthUser = {
        id: "91c28d2e-758a-4679-9ba7-a3d2b74ae60f",
        username: "user",
        mail: "user@mail.com",
        password: "supersecret",
      };
      axiosMock.post.mockResolvedValue({ data: user });
      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      };

      await expect(authService.register(data)).resolves.toEqual(user);

      expect(axiosMock.post).toHaveBeenCalledWith("/auth/register", data);
    });

    it("Call handleApiError and return undefined when server returns 409", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 409 },
        message: "Conflit",
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      axiosMock.post.mockRejectedValue(axiosError);

      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      };

      const result = await authService.register(data);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      axiosMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
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

  describe("validateEmail", () => {
    it("Return 'success' when response status is 200", async () => {
      axiosMock.get.mockResolvedValue({ status: 200 });

      const result = await authService.validateEmail("valid_token");

      expect(result).toBe("success");
      expect(axiosMock.get).toHaveBeenCalledWith(
        "/auth/verify-email?token=valid_token",
      );
    });

    it("Return 'error' when response status is not 200", async () => {
      axiosMock.get.mockResolvedValue({ status: 400 });

      const result = await authService.validateEmail("invalid_token");

      expect(result).toBe("error");
      expect(axiosMock.get).toHaveBeenCalledWith(
        "/auth/verify-email?token=invalid_token",
      );
    });

    it("Call handleApiError and return undefined when request fails", async () => {
      const error = new Error("Network error");
      axiosMock.get.mockRejectedValue(error);

      const result = await authService.validateEmail("token_error");

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Critical error");
      axiosMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(authService.validateEmail("token_rethrow")).rejects.toThrow(
        "Critical error",
      );
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

      expect(axiosMock.post).not.toHaveBeenCalled();
    });

    it("Return user if request is successful", async () => {
      const user: AuthUser = {
        id: "91c28d2e-758a-4679-9ba7-a3d2b74ae60f",
        username: "user",
        mail: "user@mail.com",
        password: "supersecret",
      };
      axiosMock.post.mockResolvedValue({ data: user });
      const data: LoginForm = {
        mail: "toto@mail.com",
        password: "Abcd1234!",
      };

      await expect(authService.login(data)).resolves.toEqual(user);

      expect(axiosMock.post).toHaveBeenCalledWith("/auth/login", data, {
        withCredentials: true,
      });
    });

    it("Call handleApiError and return undefined when server returns 401", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
        message: "Unauthorized",
      };
      axiosMock.post.mockRejectedValue(axiosError);
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
      axiosMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
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
    it("Return user if request is successful", async () => {
      const user: AuthUser = {
        id: "91c28d2e-758a-4679-9ba7-a3d2b74ae60f",
        username: "user",
        mail: "user@mail.com",
        password: "supersecret",
      };
      axiosMock.get.mockResolvedValue({ data: user });

      await expect(authService.apiMe()).resolves.toEqual(user);

      expect(axiosMock.get).toHaveBeenCalledWith("/auth/me", {
        withCredentials: true,
      });
    });

    it("Call handleApiError and return undefined for 400, 401 or 404", async () => {
      for (const status of [400, 401, 404]) {
        const axiosError = {
          isAxiosError: true,
          response: { status },
          message: "Unauthorized",
        };
        axiosMock.get.mockRejectedValueOnce(axiosError);

        const result = await authService.apiMe();

        expect(handleApiError).toHaveBeenCalledWith(axiosError);
        expect(result).toBeUndefined();
      }
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      axiosMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(authService.apiMe()).rejects.toThrow("Network error");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("logout", () => {
    it("Return data if request is successful", async () => {
      axiosMock.post.mockResolvedValue({ data: "ok" });

      await expect(authService.logout()).resolves.toEqual("ok");

      expect(axiosMock.post).toHaveBeenCalledWith("/auth/logout", null, {
        withCredentials: true,
      });
    });

    it("Call handleApiError and return undefined when axios error", async () => {
      const axiosError = {
        isAxiosError: true,
        message: "Session expired",
      };
      axiosMock.post.mockRejectedValue(axiosError);

      const result = await authService.logout();

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("Rethrow when handleApiError throws", async () => {
      const error = new Error("Network error");
      axiosMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(authService.logout()).rejects.toThrow("Network error");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
