import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { Character } from "../../models/Character.js";

// Mock Character
vi.mock("../../models/Character.js", () => ({
  Character: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
    get: vi.fn(),
  }
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("POST /character", () => {
  const validCharacter = {
    user_id: 1,
    name: "Seiya",
    sex: "male",
    level: 187,
    server_id: 3,
    breed_id: 7,
    default_character: true
  };

  it("Should create a new character and return 201", async () => {
    Character.create.mockResolvedValue({ id: 1, ...validCharacter });

    const response = await request(app)
      .post("/character")
      .send(validCharacter)
      .expect(201);

    expect(Character.create).toHaveBeenCalledWith(expect.objectContaining({
      name: validCharacter.name,
      sex: validCharacter.sex,
      level: validCharacter.level
    }));

    expect(response.body).toEqual({
      id: 1,
      ...validCharacter
    });
  });

  it("Should return 400 for invalid data", async () => {
    const invalidCharacter = { ...validCharacter, name: undefined };

    const response = await request(app)
      .post("/character")
      .send(invalidCharacter)
      .expect(400);

    expect(response.body).toHaveProperty("error", true);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /character/:id", () => {
  const validCharacter = {
    id: 1,
    name: "Seiya",
    sex: "male",
    level: 187,
    server_id: 7,
    breed_id: 3
  };

  it("Should return character and 200", async () => {
    Character.findByPk.mockResolvedValue(validCharacter);

    const response = await request(app)
      .get("/character/1")
      .expect(200);

    expect(response.body).toEqual(validCharacter);
  });

  it("Should return 404 if character not found", async () => {
    Character.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .get("/character/999")
      .expect(404);

    expect(response.body).toEqual({
      error: true,
      message: "Not found"
    });
  });
});

describe("PATCH /character/:id", () => {
  it("Should update character and return 200", async () => {
    Character.findByPk = vi.fn().mockResolvedValue({
        id: 1,
        name: "seiya",
        sex: "male",
        level: 199,
        server_id: 2,
        alignment: "Brakmar",
        breed_id: 1,
        stuff: "http://string.com",
        default_character: false
    })

    Character.update = vi.fn().mockResolvedValue([1]);

    const updatedData = { name: "Ken" };

    const response = await request(app)
      .patch("/character/1")
      .send(updatedData)
      .expect(200);
  });

  it("Should return 400 when update data is invalid", async () => {
    const invalidData = {
      name: 123456
    };

    const response = await request(app)
      .patch("/character/1")
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty("error", true);
    expect(response.body).toHaveProperty("message");
  });

  it("Should return 404 if character not found", async () => {
    Character.findByPk = vi.fn().mockResolvedValue(null);

    const updatedData = {
      name: "peggy"
    };

    const response = await request(app)
      .patch("/character/999")
      .send(updatedData)
      .expect(404);

    expect(response.body).toEqual({
      error: true,
      message: "Not found"
    });
  });
});

describe("DELETE /character/:id", () => {
  const validCharacter = {
    id: 1,
    name: "Seiya",
    sex: "male",
    level: 187,
    server_id: 7,
    breed_id: 3
  };

  it("Should return 204 if character exists and is deleted", async () => {
    Character.findByPk.mockResolvedValue(validCharacter);
    Character.destroy.mockResolvedValue(1);

    const response = await request(app)
      .delete("/character/1")
      .expect(204);

    expect(Character.findByPk).toHaveBeenCalledWith("1");
    expect(Character.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(response.text).toBe("");
  });

  it("Should return 404 if character doesn't exist", async () => {
    Character.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .delete("/character/999")
      .expect(404);

    expect(Character.findByPk).toHaveBeenCalledWith("999");
    expect(Character.destroy).not.toHaveBeenCalled();
  });
});
