import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../controllers/serverController.js", () => ({
  serverController: {
    getAll: vi.fn((_req, res) =>
      res.status(200).json([{ id: 1, name: "Dakal", mono_account: true }]),
    ),
    getOne: vi.fn((_req, res) =>
      res.status(200).json({ id: 1, name: "Dakal", mono_account: true }),
    ),
  },
}));

vi.mock("../../../middlewares/utils/validateInt.js", () => ({
  _esModule: true,
  default: vi.fn((req, res, next) => {
    console.log("validateInt id:", req.params.id);
    if (!/^\d+$/.test(req.params.id)) {
      console.log("validateInt: 400");
      return res.status(400).json({ error: "Invalid ID" });
    }
    console.log("validateInt: next");
    next();
  }),
}));

import request from "supertest";
import express, { Express, NextFunction, Request, Response } from "express";

import serverRouter from "../serverRouter.js";
import validateInt from "../../../middlewares/utils/validateInt.js";
import { serverController } from "../../controllers/serverController.js";
import {
  errorHandler,
  notFound,
} from "../../../middlewares/utils/errorHandler.js";

let app: Express;

beforeEach(() => {
  app = express();
  app.use(serverRouter);
  app.use(notFound);
  app.use(errorHandler);
  vi.resetAllMocks();
});

describe("GET /servers", () => {
  it("Return all servers.", async () => {
    const res = await request(app).get("/servers");

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([
      { id: 1, name: "Dakal", mono_account: true },
    ]);
    expect(serverController.getAll).toHaveBeenCalled();
  });

  it("Return 404 if any server found.", async () => {
    (serverController.getAll as any).mockImplementationOnce(
      (_req: Request, res: Response) => {
        res.status(404).json({ error: "Any server found" });
      },
    );

    const res = await request(app).get("/servers");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Any server found" });
  });

  it("Call next() in case of error.", async () => {
    (serverController.getAll as any).mockImplementationOnce(
      (_req: Request, _res: Response, next: NextFunction) => {
        next(new Error("Internal Server Error"));
      },
    );

    const res = await request(app).get("/servers");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /server/:id", () => {
  it("Return one server.", async () => {
    const res = await request(app).get("/server/1");

    expect(validateInt).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      id: 1,
      name: "Dakal",
      mono_account: true,
    });
  });

  it("Return 400 for invalid ID.", async () => {
    (serverController.getOne as any).mockImplementationOnce(
      (_req: Request, res: Response) => {
        res.status(400).json({ error: "Invalid ID" });
      },
    );

    const res = await request(app).get("/server/abc");

    expect(validateInt).toHaveBeenCalled();
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid ID" });
  });

  it("Return 404 if any server found.", async () => {
    (serverController.getOne as any).mockImplementationOnce(
      (req: Request, res: Response) => {
        console.log("controller called with id:", req.params.id);
        res.status(404).json({ error: "Server not found" });
      },
    );

    const res = await request(app).get("/server/999");

    expect(validateInt).toBeCalled();
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Server not found" });
  });

  it("Call next() in case of error.", async () => {
    (serverController.getOne as any).mockImplementationOnce(
      (_req: Request, _res: Response, next: NextFunction) => {
        next(new Error("Internal Server Error"));
      },
    );

    const res = await request(app).get("/server/1");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
  });
});
