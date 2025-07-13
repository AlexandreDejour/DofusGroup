import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import { Tag } from "../../../types/tag.js";
import { TagController } from "../tagController.js";
import { TagRepository } from "../../../middlewares/repository/tagRepository.js";

describe("TagController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/tagRepository.js");
  const mockGetAll = vi.spyOn(TagRepository.prototype, "getAll");
  const mockGetOne = vi.spyOn(TagRepository.prototype, "getOne");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: TagController = new TagController(new TagRepository());

  // --- GET ALL ---
  describe("getAll", () => {
    it("Return tags if exist.", async () => {
      // GIVEN
      const mockTags: Tag[] = [
        {
          id: "f2cbb03b-0295-4424-8bcf-e66eb84e2c00",
          name: "XP",
          color: "#3498db",
        },
      ];

      mockGetAll.mockResolvedValue(mockTags);
      // WHEN
      await underTest.getAll(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockTags);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 204 if any tag found.", async () => {
      const mockTags: Tag[] = [];

      mockGetAll.mockResolvedValue(mockTags);
      await underTest.getAll(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any tag found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAll(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOne", () => {
    it("Return tag if exists", async () => {
      req.params = { tagId: "f2cbb03b-0295-4424-8bcf-e66eb84e2c00" };
      const mockTag: Tag = {
        id: "f2cbb03b-0295-4424-8bcf-e66eb84e2c00",
        name: "XP",
        color: "#3498db",
      };

      mockGetOne.mockResolvedValue(mockTag);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockTag);
    });

    it("Call next() if tag doesn't exists.", async () => {
      req.params = { tagId: "f2cbb03b-0295-4424-8bcf-e66eb84e2c00" };

      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Tag not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = { breedId: "f2cbb03b-0295-4424-8bcf-e66eb84e2c00" };

      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
