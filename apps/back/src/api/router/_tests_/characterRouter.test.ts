import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";

import status from "http-status";
import express, { Express, NextFunction, Request, Response } from "express";

import characterRouter from "../characterRouter.js";
import { CharacterController } from "../../controllers/characterController.js";

let app: Express;

vi.mock("../../controllers/characterController.js");

const mockGetAll = vi.spyOn(CharacterController.prototype, "getAllByUserId");
const mockGetOne = vi.spyOn(CharacterController.prototype, "getOneByUserId");
const mockGetAllEnriched = vi.spyOn(
  CharacterController.prototype,
  "getAllEnrichedByUserId",
);
const mockGetOneEnriched = vi.spyOn(
  CharacterController.prototype,
  "getOneEnrichedByUserId",
);
const mockPost = vi.spyOn(CharacterController.prototype, "post");
const mockUpdate = vi.spyOn(CharacterController.prototype, "update");
const mockDelete = vi.spyOn(CharacterController.prototype, "delete");

describe("characterRouter", () => {
  beforeEach(() => {
    app = express();
    app.use(characterRouter);
    app.use((_req, res) => {
      res.status(status.NOT_FOUND).json({ called: "next" });
    });
    vi.clearAllMocks();
  });

  describe("GET /user/:userId/characters", () => {
    it("Propagate request to characterController.getAllByUserId", async () => {
      //GIVEN
      mockGetAll.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/characters",
      );
      //THEN
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      mockGetAll.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/characters",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/characters");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/character/:characterId", () => {
    it("Propagate request to characterController.getOneByUserId", async () => {
      //GIVEN
      mockGetOne.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/18d99a7c-1d47-4391-bacd-cc4848165768",
      );
      //THEN
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      mockGetOne.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/18d99a7c-1d47-4391-bacd-cc4848165768",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/character/toto");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/characters/enriched", () => {
    it("Propagate request to characterController.getAllByUserIdEnriched", async () => {
      //GIVEN
      mockGetAllEnriched.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/characters/enriched",
      );
      //THEN
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      mockGetAllEnriched.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/characters/enriched",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/characters/enriched");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/character/enriched/:characterId", () => {
    it("Propagate request to characterController.getOneByUserIdEnriched", async () => {
      //GIVEN
      mockGetOneEnriched.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/enriched/af1ae2a1-45e3-47bc-8625-1a3bded01f6f",
      );
      //THEN
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      mockGetOneEnriched.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/enriched/af1ae2a1-45e3-47bc-8625-1a3bded01f6f",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/character/enriched/toto");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("POST /user/:userId/character", () => {
    it("Propagate request to characterController.post", async () => {
      //GIVEN
      mockPost.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.CREATED).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).post(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character",
      );
      //THEN
      expect(res.status).toBe(status.CREATED);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      mockPost.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).post(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).post("/user/1234/character");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("PATCH /user/:userId/character/:characterId", () => {
    it("Propagate request to characterController.update", async () => {
      //GIVEN
      mockUpdate.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).patch(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/18d99a7c-1d47-4391-bacd-cc4848165768",
      );
      //THEN
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      mockUpdate.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).patch(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/18d99a7c-1d47-4391-bacd-cc4848165768",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).patch("/user/1234/character/toto");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("DELETE /user/:userId/character/:characterId", () => {
    it("Propagate request to characterController.delete", async () => {
      //GIVEN
      mockDelete.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.NO_CONTENT).end();
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).delete(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/18d99a7c-1d47-4391-bacd-cc4848165768",
      );
      //THEN
      expect(res.status).toBe(status.NO_CONTENT);
      expect(res.body).toEqual({});
    });

    it("Next is called at end route.", async () => {
      mockDelete.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).delete(
        "/user/f0256483-0827-4cd5-923a-6bd10a135c4e/character/18d99a7c-1d47-4391-bacd-cc4848165768",
      );

      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).delete("/user/1234/character/toto");

      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });
});
