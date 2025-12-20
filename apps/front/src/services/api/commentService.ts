import handleApiError from "../utils/handleApiError";

import { Comment } from "../../types/comment";
import { CreateCommentForm } from "../../types/form";

import { ApiClient } from "../client";
import { backApiClient } from "../http/backApiClient";

export class CommentService {
  constructor(private apiClient: ApiClient) {}

  public async create(
    userId: string,
    eventId: string,
    data: CreateCommentForm,
  ): Promise<Comment> {
    try {
      const response = await this.apiClient.post<Comment>(
        `/user/${userId}/comment`,
        { ...data, user_id: userId, event_id: eventId },
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async update(
    userId: string,
    commentId: string,
    data: CreateCommentForm,
  ): Promise<Comment> {
    try {
      const response = await this.apiClient.patch<Comment>(
        `/user/${userId}/comment/${commentId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async delete(userId: string, commentId: string) {
    try {
      const response = await this.apiClient.delete(
        `/user/${userId}/comment/${commentId}`,
        {
          withCredentials: true,
        },
      );

      return response;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const commentService = new CommentService(backApiClient);
