import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";

import { t } from "../../../i18n/i18n-helper";

import { UpdateForm } from "../../../types/form";
import { AuthUser, UserEnriched } from "../../../types/user";

import { ApiClient } from "../../client";
import { UserService } from "../userService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("UserService", () => {
  let apiClientMock: any;
  let userService: UserService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    };
    userService = new UserService(apiClientMock as ApiClient);
  });

  describe("getOne", () => {
    it("Return authUser data when request succeed", async () => {
      const mockUser: AuthUser = {
        id: "123",
        username: "John",
      } as AuthUser;
      apiClientMock.instance.get.mockResolvedValue({ data: mockUser });

      const result = await userService.getOne("123");

      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/user/123");
      expect(result).toEqual(mockUser);
    });

    it("Throw specific error when user isn't found (handleApiError throws)", async () => {
      const error = new Error("User not found.");
      apiClientMock.instance.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(userService.getOne("123")).rejects.toThrow(
        "User not found.",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
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

    it("Throw specific error when user isn't found (handleApiError throws)", async () => {
      const error = new Error("User not found.");
      apiClientMock.instance.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(userService.getOneEnriched("123")).rejects.toThrow(
        "User not found.",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
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
        t("auth.password.error.rules"),
      );

      expect(apiClientMock.instance.patch).not.toHaveBeenCalled();
      expect(handleApiError).not.toHaveBeenCalled();
    });

    it("Reject immediately when password and confirmPassword differ", async () => {
      const invalidForm: UpdateForm = {
        password: "Abc12345!",
        confirmPassword: "Different123!",
      };

      await expect(userService.update("123", invalidForm)).rejects.toThrow(
        t("auth.password.error.mismatch"),
      );

      expect(apiClientMock.instance.patch).not.toHaveBeenCalled();
      expect(handleApiError).not.toHaveBeenCalled();
    });

    it("Call handleApiError when axios.patch rejects (and does not rethrow)", async () => {
      const error = new Error("Request failed");
      apiClientMock.instance.patch.mockRejectedValue(error);

      await userService.update("123", { username: "Johnny" });

      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("Throw error when handleApiError itself throws", async () => {
      const error = new Error("User not found.");
      apiClientMock.instance.patch.mockRejectedValue(error);

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
    it("Call delete endpoint and return response when succeed", async () => {
      const mockResponse = { data: "ok" };
      apiClientMock.instance.delete.mockResolvedValue(mockResponse);

      const result = await userService.delete("user-1");

      expect(apiClientMock.instance.delete).toHaveBeenCalledWith(
        "/user/user-1",
        {
          withCredentials: true,
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("Call handleApiError when delete fails", async () => {
      const error = new Error("Delete failed");
      apiClientMock.instance.delete.mockRejectedValue(error);

      await userService.delete("user-1");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
