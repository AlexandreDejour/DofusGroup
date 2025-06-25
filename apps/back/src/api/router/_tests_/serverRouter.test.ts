import { vi, describe, it, expect, beforeEach } from "vitest";

import request from "supertest";
import express, { Express, NextFunction, Request, Response } from "express";

import validateInt from "../../../middlewares/utils/validateInt.js";

let app: Express;

vi.mock("../../controllers/serverController.js");
const mockGetAll = vi.spyOn(ServerController.prototype, "getAll");
const mockGetOne = vi.spyOn(ServerController.prototype, "getOne");

import serverRouter from "../serverRouter.js";
import { ServerController } from "../../controllers/serverController.js";

describe("serverRouter", () => {
  beforeEach(() => {
    app = express();
    app.use(serverRouter);
    vi.resetAllMocks();
  });

  describe("GET /servers", () => {
    it("Propagate request to serverController.getAll", async () => {
      //GIVEN
      (mockGetAll as any).mockImplementationOnce(
        (_req: Request, res: Response, next: NextFunction) => {
          res.status(200).json("Success!");
          // return Promise.resolve();
        },
      );
      //WHEN
      const res = await request(app).get("/servers");
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
    });
  });

  describe("GET /server/:id", () => {});
});
