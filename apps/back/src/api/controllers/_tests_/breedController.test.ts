import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import { Breed } from "../../../types/breed.js";
import { BreedController } from "../breedController.js";
import { BreedRepository } from "../../../middlewares/repository/breedRepository.js";

describe("BreedController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/breedRepository.js");
  const mockGetAll = vi.spyOn(BreedRepository.prototype, "getAll");
  const mockGetOne = vi.spyOn(BreedRepository.prototype, "getOne");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: BreedController = new BreedController(new BreedRepository());

  // --- GET ALL ---
  describe("getAll", () => {
    it("Return breeds if exist.", async () => {
      // GIVEN
      const mockBreeds: Breed[] = [
        {
          id: "e9d9d650-e194-4a4d-9035-d3a87696a47d",
          name: "Sram",
        },
      ];

      mockGetAll.mockResolvedValue(mockBreeds);
      // WHEN
      await underTest.getAll(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockBreeds);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 204 if any breed found.", async () => {
      const mockBreeds: Breed[] = [];

      mockGetAll.mockResolvedValue(mockBreeds);
      await underTest.getAll(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any breed found" });
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
    req.params = { breedId: "e9d9d650-e194-4a4d-9035-d3a87696a47d" };
    it("Return breed if exists", async () => {
      const mockBreed: Breed = {
        id: "e9d9d650-e194-4a4d-9035-d3a87696a47d",
        name: "Sram",
      };

      mockGetOne.mockResolvedValue(mockBreed);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockBreed);
    });

    it("Call next() if breed doesn't exists.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Breed not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
