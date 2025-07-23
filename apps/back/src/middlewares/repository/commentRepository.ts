import CommentEntity from "../../database/models/Comment.js";
import {
  Comment,
  CommentEnriched,
  CommentBodyData,
} from "../../types/comment.js";

export class CommentRepository {
  public async getAllByUserId(userId: string): Promise<Comment[]> {
    try {
      const result: CommentEntity[] = await CommentEntity.findAll({
        where: { user_id: userId },
      });

      const comments: Comment[] = result.map((comment: CommentEntity) =>
        comment.get({ plain: true }),
      );

      return comments;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEnrichedByUserId(
    userId: string,
  ): Promise<CommentEnriched[]> {
    try {
      const result: CommentEntity[] = await CommentEntity.findAll({
        where: {
          user_id: userId,
        },
        include: [
          "user",
          "event",
          {
            association: "user",
            attributes: { exclude: ["email", "password"] },
          },
        ],
      });

      const comments: CommentEnriched[] = result.map((comment: CommentEntity) =>
        comment.get({ plain: true }),
      );

      return comments;
    } catch (error) {
      throw error;
    }
  }

  public async getOneByUserId(
    userId: string,
    commentId: string,
  ): Promise<Comment | null> {
    try {
      const result: CommentEntity | null = await CommentEntity.findOne({
        where: {
          id: commentId,
          user_id: userId,
        },
      });

      if (!result) {
        return null;
      }

      const comment: Comment = result.get({ plain: true });

      return comment;
    } catch (error) {
      throw error;
    }
  }

  public async getOneEnrichedByUserId(
    userId: string,
    commentId: string,
  ): Promise<CommentEnriched | null> {
    try {
      const result: CommentEntity | null = await CommentEntity.findOne({
        where: {
          id: commentId,
          user_id: userId,
        },
        include: [
          "user",
          "event",
          {
            association: "user",
            attributes: { exclude: ["email", "password"] },
          },
        ],
      });

      if (!result) {
        return null;
      }

      const comment: CommentEnriched = result.get({ plain: true });

      return comment;
    } catch (error) {
      throw error;
    }
  }

  public async post(commentData: CommentBodyData): Promise<Comment> {
    try {
      const result = await CommentEntity.create(commentData);

      const newComment = result.get({ plain: true });

      return newComment;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    userId: string,
    commentId: string,
    commentData: Partial<CommentBodyData>,
  ): Promise<CommentEnriched | null> {
    try {
      const commentToUpdate: CommentEntity | null = await CommentEntity.findOne(
        {
          where: { id: commentId, user_id: userId },
          include: [
            "user",
            "event",
            {
              association: "user",
              attributes: { exclude: ["mail", "password"] },
            },
          ],
        },
      );

      if (!commentToUpdate) {
        return null;
      }

      const result: CommentEntity = await commentToUpdate.update(commentData);

      const commentUpdated = result.get({ plain: true });

      return commentUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(userId: string, commentId: string): Promise<boolean> {
    try {
      const result: CommentEntity | null = await CommentEntity.findOne({
        where: { id: commentId, user_id: userId },
      });

      if (!result) {
        return false;
      }

      result.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }
}
