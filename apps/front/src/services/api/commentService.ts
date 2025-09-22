import axios from "axios";

import { Comment } from "../../types/comment";

import { ApiClient } from "../client";
import { createCommentForm } from "../../types/form";

export class CommentService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async create(
    userId: string,
    eventId: string,
    data: createCommentForm,
  ): Promise<Comment> {
    try {
      const response = await this.axios.post<Comment>(
        `/user/${userId}/comment`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(
            "Vous devez être connecter pour créer un personnage.",
          );
        }

        if (error.response?.status === 403) {
          throw new Error(
            "La création de personnage est réservée à votre compte.",
          );
        }
      }
      throw error;
    }
  }
}
