import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";

import { t } from "../../../i18n/i18n-helper";
import type { UpdateForm } from "../../../types/form";
import type { AuthUser, UserEnriched } from "../../../types/user";
import type { ApiClient } from "../../client";

import { UserService } from "../userService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("UserService", () => {
  let apiClientMock: {
    get: Mock;
    patch: Mock;
    delete: Mock;
  };
  let userService: UserService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    vi.clearAllMocks();

    apiClientMock = {
      get: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    userService = new UserService(apiClientMock as unknown as ApiClient);
  });

  describe("getOne", () => {
    it("returns authUser data on success", async () => {
      const mockUser: AuthUser = { id: "123", username: "John" } as AuthUser;
      apiClientMock.get.mockResolvedValue({ data: mockUser });

      const result = await userService.getOne("123");

      expect(apiClientMock.get).toHaveBeenCalledWith("/user/123");
      expect(result).toEqual(mockUser);
    });

    it("calls handleApiError and rethrows if it throws", async () => {
      const error = new Error("User not found.");
      apiClientMock.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(userService.getOne("123")).rejects.toThrow(
        "User not found.",
      );
      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("calls handleApiError and returns undefined if it does not throw", async () => {
      const error = new Error("API error");
      apiClientMock.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await userService.getOne("123");
      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getOneEnriched", () => {
    it("returns userEnriched data on success", async () => {
      const mockUser: UserEnriched = {
        id: "123",
        username: "John",
        email: "john@example.com",
      } as UserEnriched;

      apiClientMock.get.mockResolvedValue({ data: mockUser });

      const result = await userService.getOneEnriched("123");

      expect(apiClientMock.get).toHaveBeenCalledWith("/user/123/enriched");
      expect(result).toEqual(mockUser);
    });

    it("calls handleApiError and rethrows if it throws", async () => {
      const error = new Error("User not found.");
      apiClientMock.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(userService.getOneEnriched("123")).rejects.toThrow(
        "User not found.",
      );
      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("calls handleApiError and returns undefined if it does not throw", async () => {
      const error = new Error("API error");
      apiClientMock.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await userService.getOneEnriched("123");
      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("update", () => {
    it("returns updated user data on success", async () => {
      const mockUser: AuthUser = { id: "123", username: "Johnny" } as AuthUser;
      const updateForm: UpdateForm = { username: "Johnny" };
      apiClientMock.patch.mockResolvedValue({ data: mockUser });

      const result = await userService.update("123", updateForm);

      expect(apiClientMock.patch).toHaveBeenCalledWith(
        "/user/123",
        updateForm,
        {
          withCredentials: true,
        },
      );
      expect(result).toEqual(mockUser);
    });

    it("rejects if password fails regex", async () => {
      const invalidForm: UpdateForm = {
        password: "abc",
        confirmPassword: "abc",
      };

      await expect(userService.update("123", invalidForm)).rejects.toThrow(
        t("auth.password.error.rules"),
      );

      expect(apiClientMock.patch).not.toHaveBeenCalled();
      expect(handleApiError).not.toHaveBeenCalled();
    });

    it("rejects if password and confirmPassword mismatch", async () => {
      const invalidForm: UpdateForm = {
        password: "Abc12345!",
        confirmPassword: "Mismatch123!",
      };

      await expect(userService.update("123", invalidForm)).rejects.toThrow(
        t("auth.password.error.mismatch"),
      );

      expect(apiClientMock.patch).not.toHaveBeenCalled();
      expect(handleApiError).not.toHaveBeenCalled();
    });

    it("calls handleApiError if patch fails and does not rethrow", async () => {
      const error = new Error("Request failed");
      apiClientMock.patch.mockRejectedValue(error);

      await userService.update("123", { username: "Johnny" });

      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("rethrows if handleApiError itself throws", async () => {
      const error = new Error("User not found.");
      apiClientMock.patch.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(
        userService.update("123", { username: "Johnny" }),
      ).rejects.toThrow("User not found.");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("calls delete endpoint and returns response", async () => {
      const mockResponse = { data: "ok" };
      apiClientMock.delete.mockResolvedValue(mockResponse);

      const result = await userService.delete("user-1");

      expect(apiClientMock.delete).toHaveBeenCalledWith("/user/user-1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it("calls handleApiError on failure", async () => {
      const error = new Error("Delete failed");
      apiClientMock.delete.mockRejectedValue(error);

      await userService.delete("user-1");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
