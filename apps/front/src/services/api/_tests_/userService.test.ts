import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { UpdateForm } from "../../../types/form";
import { AuthUser, UserEnriched } from "../../../types/user";

import { ApiClient } from "../../client";
import { UserService } from "../userService";

vi.mock("axios");

describe("UserService", () => {
  let apiClientMock: any;
  let userService: UserService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        patch: vi.fn(),
      },
    };
    userService = new UserService(apiClientMock as ApiClient);
  });

  describe("getOneEnriched", () => {
    it("Return userEnriched data when request succeed", async () => {
      const mockUser: UserEnriched = {
        id: "123",
        username: "John",
        email: "john@example.com",
      } as UserEnriched;
      apiClientMock.instance.get.mockResolvedValue({ data: mockUser });

      const result = await userService.getOneEnriched("123");

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        "/user/123/enriched",
      );
      expect(result).toEqual(mockUser);
    });

    it("Throw specific error when user isn't found (404)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(userService.getOneEnriched("123")).rejects.toThrow(
        "Utilisateur introuvable.",
      );
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.get.mockRejectedValue(error);

      await expect(userService.getOneEnriched("123")).rejects.toThrow(
        "Unknown error",
      );
    });
  });

  describe("update", () => {
    it("Return updated data when request succeed", async () => {
      const mockData: AuthUser = {
        id: "123",
        username: "John",
      } as AuthUser;

      const updateForm: UpdateForm = { username: "Johnny" };

      apiClientMock.instance.patch.mockResolvedValue({ data: mockData });

      const result = await userService.update("123", updateForm);

      expect(apiClientMock.instance.patch).toHaveBeenCalledWith(
        "/user/123",
        updateForm,
        { withCredentials: true },
      );
      expect(result).toEqual(mockData);
    });

    it("Reject immediately when password does not match regex", async () => {
      const invalidForm: UpdateForm = {
        password: "abc",
        confirmPassword: "abc",
      };

      await expect(userService.update("123", invalidForm)).rejects.toThrow(
        "Le mot de passe ne respecte pas les conditions minimales de sécurité.",
      );

      expect(apiClientMock.instance.patch).not.toHaveBeenCalled();
    });

    it("Reject immediately when password and confirmPassword differ", async () => {
      const invalidForm: UpdateForm = {
        password: "Abc12345!",
        confirmPassword: "Different123!",
      };

      await expect(userService.update("123", invalidForm)).rejects.toThrow(
        "Le mot de passe et la confirmation doivent être identique.",
      );

      expect(apiClientMock.instance.patch).not.toHaveBeenCalled();
    });

    it("Throw specific error if response is 400/401/403/404", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      await expect(
        userService.update("123", { username: "Johnny" }),
      ).rejects.toThrow("Utilisateur inconnu.");
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.patch.mockRejectedValue(error);

      await expect(
        userService.update("123", { username: "Johnny" }),
      ).rejects.toThrow("Unknown error");
    });
  });
});
