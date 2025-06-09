import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { User } from "../../models/User.js";

// Mock User
vi.mock("../../models/User.js", () => ({
  User: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
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

  it("Should update user and return 200 with encrypted mail", async () => {
    const inputData = {
      mail: "john@example.com",
      username: "JohnUpdated",
      password: "newStrongP@ss123",
      confirm_password: "newStrongP@ss123",
      avatar: "https://newavatar.com"
    };

    const mockUserInstance = {
      id: 1,
      username: "OldUser",
      mail: "oldmail@example.com",
      password: "oldhashedpassword",
      avatar: "oldavatar.png",
      update: vi.fn().mockResolvedValue({
        id: 1,
        username: inputData.username,
        mail: inputData.mail,
        avatar: inputData.avatar,
        toJSON() {
          return {
            id: 1,
            username: inputData.username,
            mail: inputData.mail,
            avatar: inputData.avatar,
          };
        }
      })
    };

    User.findByPk.mockResolvedValue(mockUserInstance);

    const response = await request(app)
      .patch("/user/1")
      .send(inputData)
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      username: inputData.username,
      avatar: inputData.avatar,
    });

    const calledArgs = mockUserInstance.update.mock.calls[0][0];

    expect(calledArgs.mail).not.toBe(inputData.mail); // encrypted mail
    expect(calledArgs.password).not.toBe(inputData.password); // hash password

    expect(calledArgs.password).toMatch(/^\$argon2/); // corresponding argon2 reqEx
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
    const mockUserInstance = {
      ...validUser,
      destroy: vi.fn().mockResolvedValue()
    };

    User.findByPk.mockResolvedValue(mockUserInstance);

    const response = await request(app).delete("/user/1").expect(204);

    expect(User.findByPk).toHaveBeenCalledWith("1");
    expect(mockUserInstance.destroy).toHaveBeenCalled();
    expect(response.text).toBe("");
  });

  it("Should call next() if user doesn't exist", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/user/999").expect(404);

    expect(User.findByPk).toHaveBeenCalledWith("999");
    expect(User.destroy).not.toHaveBeenCalled();
  });
})
