import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";

import jwt from "jsonwebtoken";
import status from "http-status";

import { Config } from "../../../config/config.js";
import { setup, receivedReq } from "./mock-tools.js";
import { AuthService } from "../../../middlewares/utils/authService.js";
import { createEventRouter } from "../eventRouter.js";
import { EventController } from "../../controllers/eventController.js";
import { EventRepository } from "../../../middlewares/repository/eventRepository.js";

describe("eventRouter", () => {
  const repository = {} as EventRepository;
  const controller = new EventController(repository);
  const service = new AuthService();
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = setup.App<EventController, [AuthService]>(
      controller,
      createEventRouter,
      {
        routerFactoryArgs: [service],
      },
    );
  });

  const config = Config.getInstance();
  const secret = config.jwtSecret;
  const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";
  const eventId = "18d99a7c-1d47-4391-bacd-cc4848165768";
  const token = jwt.sign({ id: userId }, secret, { expiresIn: "2h" });

  describe("GET /events", () => {
    it("Propagate request to eventController.getAll", async () => {
      //GIVEN
      controller.getAll = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get("/events");
      //THEN
      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAll = setup.mockNextCall();

      const res = await request(app).get("/events");

      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /events/enriched", () => {
    it("Propagate request to eventController.getAllEnriched", async () => {
      //GIVEN
      controller.getAllEnriched = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get("/events/enriched");
      //THEN
      expect(controller.getAllEnriched).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAllEnriched = setup.mockNextCall();

      const res = await request(app).get("/events/enriched");

      expect(controller.getAllEnriched).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /events/registered", () => {
    it("Propagate request to eventController.getAllRegistered", async () => {
      //GIVEN
      controller.getAllRegistered = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get("/events/registered");
      //THEN
      expect(controller.getAllRegistered).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAllRegistered = setup.mockNextCall();

      const res = await request(app).get("/events/registered");

      expect(controller.getAllRegistered).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /events/:userId", () => {
    it("Propagate request to eventController.getAllByUserId", async () => {
      //GIVEN
      controller.getAllByUserId = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/user/${userId}/events`);
      //THEN
      expect(controller.getAllByUserId).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAllByUserId = setup.mockNextCall();

      const res = await request(app).get(`/user/${userId}/events`);

      expect(controller.getAllByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /event/:eventId", () => {
    it("Propagate request to eventController.getOne", async () => {
      //GIVEN
      controller.getOne = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/event/${eventId}`);
      //THEN
      expect(controller.getOne).toHaveBeenCalled();
      expect(receivedReq?.params.eventId).toBe(eventId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOne = setup.mockNextCall();

      const res = await request(app).get(`/event/${eventId}`);

      expect(controller.getOne).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/event/toto");

      expect(controller.getOne).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /event/:eventId/enriched", () => {
    it("Propagate request to eventController.getOneEnriched", async () => {
      //GIVEN
      controller.getOneEnriched = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/event/${eventId}/enriched`);
      //THEN
      expect(controller.getOneEnriched).toHaveBeenCalled();
      expect(receivedReq?.params.eventId).toBe(eventId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOneEnriched = setup.mockNextCall();

      const res = await request(app).get(`/event/${eventId}/enriched`);

      expect(controller.getOneEnriched).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/event/toto/enriched");

      expect(controller.getOneEnriched).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("POST /user/:userId/event", () => {
    it("Propagate request to eventController.post", async () => {
      //GIVEN
      controller.post = setup.mockSucessCall(status.CREATED);
      //WHEN
      const res = await request(app)
        .post(`/user/${userId}/event`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.post).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.CREATED);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.post = setup.mockNextCall();

      const res = await request(app)
        .post(`/user/${userId}/event`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.post).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .post("/user/1234/event")
        .set("Cookie", [`token=${token}`]);

      expect(controller.post).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .post(`/user/${otherUserId}/event/`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.post).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });

  describe("POST /event/:eventId/addCharacters", () => {
    it("Propagate request to eventController.addCharactersToEvent", async () => {
      //GIVEN
      controller.addCharactersToEvent = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).post(`/event/${eventId}/addCharacters`);
      //THEN
      expect(controller.addCharactersToEvent).toHaveBeenCalled();
      expect(receivedReq?.params.eventId).toBe(eventId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.addCharactersToEvent = setup.mockNextCall();

      const res = await request(app).post(`/event/${eventId}/addCharacters`);

      expect(controller.addCharactersToEvent).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).post("/event/1234/addCharacters");

      expect(controller.addCharactersToEvent).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("POST /event/:eventId/removeCharacters", () => {
    it("Propagate request to eventController.removeCharactersFromEvent", async () => {
      //GIVEN
      controller.removeCharacterFromEvent = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).post(`/event/${eventId}/removeCharacter`);
      //THEN
      expect(controller.removeCharacterFromEvent).toHaveBeenCalled();
      expect(receivedReq?.params.eventId).toBe(eventId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.removeCharacterFromEvent = setup.mockNextCall();

      const res = await request(app).post(`/event/${eventId}/removeCharacter`);

      expect(controller.removeCharacterFromEvent).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).post("/event/1234/removeCharacter");

      expect(controller.removeCharacterFromEvent).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("PATCH /user/:userId/event/:eventId", () => {
    it("Propagate request to eventController.update", async () => {
      //GIVEN
      controller.update = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app)
        .patch(`/user/${userId}/event/${eventId}`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.update).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(receivedReq?.params.eventId).toBe(eventId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.update = setup.mockNextCall();

      const res = await request(app)
        .patch(`/user/${userId}/event/${eventId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .patch("/user/1234/event/toto")
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .patch(`/user/${otherUserId}/event/${eventId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });

  describe("DELETE /user/:userId/event/:eventId", () => {
    it("Propagate request to eventController.delete", async () => {
      //GIVEN
      controller.delete = setup.mockSucessCall(status.NO_CONTENT);
      //WHEN
      const res = await request(app)
        .delete(`/user/${userId}/event/${eventId}`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.delete).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(receivedReq?.params.eventId).toBe(eventId);
      expect(res.status).toBe(status.NO_CONTENT);
      expect(res.body).toEqual({});
    });

    it("Next is called at end route.", async () => {
      controller.delete = setup.mockNextCall();

      const res = await request(app)
        .delete(`/user/${userId}/event/${eventId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.delete).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .delete("/user/1234/event/toto")
        .set("Cookie", [`token=${token}`]);

      expect(controller.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .delete(`/user/${otherUserId}/event/${eventId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });
});
