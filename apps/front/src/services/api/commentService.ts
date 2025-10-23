import axios from "axios";
import { t } from "../../i18n/i18n-helper";
import handleApiError from "../utils/handleApiError";

import { Comment } from "../../types/comment";

import { ApiClient } from "../client";
import { CreateCommentForm } from "../../types/form";

export class CommentService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async create(
    userId: string,
    eventId: string,
    data: CreateCommentForm,
  ): Promise<Comment> {
    try {
      const response = await this.axios.post<Comment>(
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
      const response = await this.axios.patch<Comment>(
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
      const response = await this.axios.delete(
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
