import { vi, describe, it, expect, beforeEach } from "vitest";

import request from "supertest";
import express, { Express, NextFunction, Request, Response } from "express";

import serverRouter from "../serverRouter.js";
import { ServerController } from "../../controllers/serverController.js";

let app: Express;

vi.mock("../../controllers/serverController.js");

const mockGetAll = vi.spyOn(ServerController.prototype, "getAll");
const mockGetOne = vi.spyOn(ServerController.prototype, "getOne");

describe("serverRouter", () => {
  beforeEach(() => {
    app = express();
    app.use(serverRouter);
    app.use((_req, res) => {
      res.status(404).json({ called: "next" });
    });
    vi.clearAllMocks();
  });

  describe("GET /servers", () => {
    it("Propagate request to serverController.getAll", async () => {
      //GIVEN
      (mockGetAll as any).mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction) => {
          res.status(200).json("Success!");
        },
      );
      //WHEN
      const res = await request(app).get("/servers");
      //THEN
      expect(res.status).toBe(200);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      (mockGetAll as any).mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction) => {
          next();
        },
      );

      const res = await request(app).get("/servers");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /server/:id", () => {
    it("Propagate request to serverController.getOne", async () => {
      //GIVEN
      (mockGetOne as any).mockImplementationOnce(
        (_req: Request, res: Response, _next: NextFunction) => {
          res.status(200).json("Success!");
        },
      );
      //WHEN
      const res = await request(app).get("/server/1");
      //THEN
      expect(res.status).toBe(200);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      (mockGetOne as any).mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction) => {
          next();
        },
      );

      const res = await request(app).get("/server/1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a number.", async () => {
      const res = await request(app).get("/server/toto");

      expect(res.status).toBe(400);
    });
  });
});
