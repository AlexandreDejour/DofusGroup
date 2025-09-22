import axios from "axios";

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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(
            "Vous devez être connecter pour ajouter un commentaire.",
          );
        }

        if (error.response?.status === 403) {
          throw new Error(
            "L'ajout de commentaire est réservée à votre compte.",
          );
        }
      }
      throw error;
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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(
            "Vous devez être connecter pour modifier un commentaire.",
          );
        }

        if (error.response?.status === 403) {
          throw new Error(
            "La modification de commentaire est réservée à votre compte.",
          );
        }

        if (error.response?.status === 404) {
          throw new Error("Ce commentaire n'existe plus.");
        }
      }
      throw error;
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
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403].includes(error.response?.status ?? 0)) {
          throw new Error("Cette action n'est pas autorisée.");
        } else if (error.response?.status === 404) {
          throw new Error("Ce commentaire n'existe plus.");
        }
      }
      throw error;
    }
  }
}
