import request from "supertest";
import { Response } from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";

import express, { Express } from "express";

import serverRouter from "../serverRouter.js";
import Server from "../../../database/models/Server.js";
import { serverController } from "../../controllers/serverController.js";
import {
  errorHandler,
  notFound,
} from "../../../middlewares/utils/errorHandler.js";

let app: Express;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use("/", serverRouter);
  app.use(notFound);
  app.use(errorHandler);
  vi.restoreAllMocks();
});

describe("GET /servers", () => {
  it("Return all servers.", async () => {
    const fakeServers: Server[] = [
      Server.build({ id: 1, name: "Dakal", mono_account: true }),
    ];

    vi.spyOn(Server, "findAll").mockResolvedValue(fakeServers);

    const res: Response = await request(app).get("/servers");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeServers.map((server) => server.toJSON()));
  });

  it("Return 404 if any server found.", async () => {
    vi.spyOn(Server, "findAll").mockResolvedValue([]);

    const res: Response = await request(app).get("/servers");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Any server found" });
  });

  it("appelle next() en cas d'erreur", async () => {
    vi.spyOn(serverController, "getAll").mockImplementation(
      (_req, _res, next) => {
        next(new Error("Unexpected error"));
        return Promise.resolve();
      },
    );

    const res: Response = await request(app).get("/servers");

    expect(res.status).toBe(500);
  });
});

describe("GET /server/:id", () => {
  it("Return one server.", async () => {
    const fakeServer: Server = Server.build({
      id: 1,
      name: "Dakal",
      mono_account: true,
    });

    vi.spyOn(Server, "findByPk").mockResolvedValue(fakeServer);

    const res: Response = await request(app).get("/server/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeServer.toJSON());
  });

  it("Return 400 for invalid ID.", async () => {
    const res: Response = await request(app).get("/server/abc");

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toBe("Invalid ID");
  });

  it("renvoie 404 si aucun serveur trouvé", async () => {
    vi.spyOn(Server, "findByPk").mockResolvedValue(null);

    const res: Response = await request(app).get("/server/999");

    expect(res.status).toBe(404);
  });

  it("appelle next() en cas d'erreur", async () => {
    vi.spyOn(serverController, "getOne").mockImplementation(
      (_req, _res, next) => {
        next(new Error("DB failure"));
        return Promise.resolve();
      },
    );

    const res: Response = await request(app).get("/server/1");

    expect(res.status).toBe(500);
  });
});
