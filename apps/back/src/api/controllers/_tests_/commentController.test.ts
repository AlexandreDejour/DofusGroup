import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import {
  Comment,
  CommentBodyData,
  CommentEnriched,
} from "../../../types/comment.js";
import { CommentController } from "../commentController.js";
import { CommentRepository } from "../../../middlewares/repository/commentRepository.js";

describe("CommentController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/CharacterRepository.js");
  const mockGetAll = vi.spyOn(CommentRepository.prototype, "getAllByUserId");
  const mockGetOne = vi.spyOn(CommentRepository.prototype, "getOneByUserId");
  const mockGetAllEnriched = vi.spyOn(
    CommentRepository.prototype,
    "getAllEnrichedByUserId",
  );
  const mockGetOneEnriched = vi.spyOn(
    CommentRepository.prototype,
    "getOneEnrichedByUserId",
  );
  const mockPost = vi.spyOn(CommentRepository.prototype, "post");
  const mockUpdate = vi.spyOn(CommentRepository.prototype, "update");
  const mockDelete = vi.spyOn(CommentRepository.prototype, "delete");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: CommentController = new CommentController(
    new CommentRepository(),
  );

  // --- GET ALL ---
  describe("getAllByUserId", () => {
    req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

    it("Return comments if exist.", async () => {
      // GIVEN
      const mockComments: Comment[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          content: "Ready to fight",
        },
      ];

      mockGetAll.mockResolvedValue(mockComments);
      // WHEN
      await underTest.getAllByUserId(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockComments);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any character found.", async () => {
      const mockComments: Comment[] = [];

      mockGetAll.mockResolvedValue(mockComments);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any comment found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOneByUserId", () => {
    req.params = {
      userId: "436d798e-b084-454c-8f78-593e966a9a66",
      commentId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
    };

    it("Return comment if exists", async () => {
      const mockComment: Comment = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        content: "Ready to fight",
      };

      mockGetOne.mockResolvedValue(mockComment);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it("Call next() if comment doesn't exists.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL ENRICHED ---
  describe("getAllByUserIdEnriched", () => {
    req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

    it("Return comments if exist.", async () => {
      // GIVEN
      const mockCommentsEnriched: CommentEnriched[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          content: "Ready to fight",
          user: {
            id: "436d798e-b084-454c-8f78-593e966a9a66",
            username: "Goldorak",
          },
          event: {
            id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
            title: "Donjon minotot",
            date: new Date("2026-01-01"),
            duration: 60,
            area: "Amakna",
            sub_area: "Ile des taures",
            donjon_name: "Labyrinthe du minotoror",
            description: "donjon full succès",
            max_players: 8,
            status: "public",
          },
        },
      ];

      mockGetAllEnriched.mockResolvedValue(mockCommentsEnriched);
      // WHEN
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );
      //THEN
      expect(mockGetAllEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCommentsEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any comment found.", async () => {
      const mockCommentsEnriched: CommentEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockCommentsEnriched);
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any comment found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAllEnriched.mockRejectedValue(error);
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ENRICHED ---
  describe("getOneByUserIdEnriched", () => {
    req.params = {
      userId: "436d798e-b084-454c-8f78-593e966a9a66",
      commentId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
    };

    it("Return character if exists", async () => {
      const mockCommentEnriched: CommentEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        content: "Ready to fight",
        user: {
          id: "436d798e-b084-454c-8f78-593e966a9a66",
          username: "Goldorak",
        },
        event: {
          id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
          title: "Donjon minotot",
          date: new Date("2026-01-01"),
          duration: 60,
          area: "Amakna",
          sub_area: "Ile des taures",
          donjon_name: "Labyrinthe du minotoror",
          description: "donjon full succès",
          max_players: 8,
          status: "public",
        },
      };

      mockGetOneEnriched.mockResolvedValue(mockCommentEnriched);
      await underTest.getOneEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockCommentEnriched);
    });

    it("Call next() if comment doesn't exists.", async () => {
      mockGetOneEnriched.mockResolvedValue(null);
      await underTest.getOneEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOneEnriched.mockRejectedValue(error);
      await underTest.getOneEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- POST ---
  describe("post", () => {
    it("Return comment if create.", async () => {
      // GIVEN
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      req.body = {
        content: "Ready to fight",
      };
      const mockDatas: CommentBodyData = req.body;
      const mockNewComment: CommentEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        content: "Ready to fight",
        user: { id: "436d798e-b084-454c-8f78-593e966a9a66", username: "toto" },
        event: {
          id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
          title: "Donjon minotot",
          date: new Date("2026-01-01"),
          duration: 60,
          area: "Amakna",
          sub_area: "Ile des taures",
          donjon_name: "Labyrinthe du minotoror",
          description: "donjon full succès",
          max_players: 8,
          status: "public",
        },
      };

      mockPost.mockResolvedValue(mockNewComment);
      // WHEN
      await underTest.post(req as Request, res as Response, next);
      //THEN
      expect(mockPost).toHaveBeenCalledWith(mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockNewComment);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });
  });

  // --- PATCH ---
  describe("update", () => {
    it("Return comment if updated.", async () => {
      // GIVEN
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        commentId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
      };
      req.body = {
        content: "Are we needed special breed?",
      };
      const mockDatas: CommentBodyData = req.body;
      const mockCommentToUpdate: CommentEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        content: "Are we needed special breed?",
      };
      const mockUpdatedComment = { ...mockCommentToUpdate, ...mockDatas };

      mockUpdate.mockResolvedValue(mockUpdatedComment);
      // WHEN
      await underTest.update(req as Request, res as Response, next);
      //THEN
      expect(mockUpdatedComment.content).toBe("Are we needed special breed?");
      expect(mockUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.params.commentId,
        mockDatas,
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedComment);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
    });

    it("Call next() if character doesn't exists.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        commentId: "3aa64b38-e41c-44ae-94ea-3b75082fb8fb",
      };
      req.body = {
        content: "Are we needed special breed?",
      };

      mockUpdate.mockResolvedValue(null);
      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        commentId: "3aa64b38-e41c-44ae-94ea-3b75082fb8fb",
      };
      req.body = {
        content: "Are we needed special breed?",
      };
      const error = new Error();

      mockUpdate.mockRejectedValue(error);
      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- DELETE ---
  describe("delete", () => {
    req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

    it("Return 204 if comment is delete.", async () => {
      // GIVEN
      mockDelete.mockResolvedValue(true);
      // WHEN
      await underTest.delete(req as Request, res as Response, next);
      //THEN
      expect(mockDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Call next() if comment doesn't exists.", async () => {
      mockDelete.mockResolvedValue(false);
      await underTest.delete(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockDelete.mockRejectedValue(error);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
