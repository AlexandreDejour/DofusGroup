import { describe, it, expect, vi, beforeEach } from "vitest";
import { User } from "../../models/User.js";
import { userController } from "../../controllers/userController.js";

const mockSave = vi.fn();
const mockDestroy = vi.fn();

vi.mock("../../models/User.js", () => ({
  User: {
    findByPk: vi.fn(),
    create: vi.fn(),
  }
}));

describe("userController", () => {
  let res;
  let next;
  let req;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
      params: {},
    };
    req = {
      params: {},
      body: {},
    };
    next = vi.fn();
    mockSave.mockReset();
    mockDestroy.mockReset();
    vi.clearAllMocks();
  });

  describe("getOne", () => {
    it("should respond with user and relations if found", async () => {
      const mockUser = { id: 2, username: "Lisa", characters: [], events: [] };
      res.params.id = 2;
      User.findByPk.mockResolvedValue(mockUser);

      await userController.getOne({}, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(2, {
        attributes: { exclude: ["password", "mail"] },
        include: [
          { association: "characters" },
          { association: "events" }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user not found", async () => {
      res.params.id = 404;
      User.findByPk.mockResolvedValue(null);

      await userController.getOne({}, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("post", () => {
    it("should create and return a new user", async () => {
      const inputData = {
        username: "Newbie",
        password: "secure",
        mail: "test@mail.com",
        avatar: "url"
      };

      const mockCreatedUser = {
        id: 3,
        ...inputData
      };

      req.body = inputData;
      User.create.mockResolvedValue(mockCreatedUser);

      await userController.post(req, res);

      expect(User.create).toHaveBeenCalledWith(inputData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedUser);
    });
  });

  describe("update", () => {
    it("should update and return the updated user", async () => {
      req.params.id = 5;
      req.body = {
        username: "UpdatedUser",
        password: "newpass",
        mail: "new@mail.com",
        avatar: "newavatar"
      };
      const mockUser = {
        id: 5,
        username: "OldUser",
        password: "oldpass",
        mail: "old@mail.com",
        avatar: "oldavatar",
        save: mockSave.mockResolvedValue(),
        get: vi.fn().mockReturnValue({
          id: 5,
          username: "UpdatedUser",
          mail: "new@mail.com",
          avatar: "newavatar"
        })
      };

      User.findByPk.mockResolvedValue(mockUser);

      await userController.update(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(5);
      expect(mockSave).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 5,
        username: "UpdatedUser",
        avatar: "newavatar"
      }));

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user not found", async () => {
      req.params.id = 12;
      User.findByPk.mockResolvedValue(null);

      await userController.update(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete user if found", async () => {
      req.params.id = 7;
      const mockUser = {
        id: 7,
        destroy: mockDestroy.mockResolvedValue()
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.delete(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(7);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it("should call next() if user not found", async () => {
      req.params.id = 88;
      User.findByPk.mockResolvedValue(null);

      await userController.delete(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
