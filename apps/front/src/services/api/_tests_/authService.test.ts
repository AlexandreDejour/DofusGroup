import type { LoginForm, RegisterForm } from "../../../types/form";
import type { AuthUser } from "../../../types/user";

import { AuthService } from "../authService";

describe("AuthService", () => {
  let axiosMock: any;
  let authService: AuthService;

  beforeEach(() => {
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
        "Le mot de passe ne respecte pas les conditions minimales de sécurité.",
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
        "Le mot de passe et la confirmation doivent être identique.",
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

    it("Reject with special message if server return code 409", async () => {
      axiosMock.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 409 },
        message: "Conflit",
      });
      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      };

      await expect(authService.register(data)).rejects.toThrow(
        "Ce nom d'utilisateur ou email n'est pas disponible.",
      );
    });

    it("Reject with error's origin for other errors", async () => {
      const error = new Error("Network error");
      axiosMock.post.mockRejectedValue(error);
      const data: RegisterForm = {
        username: "user",
        mail: "user@mail.com",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      };

      await expect(authService.register(data)).rejects.toThrow("Network error");
    });
  });

  describe("login", () => {
    it("Reject if password is too weak", async () => {
      const data: LoginForm = {
        username: "toto",
        password: "abc",
      };

      await expect(authService.login(data)).rejects.toThrow(
        "Email ou mot de passe érroné.",
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
        username: "toto",
        password: "Abcd1234!",
      };

      await expect(authService.login(data)).resolves.toEqual(user);

      expect(axiosMock.post).toHaveBeenCalledWith("/auth/login", data, {
        withCredentials: true,
      });
    });

    it("Reject with special message if server returns 401", async () => {
      axiosMock.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 401 },
        message: "Unauthorized",
      });
      const data: LoginForm = {
        username: "toto",
        password: "Abcd1234!",
      };

      await expect(authService.login(data)).rejects.toThrow(
        "Email ou mot de passe érroné.",
      );
    });

    it("Reject with error's origin for other errors", async () => {
      const error = new Error("Network error");
      axiosMock.post.mockRejectedValue(error);
      const data: LoginForm = {
        username: "toto",
        password: "Abcd1234!",
      };

      await expect(authService.login(data)).rejects.toThrow("Network error");
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

    it("Reject with 'Utilisateur inconnu.' if server returns 400, 401 or 404", async () => {
      for (const status of [400, 401, 404]) {
        axiosMock.get.mockRejectedValueOnce({
          isAxiosError: true,
          response: { status: status },
          message: "Unauthorized",
        });

        await expect(authService.apiMe()).rejects.toThrow(
          "Utilisateur inconnu.",
        );
      }
    });

    it("Reject with error's origin for other errors", async () => {
      const error = new Error("Network error");
      axiosMock.get.mockRejectedValue(error);

      await expect(authService.apiMe()).rejects.toThrow("Network error");
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

    it("Reject with error message if axios error", async () => {
      axiosMock.post.mockRejectedValue({
        isAxiosError: true,
        message: "Session expired",
      });

      await expect(authService.logout()).rejects.toThrow("Session expired");
    });

    it("Reject with error's origin for other errors", async () => {
      const error = new Error("Network error");
      axiosMock.post.mockRejectedValue(error);

      await expect(authService.logout()).rejects.toThrow("Network error");
    });
  });
});
