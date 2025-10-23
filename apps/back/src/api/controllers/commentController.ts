import status from "http-status";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

import {
  Comment,
  CommentBodyData,
  CommentEnriched,
} from "../../types/comment.js";
import { CommentRepository } from "../../middlewares/repository/commentRepository.js";

export class CommentController {
  private repository: CommentRepository;

  public constructor(repository: CommentRepository) {
    this.repository = repository;
  }

  public async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId;

    try {
      const comments: Comment[] = await this.repository.getAllByUserId(userId);

      if (!comments.length) {
        const error = createHttpError(status.NO_CONTENT, "Any comment found");
        return next(error);
      }

      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  public async getAllEnrichedByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId: string = req.params.userId;

    try {
      const comments: CommentEnriched[] =
        await this.repository.getAllEnrichedByUserId(userId);

      if (!comments.length) {
        const error = createHttpError(status.NO_CONTENT, "Any comment found");
        return next(error);
      }
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  public async getOneByUserId(req: Request, res: Response, next: NextFunction) {
    const { userId, commentId } = req.params;

    try {
      const comment: Comment | null = await this.repository.getOneByUserId(
        userId,
        commentId,
      );

      if (!comment) {
        const error = createHttpError(status.NOT_FOUND, "Comment not found");
        return next(error);
      }

      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  public async getOneEnrichedByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { userId, commentId } = req.params;

    try {
      const comment: CommentEnriched | null =
        await this.repository.getOneEnrichedByUserId(userId, commentId);

      if (!comment) {
        const error = createHttpError(status.NOT_FOUND, "Comment not found");
        return next(error);
      }

      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "user ID is required",
        );
        return next(error);
      }

      const commentData: CommentBodyData = req.body;

      const newComment: CommentEnriched =
        await this.repository.post(commentData);

      res.status(status.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "User ID is required",
        );
        return next(error);
      }

      const { userId, commentId } = req.params;
      const commentData: Partial<CommentBodyData> = req.body;

      const commentUpdated: Comment | null = await this.repository.update(
        userId,
        commentId,
        commentData,
      );

      if (!commentUpdated) {
        const error = createHttpError(status.NOT_FOUND, "Comment not found");
        return next(error);
      }

      res.json(commentUpdated);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "user ID is required",
        );
        return next(error);
      }

      const { userId, commentId } = req.params;

      const result: boolean = await this.repository.delete(userId, commentId);

      if (!result) {
        const error = createHttpError(status.NOT_FOUND, "Comment not found");
        return next(error);
      }

      res.status(status.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
