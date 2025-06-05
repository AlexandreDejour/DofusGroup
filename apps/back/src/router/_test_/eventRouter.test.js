import request from "supertest";

import { describe, it, expect, vi } from "vitest";

import { app } from "../../app/app.js";
import { Event } from "../../models/Event.js";

// Mock Event.create
vi.mock("../../models/Event.js", () => ({
  Event: {
    create: vi.fn()
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
    server_id: 42
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
