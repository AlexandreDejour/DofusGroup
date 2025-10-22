import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import axios from "axios";

import { CreateCommentForm } from "../../../types/form";

import { ApiClient } from "../../client";
import { CommentService } from "../commentService";
import handleApiError from "../../utils/handleApiError";

vi.mock("axios");

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

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
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    };
    commentService = new CommentService(apiClientMock as ApiClient);
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

    it("should call handleApiError for a 401 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      const result = await commentService.create(userId, eventId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should call handleApiError for a 403 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      const result = await commentService.create(userId, eventId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.post.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(
        commentService.create(userId, eventId, validData),
      ).rejects.toThrow("Unknown error");

      expect(handleApiError).toHaveBeenCalledWith(genericError);
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

    it("should call handleApiError for a 401 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      const result = await commentService.update(userId, commentId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should call handleApiError for a 403 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      const result = await commentService.update(userId, commentId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should call handleApiError for a 404 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      const result = await commentService.update(userId, commentId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.patch.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(
        commentService.update(userId, commentId, validData),
      ).rejects.toThrow("Unknown error");

      expect(handleApiError).toHaveBeenCalledWith(genericError);
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

    it("should call handleApiError for response 400, 401, or 403 and not throw", async () => {
      const statusCodes = [400, 401, 403];
      for (const statusCode of statusCodes) {
        const axiosError = {
          isAxiosError: true,
          response: { status: statusCode },
        };
        vi.mocked(axios.isAxiosError).mockReturnValue(true);
        apiClientMock.instance.delete.mockRejectedValue(axiosError);

        const result = await commentService.delete(userId, commentId);

        expect(handleApiError).toHaveBeenCalledWith(axiosError);
        expect(result).toBeUndefined();
      }
    });

    it("should call handleApiError for response 404 and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      const result = await commentService.delete(userId, commentId);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.delete.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(commentService.delete(userId, commentId)).rejects.toThrow(
        "Unknown error",
      );
      expect(handleApiError).toHaveBeenCalledWith(genericError);
    });
  });
});
