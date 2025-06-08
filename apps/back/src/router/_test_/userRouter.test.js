import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { User } from "../../models/User.js";

// Mock Event
vi.mock("../../models/User.js", () => ({
  User: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    save: vi.fn(),
    get: vi.fn()
  }
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("GET /user/:id", () => {
  const validUser = {
    id: 1,
    username: "diabloX9",
    password: "F@ut!nv3nt3r1m0tdep@ss3",
    mail: "diabloX9@wanadoo.fr"
  };

  it("Should return user corresponding to id and 200", async () => {
    //Prepare the fake model response
    User.findByPk.mockResolvedValue(validUser);

    const response = await request(app)
      .get("/user/1")
      .expect(200);

    expect(response.body).toEqual(validUser);
  });

  it("Should call next() if user not found", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/user/999");

    expect(response.status).toBe(404);
    expect(User.findByPk).toHaveBeenCalledWith(
      "999",
      expect.objectContaining({
        attributes: expect.any(Object),
        include: expect.any(Array),
      })
    );
  });
});

describe("POST /user", () => {
  const validUser = {
    username: 'JohnDoe',
    password: 'StrongP@ss1',
    confirm_password: 'StrongP@ss1',
    mail: 'john@example.com',
    avatar: 'https://example.com/avatar.png'
  };

  it("Should create a new user and return 201", async () => {
    // Prepare the fake model response
    User.create.mockResolvedValue({
      id: 1,
      ...validUser
    });

    const response = await request(app)
      .post("/user")
      .send(validUser)
      .expect(201);

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      username: validUser.username,
      avatar: validUser.avatar,
      password: expect.stringMatching(/^\$argon2id\$/),  // hash Argon2
      mail: expect.not.stringContaining('@'),           // mail encrypted
    }));

    expect(response.body).toEqual({
      id: 1,
      ...validUser
    });
  });

  it("Should return 400 for invalid data", async () => {
    const invalid = { ...validUser, username: undefined };

    const response = await request(app)
      .post("/user")
      .send(invalid)
      .expect(400);

    expect(response.body).toHaveProperty("error", true);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("details");
  });
});

describe("PATCH /user/:id", () => {

  it("Should update user and return 200", async () => {
    const mockUserInstance = {
      username: "diabloX9",
      password: "hashedPassword", // hashed value simulated
      mail: "diabloX9@wanadoo.fr",
      avatar: null,
      save: vi.fn().mockResolvedValue(),  // mock save async
      get: vi.fn().mockReturnValue({
        id: 1,
        username: "diabloX9",
        avatar: null,
        // password and mail exist but will be delete in response
        password: "hashedPassword",
        mail: "angelX9@wanadoo.com", // mail update
      }),
    };

    User.findByPk = vi.fn().mockResolvedValue(mockUserInstance);

    const updatedData = { mail: "angerX9@wanadoo.com" };

    const response = await request(app)
      .patch("/user/1")
      .send(updatedData)
      .expect(200);

    expect(User.findByPk).toHaveBeenCalledWith("1");
    expect(mockUserInstance.save).toHaveBeenCalled();

    // Verify final response without password
    expect(response.body).toEqual({
      id: 1,
      username: "diabloX9",
      avatar: null,
    });
  });

  it("Should return 400 when update data is invalid", async () => {
    const invalidData = {
      mail: "not-an-email"
    };

    const response = await request(app)
      .patch("/user/1")
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty("error", true);
    expect(response.body).toHaveProperty("message");
  });

  it("Should return 404 if user not found", async () => {
    User.findByPk = vi.fn().mockResolvedValue(null);

    const updatedData = {
      mail: "angelX9@wanadoo.com"
    };

    const response = await request(app)
      .patch("/user/999")
      .send(updatedData)
      .expect(404);

    expect(response.body).toEqual({
      error: true,
      message: "Not found"
    });
  });
});

describe("DELETE /user/:id", () => {
  const validUser = {
    id: 1,
    username: "diabloX9",
    password: "F@ut!nv3nt3r1m0tdep@ss3",
    mail: "diabloX9@wanadoo.fr"
  };

  it("Should return 204 if user exists and is deleted", async () => {
    User.findByPk.mockResolvedValue(validUser);
    User.destroy.mockResolvedValue(1); // Return number of deleted lines

    const response = await request(app).delete("/user/1").expect(204);

    expect(User.findByPk).toHaveBeenCalledWith("1");
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(response.text).toBe("");
  });

  it("Should call next() if user doesn't exist", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/user/999").expect(404);

    expect(User.findByPk).toHaveBeenCalledWith("999");
    expect(User.destroy).not.toHaveBeenCalled();
  });
})
