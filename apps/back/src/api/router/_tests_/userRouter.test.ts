import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import status from "http-status";

import { setup, receivedReq } from "./mock-tools.js";
import { createUserRouter } from "../userRouter.js";
import { UserController } from "../../controllers/userController.js";
import { UserRepository } from "../../../middlewares/repository/userRepository.js";

describe("userRouter", () => {
  const repository = {} as UserRepository;
  const controller = new UserController(repository);
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = setup.App(controller, createUserRouter);
  });

  const userId = "527be2f3-5903-4a98-a47d-e4bd593db73e";

  describe("GET /users", () => {
    it("Propagate request to userController.getAll", async () => {
      //GIVEN
      controller.getAll = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/users`);
      //THEN
      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAll = setup.mockNextCall();

      const res = await request(app).get(`/users`);

      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    describe("GET /user/:userId", () => {
      it("Propagate request to userController.getOne", async () => {
        //GIVEN
        controller.getOne = setup.mockSucessCall(status.OK);
        //WHEN
        const res = await request(app).get(`/user/${userId}`);
        //THEN
        expect(controller.getOne).toHaveBeenCalled();
        expect(receivedReq?.params.userId).toBe(userId);
        expect(res.status).toBe(status.OK);
        expect(res.body).toBe("Success!");
      });

      it("Next is called at end route.", async () => {
        controller.getOne = setup.mockNextCall();

        const res = await request(app).get(`/user/${userId}`);

        expect(controller.getOne).toHaveBeenCalled();
        expect(res.status).toBe(status.NOT_FOUND);
        expect(res.body).toEqual({ called: "next" });
      });

      it("Excluded bad request when id isn't a UUID.", async () => {
        const res = await request(app).get("/user/1234");

        expect(controller.getOne).not.toHaveBeenCalled();
        expect(res.status).toBe(status.BAD_REQUEST);
      });
    });

    describe("GET /users/enriched", () => {
      it("Propagate request to userController.getAllEnriched", async () => {
        //GIVEN
        controller.getAllEnriched = setup.mockSucessCall(status.OK);
        //WHEN
        const res = await request(app).get(`/users/enriched`);
        //THEN
        expect(controller.getAllEnriched).toHaveBeenCalled();
        expect(res.status).toBe(status.OK);
        expect(res.body).toBe("Success!");
      });

      it("Next is called at end route.", async () => {
        controller.getAllEnriched = setup.mockNextCall();

        const res = await request(app).get(`/users/enriched`);

        expect(controller.getAllEnriched).toHaveBeenCalled();
        expect(res.status).toBe(status.NOT_FOUND);
        expect(res.body).toEqual({ called: "next" });
      });
    });

    describe("GET /user/:userId/enriched", () => {
      it("Propagate request to userController.getOneEnriched", async () => {
        //GIVEN
        controller.getOneEnriched = setup.mockSucessCall(status.OK);
        //WHEN
        const res = await request(app).get(`/user/${userId}/enriched`);
        //THEN
        expect(controller.getOneEnriched).toHaveBeenCalled();
        expect(receivedReq?.params.userId).toBe(userId);
        expect(res.status).toBe(status.OK);
        expect(res.body).toBe("Success!");
      });

      it("Next is called at end route.", async () => {
        controller.getOneEnriched = setup.mockNextCall();

        const res = await request(app).get(`/user/${userId}/enriched`);

        expect(controller.getOneEnriched).toHaveBeenCalled();
        expect(res.status).toBe(status.NOT_FOUND);
        expect(res.body).toEqual({ called: "next" });
      });

      it("Excluded bad request when id isn't a UUID.", async () => {
        const res = await request(app).get("/user/1234/enriched");

        expect(controller.getOneEnriched).not.toHaveBeenCalled();
        expect(res.status).toBe(status.BAD_REQUEST);
      });
    });

    describe("POST /user", () => {
      it("Propagate request to userController.post", async () => {
        //GIVEN
        controller.post = setup.mockSucessCall(status.CREATED);
        //WHEN
        const res = await request(app).post(`/user`);
        //THEN
        expect(controller.post).toHaveBeenCalled();
        expect(res.status).toBe(status.CREATED);
        expect(res.body).toBe("Success!");
      });

      it("Next is called at end route.", async () => {
        controller.post = setup.mockNextCall();

        const res = await request(app).post(`/user`);

        expect(controller.post).toHaveBeenCalled();
        expect(res.status).toBe(status.NOT_FOUND);
        expect(res.body).toEqual({ called: "next" });
      });
    });

    describe("PATCH /user/:userId", () => {
      it("Propagate request to userController.update", async () => {
        //GIVEN
        controller.update = setup.mockSucessCall(status.OK);
        //WHEN
        const res = await request(app).patch(`/user/${userId}`);
        //THEN
        expect(controller.update).toHaveBeenCalled();
        expect(receivedReq?.params.userId).toBe(userId);
        expect(res.status).toBe(status.OK);
        expect(res.body).toBe("Success!");
      });

      it("Next is called at end route.", async () => {
        controller.update = setup.mockNextCall();

        const res = await request(app).patch(`/user/${userId}`);

        expect(controller.update).toHaveBeenCalled();
        expect(res.status).toBe(status.NOT_FOUND);
        expect(res.body).toEqual({ called: "next" });
      });

      it("Excluded bad request when id isn't a UUID.", async () => {
        const res = await request(app).patch("/user/1234");

        expect(controller.update).not.toHaveBeenCalled();
        expect(res.status).toBe(status.BAD_REQUEST);
      });
    });

    describe("DELETE /user/:userId", () => {
      it("Propagate request to userController.delete", async () => {
        //GIVEN
        controller.delete = setup.mockSucessCall(status.NO_CONTENT);
        //WHEN
        const res = await request(app).delete(`/user/${userId}`);
        //THEN
        expect(controller.delete).toHaveBeenCalled();
        expect(receivedReq?.params.userId).toBe(userId);
        expect(res.status).toBe(status.NO_CONTENT);
        expect(res.body).toEqual({});
      });

      it("Next is called at end route.", async () => {
        controller.delete = setup.mockNextCall();

        const res = await request(app).delete(`/user/${userId}`);

        expect(controller.delete).toHaveBeenCalled();
        expect(res.status).toBe(status.NOT_FOUND);
        expect(res.body).toEqual({ called: "next" });
      });

      it("Excluded bad request when id isn't a UUID.", async () => {
        const res = await request(app).delete("/user/1234");

        expect(controller.delete).not.toHaveBeenCalled();
        expect(res.status).toBe(status.BAD_REQUEST);
      });
    });
  });
});
