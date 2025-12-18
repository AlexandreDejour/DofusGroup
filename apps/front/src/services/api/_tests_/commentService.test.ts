import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import type { ApiClient } from "../../client";
import type { CreateCommentForm } from "../../../types/form";
import type { Comment } from "../../../types/comment";

import { CommentService } from "../commentService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("CommentService", () => {
  let apiClientMock: {
    post: Mock;
    patch: Mock;
    delete: Mock;
  };

  let commentService: CommentService;

  const userId = "user-id";
  const eventId = "event-id";
  const commentId = "comment-id";

  const validData: CreateCommentForm = {
    content: "Test comment",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    commentService = new CommentService(apiClientMock as unknown as ApiClient);
  });

  describe("create", () => {
    it("returns comment on success", async () => {
      const comment: Comment = {
        id: commentId,
        content: "Test comment",
      } as Comment;

      apiClientMock.post.mockResolvedValue({ data: comment });

      const result = await commentService.create(userId, eventId, validData);

      expect(apiClientMock.post).toHaveBeenCalledWith(
        `/user/${userId}/comment`,
        { ...validData, user_id: userId, event_id: eventId },
        { withCredentials: true },
      );

      expect(result).toEqual(comment);
    });

    it("calls handleApiError and returns undefined", async () => {
      const error = new Error("Unauthorized");
      apiClientMock.post.mockRejectedValue(error);

      const result = await commentService.create(userId, eventId, validData);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });

    it("rethrows if handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.post.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        commentService.create(userId, eventId, validData),
      ).rejects.toThrow("Network error");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("returns updated comment on success", async () => {
      const comment: Comment = {
        id: commentId,
        content: "Updated comment",
      } as Comment;

      apiClientMock.patch.mockResolvedValue({ data: comment });

      const result = await commentService.update(userId, commentId, validData);

      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/user/${userId}/comment/${commentId}`,
        validData,
        { withCredentials: true },
      );

      expect(result).toEqual(comment);
    });

    it("calls handleApiError and returns undefined", async () => {
      const error = new Error("Forbidden");
      apiClientMock.patch.mockRejectedValue(error);

      const result = await commentService.update(userId, commentId, validData);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });

    it("rethrows if handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.patch.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        commentService.update(userId, commentId, validData),
      ).rejects.toThrow("Network error");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("returns response on success", async () => {
      const response = { status: 204 };
      apiClientMock.delete.mockResolvedValue(response);

      const result = await commentService.delete(userId, commentId);

      expect(apiClientMock.delete).toHaveBeenCalledWith(
        `/user/${userId}/comment/${commentId}`,
        { withCredentials: true },
      );

      expect(result).toEqual(response);
    });

    it("calls handleApiError and returns undefined", async () => {
      const error = new Error("Not found");
      apiClientMock.delete.mockRejectedValue(error);

      const result = await commentService.delete(userId, commentId);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });

    it("rethrows if handleApiError throws", async () => {
      const error = new Error("Network error");
      apiClientMock.delete.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementationOnce(() => {
        throw error;
      });

      await expect(commentService.delete(userId, commentId)).rejects.toThrow(
        "Network error",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
