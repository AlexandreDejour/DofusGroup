import request from "supertest";

import { describe, it, expect, vi } from "vitest";

import { app } from "../../app/app.js";
import { Event } from "../../models/Event.js";

// Mock Event
vi.mock("../../models/Event.js", () => ({
  Event: {
    create: vi.fn(),
    update: vi.fn()
  }
}));

describe("POST /event", () => {
  const validEvent = {
    user_id: 1,
    title: "Donjon blop",
    tag_id: 2,
    date: "2025-06-30",
    duration: 2,
    area: "Cania",
    subarea: "Lac de Cania",
    donjon_name: "Donjon blop",
    max_players: 5,
    description: "EpicBattle123",
    status: "public",
    server_id: 10
  };

  it("should create a new event and return 201", async () => {
    // Prepare the fake model response
    Event.create.mockResolvedValue({
      id: 1,
      ...validEvent
    });

    const response = await request(app)
      .post("/event")
      .send(validEvent)
      .expect(201);

    expect(Event.create).toHaveBeenCalledWith({
      title: validEvent.title,
      date: validEvent.date,
      duration: validEvent.duration,
      area: validEvent.area,
      subarea: validEvent.subarea,
      donjon_name: validEvent.donjon_name,
      max_players: validEvent.max_players,
      description: validEvent.description,
      status: validEvent.status
    });

    expect(response.body).toEqual({
      id: 1,
      ...validEvent
    });
  });

  it("should return 400 for invalid data", async () => {
    const invalid = { ...validEvent, duration: "not-a-number" };

    const response = await request(app)
      .post("/event")
      .send(invalid)
      .expect(400);

    expect(response.body).toHaveProperty("error", true);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("details");
  });
});

describe("PATCH /event", () => {

  it("should update an event and return 200", async () => {
      Event.findByPk = vi.fn().mockResolvedValue({
        id: 1,
        title: "Donjon blop",
        date: "2025-06-30",
        duration: 2,
        area: "Cania",
        subarea: "Lac de Cania",
        donjon_name: "Donjon blop",
        max_players: 5,
        description: "EpicBattle123",
        status: "public"
      });

    Event.update = vi.fn().mockResolvedValue([1]);

    const updatedData = { title: "Donjon blop multicolor", duration: 3 };

    const response = await request(app)
      .patch("/event/1")
      .send(updatedData)
      .expect(200);
  });

  it("should return 400 when update data is invalid", async () => {
    const invalidData = {
      duration: "wrong-type"
    };

    const response = await request(app)
      .patch("/event/1")
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty("error", true);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 404 if event not found", async () => {
    Event.findByPk = vi.fn().mockResolvedValue(null); // Aucun enregistrement mis à jour

    const updatedData = {
      title: "Non-existent event"
    };

    const response = await request(app)
      .patch("/event/999")
      .send(updatedData)
      .expect(404);

    expect(response.body).toEqual({
      error: true,
      message: "Event not found"
    });
  });
});
