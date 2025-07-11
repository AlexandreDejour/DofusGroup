import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import status from "http-status";

import { setup, receivedReq } from "./mock-tools.js";
import { createBreedRouter } from "../breedRouter.js";
import { BreedController } from "../../controllers/breedController.js";
import { BreedRepository } from "../../../middlewares/repository/breedRepository.js";

describe("breedRouter", () => {
  const repository = {} as BreedRepository;
  const controller = new BreedController(repository);
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = setup.App(controller, createBreedRouter);
  });

  const breedId = "e5b25782-deea-4f73-b8f0-47b7e0c99e67";

  describe("GET /breeds", () => {
    it("Propagate request to breedController.getAll", async () => {
      //GIVEN
      controller.getAll = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get("/breeds");
      //THEN
      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAll = setup.mockNextCall();

      const res = await request(app).get("/breeds");

      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /breed/:breedId", () => {
    it("Propagate request to breedController.getOne", async () => {
      //GIVEN
      controller.getOne = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/breed/${breedId}`);
      //THEN
      expect(controller.getOne).toHaveBeenCalled();
      expect(receivedReq?.params.breedId).toBe(breedId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOne = setup.mockNextCall();

      const res = await request(app).get(`/breed/${breedId}`);

      expect(controller.getOne).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/breed/toto");

      expect(controller.getOne).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });
});
