import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import { User, UserBodyData, UserEnriched } from "../../../types/user.js";
import { UserController } from "../userController.js";
import { UserRepository } from "../../../middlewares/repository/userRepository.js";

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/userRepository.js");
  const mockGetAll = vi.spyOn(UserRepository.prototype, "getAll");
  const mockGetOne = vi.spyOn(UserRepository.prototype, "getOne");
  const mockGetAllEnriched = vi.spyOn(
    UserRepository.prototype,
    "getAllEnriched",
  );
  const mockGetOneEnriched = vi.spyOn(
    UserRepository.prototype,
    "getOneEnriched",
  );
  const mockUpdate = vi.spyOn(UserRepository.prototype, "update");
  const mockDelete = vi.spyOn(UserRepository.prototype, "delete");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: UserController = new UserController(new UserRepository());

  // --- GET ALL ---
  describe("getAll", () => {
    it("Return users if exist.", async () => {
      // GIVEN
      const mockUsers: User[] = [
        {
          id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          username: "toto",
        },
      ];

      mockGetAll.mockResolvedValue(mockUsers);
      // WHEN
      await underTest.getAll(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any character found.", async () => {
      const mockUsers: User[] = [];

      mockGetAll.mockResolvedValue(mockUsers);
      await underTest.getAll(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any user found" });
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
    req.params = {
      userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
    };

    it("Return user if exists", async () => {
      const mockUser: User = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        username: "toto",
      };

      mockGetOne.mockResolvedValue(mockUser);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("Call next() if user doesn't exists.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL ENRICHED ---
  describe("getAllByUserIdEnriched", () => {
    it("Return users if exist.", async () => {
      // GIVEN
      const mockUsersEnriched: UserEnriched[] = [
        {
          id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          username: "toto",
          characters: [
            {
              id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
              name: "Night-Hunter",
              sex: "M",
              level: 190,
              alignment: "Bonta",
              stuff: "https://d-bk.net/fr/d/1EFhw",
              default_character: true,
            },
          ],
          events: [],
        },
      ];

      mockGetAllEnriched.mockResolvedValue(mockUsersEnriched);
      // WHEN
      await underTest.getAllEnriched(req as Request, res as Response, next);
      //THEN
      expect(mockGetAllEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsersEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any user found.", async () => {
      req.params = { userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2" };
      const mockUsersEnriched: UserEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockUsersEnriched);
      await underTest.getAllEnriched(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any user found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAllEnriched.mockRejectedValue(error);
      await underTest.getAllEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ENRICHED ---
  describe("getOneEnriched", () => {
    req.params = {
      userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
    };

    it("Return user if exists", async () => {
      const mockUserEnriched: UserEnriched = {
        id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        username: "toto",
        characters: [
          {
            id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
            name: "Night-Hunter",
            sex: "M",
            level: 190,
            alignment: "Bonta",
            stuff: "https://d-bk.net/fr/d/1EFhw",
            default_character: true,
          },
        ],
        events: [],
      };

      mockGetOneEnriched.mockResolvedValue(mockUserEnriched);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockUserEnriched);
    });

    it("Call next() if user doesn't exists.", async () => {
      mockGetOneEnriched.mockResolvedValue(null);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOneEnriched.mockRejectedValue(error);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- PATCH ---
  describe("update", () => {
    it("Return user if updated.", async () => {
      // GIVEN
      req.params = {
        userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
      };
      req.body = {
        username: "tata",
        mail: "tata@exemple.com",
      };

      const mockDatas: UserBodyData = req.body;
      const mockUserToUpdate: UserEnriched = {
        id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        username: "toto",
        characters: [
          {
            id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
            name: "Night-Hunter",
            sex: "M",
            level: 190,
            alignment: "Bonta",
            stuff: "https://d-bk.net/fr/d/1EFhw",
            default_character: true,
          },
        ],
        events: [],
      };
      const mockUpdatedUser = { ...mockUserToUpdate, ...mockDatas };

      mockUpdate.mockResolvedValue(mockUpdatedUser);
      // WHEN
      await underTest.update(req as Request, res as Response, next);
      //THEN
      expect(mockUpdatedUser.username).toBe("tata");
      expect(mockUpdatedUser.mail).toBe("tata@exemple.com");
      expect(mockUpdate).toHaveBeenCalledWith(req.params.userId, mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
    });

    it("Call next() if user doesn't exists.", async () => {
      req.params = {
        userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
      };
      req.body = {
        username: "tata",
        mail: "tata@exemple.com",
      };

      mockUpdate.mockResolvedValue(null);
      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
      };
      req.body = {
        username: "tata",
        mail: "tata@exemple.com",
      };

      const error = new Error();

      mockUpdate.mockRejectedValue(error);
      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- DELETE ---
  describe("delete", () => {
    req.params = { userId: "07a3cd78-3a4a-4aae-a681-7634d72197c2" };

    it("Return 204 if user is delete.", async () => {
      // GIVEN
      mockDelete.mockResolvedValue(true);
      // WHEN
      await underTest.delete(req as Request, res as Response, next);
      //THEN
      expect(mockDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Call next() if character doesn't exists.", async () => {
      mockDelete.mockResolvedValue(false);
      await underTest.delete(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockDelete.mockRejectedValue(error);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
