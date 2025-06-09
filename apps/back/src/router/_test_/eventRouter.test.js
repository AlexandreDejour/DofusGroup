import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { Event } from "../../models/Event.js";

// Mock Event
vi.mock("../../models/Event.js", () => ({
  Event: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn()
  }
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("GET /events", () => {
  const validEventList = [
    {
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
    },
    {
      user_id: 2,
      title: "Donjon kimbo",
      tag_id: 2,
      date: "2025-07-30",
      duration: 3,
      area: "Otomaï",
      subarea: "Arbre hakam",
      donjon_name: "Canopée du kimbo",
      max_players: 8,
      description: "EpicDonjon123",
      status: "public",
      server_id: 6
    }
  ];
  
  it("Should return events list and 200", async () => {
    //Prepare the fake model response
    Event.findAll.mockResolvedValue([...validEventList]);

    const response = await request(app)
      .get("/events")
      .expect(200);

    expect(response.body).toEqual([...validEventList]);
  });
});

describe("GET /event/:id", () => {
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

  it("Should return event corresponding to id and 200", async () => {
    //Prepare the fake model response
    Event.findByPk.mockResolvedValue(validEvent);

    const response = await request(app)
      .get("/event/1")
      .expect(200);

    expect(response.body).toEqual(validEvent);
  });

  it("Should call next() if event not found", async () => {
    Event.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/event/999");

    expect(response.status).toBe(404);
    expect(Event.findByPk).toHaveBeenCalledWith("999");
  });
})

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

  it("Should create a new event and return 201", async () => {
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

  it("Should return 400 for invalid data", async () => {
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

describe("PATCH /event/:id", () => {

  it("Should update an event and return 200", async () => {
    const mockUpdate = vi.fn().mockResolvedValue({
        id: 1,
        title: "Donjon blop multicolor",
        tag_id: 2,
        date: "2025-06-30",
        duration: 3,
        area: "Cania",
        subarea: "Lac de Cania",
        donjon_name: "Clos des blop",
        max_players: 5,
        description: "EpicBattle123",
        status: "public",
        server_id: 3
    })

    Event.findByPk = vi.fn().mockResolvedValue({
        id: 1,
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
        server_id: 3,
        update: mockUpdate
    });

    const updatedData = { title: "Donjon blop multicolor", duration: 3, donjon_name: "Clos des blop" };

    const response = await request(app)
      .patch("/event/1")
      .send(updatedData)
      .expect(200);
    
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      title: "Donjon blop multicolor",
      duration: 3,
      donjon_name: "Clos des blop",
    }));
  });

  it("Should return 400 when update data is invalid", async () => {
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

  it("Should return 404 if event not found", async () => {
    Event.findByPk = vi.fn().mockResolvedValue(null);

    const updatedData = {
      title: "Non-existent event"
    };

    const response = await request(app)
      .patch("/event/999")
      .send(updatedData)
      .expect(404);

    expect(response.body).toEqual({
      error: true,
      message: "Not found"
    });
  });
});

describe("DELETE /event/:id", () => {
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

  it("Should return 204 if event exists and is deleted", async () => {
    Event.findByPk.mockResolvedValue(validEvent);
    Event.destroy.mockResolvedValue(1); // Return number of deleted lines

    const response = await request(app).delete("/event/1").expect(204);

    expect(Event.findByPk).toHaveBeenCalledWith("1");
    expect(Event.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(response.text).toBe("");
  });

  it("Should call next() if event doesn't exist", async () => {
    Event.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/event/999").expect(404);

    expect(Event.findByPk).toHaveBeenCalledWith("999");
    expect(Event.destroy).not.toHaveBeenCalled();
  });
})
