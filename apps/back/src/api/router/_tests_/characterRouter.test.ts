import request from "supertest";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";

import status from "http-status";
import express, { Express, NextFunction, Request, Response } from "express";

import { createCharacterRouter } from "../characterRouter.js";

let app: Express;

const characterControllerInstanceMock = {
  getAllByUserId: vi.fn(),
  getOneByUserId: vi.fn(),
  getAllEnrichedByUserId: vi.fn(),
  getOneEnrichedByUserId: vi.fn(),
  post: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("../../controllers/characterController.js", () => {
  return {
    CharacterController: vi
      .fn()
      .mockImplementation(() => characterControllerInstanceMock),
  };
});

function setupApp(): Express {
  const app = express();
  app.use(createCharacterRouter());
  app.use((_req, res) => {
    res.status(status.NOT_FOUND).json({ called: "next" });
  });
  return app;
}

describe("characterRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    app = setupApp();
  });

  describe("GET /user/:userId/characters", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";

    it("Propagate request to characterController.getAllByUserId", async () => {
      //GIVEN
      characterControllerInstanceMock.getAllByUserId.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(`/user/${userId}/characters`);
      //THEN
      expect(characterControllerInstanceMock.getAllByUserId).toHaveBeenCalled();
      const [req] =
        characterControllerInstanceMock.getAllByUserId.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.getAllByUserId.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(`/user/${userId}/characters`);

      expect(characterControllerInstanceMock.getAllByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/characters");

      expect(
        characterControllerInstanceMock.getAllByUserId,
      ).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/character/:characterId", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";
    const characterId = "18d99a7c-1d47-4391-bacd-cc4848165768";

    it("Propagate request to characterController.getOneByUserId", async () => {
      //GIVEN
      characterControllerInstanceMock.getOneByUserId.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(
        `/user/${userId}/character/${characterId}`,
      );
      //THEN
      expect(characterControllerInstanceMock.getOneByUserId).toHaveBeenCalled();
      const [req] =
        characterControllerInstanceMock.getOneByUserId.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(req.params.characterId).toBe(characterId);
      expect(characterControllerInstanceMock.getOneByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.getOneByUserId.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(
        `/user/${userId}/character/${characterId}`,
      );

      expect(characterControllerInstanceMock.getOneByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/character/toto");

      expect(
        characterControllerInstanceMock.getOneByUserId,
      ).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/characters/enriched", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";

    it("Propagate request to characterController.getAllByUserIdEnriched", async () => {
      //GIVEN
      characterControllerInstanceMock.getAllEnrichedByUserId.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(`/user/${userId}/characters/enriched`);
      //THEN
      expect(
        characterControllerInstanceMock.getAllEnrichedByUserId,
      ).toHaveBeenCalled();
      const [req] =
        characterControllerInstanceMock.getAllEnrichedByUserId.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.getAllEnrichedByUserId.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(`/user/${userId}/characters/enriched`);

      expect(
        characterControllerInstanceMock.getAllEnrichedByUserId,
      ).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/characters/enriched");

      expect(
        characterControllerInstanceMock.getAllEnrichedByUserId,
      ).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/character/enriched/:characterId", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";
    const characterId = "18d99a7c-1d47-4391-bacd-cc4848165768";

    it("Propagate request to characterController.getOneByUserIdEnriched", async () => {
      //GIVEN
      characterControllerInstanceMock.getOneEnrichedByUserId.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get(
        `/user/${userId}/character/enriched/${characterId}`,
      );
      //THEN
      expect(
        characterControllerInstanceMock.getOneEnrichedByUserId,
      ).toHaveBeenCalled();
      const [req] =
        characterControllerInstanceMock.getOneEnrichedByUserId.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(req.params.characterId).toBe(characterId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.getOneEnrichedByUserId.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).get(
        `/user/${userId}/character/enriched/${characterId}`,
      );

      expect(
        characterControllerInstanceMock.getOneEnrichedByUserId,
      ).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/character/enriched/toto");

      expect(
        characterControllerInstanceMock.getOneEnrichedByUserId,
      ).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("POST /user/:userId/character", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";

    it("Propagate request to characterController.post", async () => {
      //GIVEN
      characterControllerInstanceMock.post.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.CREATED).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).post(`/user/${userId}/character`);
      //THEN
      expect(characterControllerInstanceMock.post).toHaveBeenCalled();
      const [req] = characterControllerInstanceMock.post.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(res.status).toBe(status.CREATED);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.post.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).post(`/user/${userId}/character`);

      expect(characterControllerInstanceMock.post).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).post("/user/1234/character");

      expect(characterControllerInstanceMock.post).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("PATCH /user/:userId/character/:characterId", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";
    const characterId = "18d99a7c-1d47-4391-bacd-cc4848165768";

    it("Propagate request to characterController.update", async () => {
      //GIVEN
      characterControllerInstanceMock.update.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.OK).json("Success!");
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).patch(
        `/user/${userId}/character/${characterId}`,
      );
      //THEN
      expect(characterControllerInstanceMock.update).toHaveBeenCalled();
      const [req] = characterControllerInstanceMock.update.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(req.params.characterId).toBe(characterId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.update.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).patch(
        `/user/${userId}/character/${characterId}`,
      );

      expect(characterControllerInstanceMock.update).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).patch("/user/1234/character/toto");

      expect(characterControllerInstanceMock.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("DELETE /user/:userId/character/:characterId", () => {
    const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";
    const characterId = "18d99a7c-1d47-4391-bacd-cc4848165768";

    it("Propagate request to characterController.delete", async () => {
      //GIVEN
      characterControllerInstanceMock.delete.mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
          res.status(status.NO_CONTENT).end();
          return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).delete(
        `/user/${userId}/character/${characterId}`,
      );
      //THEN
      expect(characterControllerInstanceMock.delete).toHaveBeenCalled();
      const [req] = characterControllerInstanceMock.delete.mock.calls[0];
      expect(req.params.userId).toBe(userId);
      expect(req.params.characterId).toBe(characterId);
      expect(res.status).toBe(status.NO_CONTENT);
      expect(res.body).toEqual({});
    });

    it("Next is called at end route.", async () => {
      characterControllerInstanceMock.delete.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );

      const res = await request(app).delete(
        `/user/${userId}/character/${characterId}`,
      );

      expect(characterControllerInstanceMock.delete).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).delete("/user/1234/character/toto");

      expect(characterControllerInstanceMock.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });
});
