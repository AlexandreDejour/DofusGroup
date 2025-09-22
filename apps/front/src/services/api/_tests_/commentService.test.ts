import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { CreateCommentForm } from "../../../types/form";
import { Comment } from "../../../types/comment";

import { ApiClient } from "../../client";
import { CommentService } from "../commentService";

vi.mock("axios");

describe("CommentService", () => {
  let apiClientMock: any;
  let commentService: CommentService;

  const userId = "a85a284b-53ae-4c2f-b94e-69f64d125c5c";
  const commentId = "2f816845-7051-4934-99f6-042130544d15";
  const eventId = "2f816845-7051-4934-99f6-042130544d15";
  const validData: CreateCommentForm = {
    content: "Test Comment",
  };

  beforeEach(() => {
    apiClientMock = {
      instance: {
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    };
    commentService = new CommentService(apiClientMock as ApiClient);
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
  });

  describe("create", () => {
    it("should call axios.post with correct params on success", async () => {
      const mockResponse = {
        data: { id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667", ...validData },
      };
      apiClientMock.instance.post.mockResolvedValue(mockResponse);

      const result = await commentService.create(userId, eventId, validData);

      expect(apiClientMock.instance.post).toHaveBeenCalledWith(
        `/user/${userId}/comment`,
        { ...validData, user_id: userId, event_id: eventId },
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw a specific error for a 401 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(
        commentService.create(userId, eventId, validData),
      ).rejects.toThrow(
        "Vous devez être connecter pour ajouter un commentaire.",
      );
    });

    it("should throw a specific error for a 403 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(
        commentService.create(userId, eventId, validData),
      ).rejects.toThrow("L'ajout de commentaire est réservée à votre compte.");
    });

    it("should rethrow a generic error if not an AxiosError", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.post.mockRejectedValue(genericError);

      await expect(
        commentService.create(userId, eventId, validData),
      ).rejects.toThrow("Unknown error");
    });
  });

  describe("update", () => {
    it("should call axios.patch with correct params and return data", async () => {
      const mockResponse = { data: { id: commentId, ...validData } };
      apiClientMock.instance.patch.mockResolvedValue(mockResponse);

      const result = await commentService.update(userId, commentId, validData);

      expect(apiClientMock.instance.patch).toHaveBeenCalledWith(
        `/user/${userId}/comment/${commentId}`,
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw a specific error for a 401 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      await expect(
        commentService.update(userId, commentId, validData),
      ).rejects.toThrow(
        "Vous devez être connecter pour modifier un commentaire.",
      );
    });

    it("should throw a specific error for a 403 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      await expect(
        commentService.update(userId, commentId, validData),
      ).rejects.toThrow(
        "La modification de commentaire est réservée à votre compte.",
      );
    });

    it("should throw a specific error for a 404 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      await expect(
        commentService.update(userId, commentId, validData),
      ).rejects.toThrow("Ce commentaire n'existe plus.");
    });

    it("should rethrow a generic error if not an AxiosError", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.post.mockRejectedValue(genericError);

      await expect(
        commentService.create(userId, commentId, validData),
      ).rejects.toThrow("Unknown error");
    });
  });

  describe("delete", () => {
    it("Call axios.delete with correct params", async () => {
      const mockResponse = { status: 200 };
      apiClientMock.instance.delete.mockResolvedValue(mockResponse);

      const result = await commentService.delete(userId, commentId);

      expect(apiClientMock.instance.delete).toHaveBeenCalledWith(
        `/user/${userId}/comment/${commentId}`,
        { withCredentials: true },
      );
      expect(result).toBe(mockResponse);
    });

    it("Throw specific error if response is 400, 401, or 403", async () => {
      const statusCodes = [400, 401, 403];
      for (const status of statusCodes) {
        const axiosError = {
          isAxiosError: true,
          response: { status: status },
        };
        vi.mocked(axios.isAxiosError).mockReturnValue(true);
        apiClientMock.instance.delete.mockRejectedValue(axiosError);

        await expect(commentService.delete(userId, commentId)).rejects.toThrow(
          "Cette action n'est pas autorisée.",
        );
      }
    });

    it("Throw specific error if response is 404", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      await expect(commentService.delete(userId, commentId)).rejects.toThrow(
        "Ce commentaire n'existe plus.",
      );
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      apiClientMock.instance.delete.mockRejectedValue(error);

      await expect(commentService.delete(userId, commentId)).rejects.toThrow(
        "Unknown error",
      );
    });
  });
});
