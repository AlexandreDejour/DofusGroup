import request, { Response } from "supertest";

import { vi, describe, it, expect, beforeEach } from "vitest";

import express, { Express } from "express";

import Character from "../../models/Character.js";
import characterRouter from "../characterRouter.js";
import { characterController } from "../../controllers/characterController.js";
import { errorHandler, notFound } from "../../utils/errorHandler.js";
import { IPostCharacterBody } from "../../controllers/types/character.js";

let app: Express;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use("/", characterRouter);
  app.use(notFound);
  app.use(errorHandler);
  vi.restoreAllMocks();
});

describe("characterController", () => {
  describe("GET /user/:userId/characters", () => {
    it("should return all characters for a user", async () => {
      const fakeCharacters: Character[] = [
        Character.build({
          id: 1,
          name: "Night-hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "",
          default_character: true,
          user_id: 1,
          breed_id: 15,
          server_id: 1,
        }),
      ];

      vi.spyOn(Character, "findAll").mockResolvedValue(fakeCharacters);

      const res: Response = await request(app).get("/user/1/characters");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeCharacters.map((char) => char.toJSON()));
    });

    it("should return 404 if no characters found for user", async () => {
      vi.spyOn(Character, "findAll").mockResolvedValue([]);

      const res: Response = await request(app).get("/user/1/characters");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "No characters found for this user" });
    });

    it("should call next() on error", async () => {
      vi.spyOn(characterController, "getAllByUserId").mockImplementation(
        (_req, _res, next) => {
          next(new Error("Unexpected error"));
          return Promise.resolve();
        },
      );

      const res: Response = await request(app).get("/user/1/characters");

      expect(res.status).toBe(500);
    });
  });

  describe("GET /user/:userId/characters/enriched", () => {
    it("should return all enriched characters for a user", async () => {
      const fakeCharacters: Character[] = [
        Character.build({
          id: 1,
          name: "Night-hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "",
          default_character: true,
          user: {
            id: 1,
            username: "Vonspliffeh",
            mail: "vonsliffeh@gmail.com",
          },
          breed: {
            id: 15,
            name: "Sram",
          },
          server: {
            id: 1,
            name: "Dakal",
            mono_account: true,
          },
          events: [],
        }),
      ];

      vi.spyOn(Character, "findAll").mockResolvedValue(fakeCharacters);

      const res: Response = await request(app).get(
        "/user/1/characters/enriched",
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeCharacters.map((char) => char.toJSON()));
    });

    it("should return 404 if no enriched characters found for user", async () => {
      vi.spyOn(Character, "findAll").mockResolvedValue([]);

      const res: Response = await request(app).get(
        "/user/1/characters/enriched",
      );

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "No characters found for this user" });
    });

    it("should call next() on error", async () => {
      vi.spyOn(
        characterController,
        "getAllByUserIdEnriched",
      ).mockImplementation((_req, _res, next) => {
        next(new Error("Unexpected error"));
        return Promise.resolve();
      });

      const res: Response = await request(app).get(
        "/user/1/characters/enriched",
      );

      expect(res.status).toBe(500);
    });
  });

  describe("GET /user/:userId/character/:characterId", () => {
    it("should return one character by user ID", async () => {
      const fakeCharacter: Character = Character.build({
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      });

      vi.spyOn(Character, "findOne").mockResolvedValue(fakeCharacter);

      const res: Response = await request(app).get("/user/1/character/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeCharacter.toJSON());
    });

    it("should return 404 if character not found for user", async () => {
      vi.spyOn(Character, "findOne").mockResolvedValue(null);

      const res: Response = await request(app).get("/user/1/character/1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Character not found for this user" });
    });

    it("should call next() on error", async () => {
      vi.spyOn(characterController, "getOneByUserId").mockImplementation(
        (_req, _res, next) => {
          next(new Error("Unexpected error"));
          return Promise.resolve();
        },
      );

      const res: Response = await request(app).get("/user/1/character/1");

      expect(res.status).toBe(500);
    });
  });

  describe("GET /user/:userId/character/:characterId/enriched", () => {
    it("should return one enriched character by user ID", async () => {
      const fakeCharacter: Character = Character.build({
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user: {
          id: 1,
          username: "Vonspliffeh",
          mail: "vonsliffeh@gmail.com",
        },
        breed: {
          id: 15,
          name: "Sram",
        },
        server: {
          id: 1,
          name: "Dakal",
          mono_account: true,
        },
        events: [],
      });

      vi.spyOn(Character, "findOne").mockResolvedValue(fakeCharacter);

      const res: Response = await request(app).get(
        "/user/1/character/1/enriched",
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeCharacter.toJSON());
    });

    it("should return 404 if enriched character not found for user", async () => {
      vi.spyOn(Character, "findOne").mockResolvedValue(null);

      const res: Response = await request(app).get(
        "/user/1/character/1/enriched",
      );

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Character not found for this user" });
    });

    it("should call next() on error", async () => {
      vi.spyOn(
        characterController,
        "getOneByUserIdEnriched",
      ).mockImplementation((_req, _res, next) => {
        next(new Error("Unexpected error"));
        return Promise.resolve();
      });

      const res: Response = await request(app).get(
        "/user/1/character/1/enriched",
      );

      expect(res.status).toBe(500);
    });
  });

  describe("POST /user/:userId/character", () => {
    it("should create a new character for a user", async () => {
      const newCharacterData: IPostCharacterBody = {
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      };

      const fakeCharacter: Character = Character.build({
        ...newCharacterData,
        id: 1,
      });

      vi.spyOn(Character, "create").mockResolvedValue(fakeCharacter);

      const res: Response = await request(app)
        .post("/user/1/character")
        .send(newCharacterData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(fakeCharacter.toJSON());
    });

    it("should return 400 if user ID is missing", async () => {
      const newCharacterData: IPostCharacterBody = {
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      };

      const res: Response = await request(app).post("/user/1/character").send({
        newCharacterData,
        user_id: undefined,
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should call next() on error", async () => {
      vi.spyOn(characterController, "post").mockImplementation(
        (_req, _res, next) => {
          next(new Error("Unexpected error"));
          return Promise.resolve();
        },
      );

      const res: Response = await request(app).post("/user/1/character");

      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /user/:userId/character/:characterId", () => {
    it("should update an existing character for a user", async () => {
      const updatedCharacterData: Partial<IPostCharacterBody> = {
        level: 200,
        default_character: false,
      };

      const fakeCharacter: Character = Character.build({
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      });

      const fakeCharacterUpdated: Character = Character.build({
        ...fakeCharacter.toJSON(),
        ...updatedCharacterData,
      });

      vi.spyOn(Character, "findOne").mockResolvedValue(fakeCharacter);
      vi.spyOn(fakeCharacter, "save").mockResolvedValue(fakeCharacter);

      const res: Response = await request(app)
        .patch("/user/1/character/1")
        .send(updatedCharacterData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeCharacterUpdated.toJSON());
    });

    it("should return 400 if user ID is missing", async () => {
      const updatedCharacterData: Partial<IPostCharacterBody> = {
        name: "Night-hunter",
        level: 200,
      };

      const res: Response = await request(app)
        .patch("/user/1/character/undefined")
        .send({ ...updatedCharacterData });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if character not found for user", async () => {
      vi.spyOn(Character, "findOne").mockResolvedValue(null);

      const res: Response = await request(app)
        .patch("/user/1/character/1")
        .send({ name: "Updated Name" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Character not found for this user" });
    });

    it("should call next() on error", async () => {
      vi.spyOn(characterController, "update").mockImplementation(
        (_req, _res, next) => {
          next(new Error("Unexpected error"));
          return Promise.resolve();
        },
      );

      const res: Response = await request(app).patch("/user/1/character/1");

      expect(res.status).toBe(500);
    });
  });

  // DELETE /user/:userId/character/:characterId
  describe("DELETE /user/:userId/character/:characterId", () => {
    it("should delete an existing character for a user", async () => {
      const fakeCharacter: Character = Character.build({
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      });

      vi.spyOn(Character, "findOne").mockResolvedValue(fakeCharacter);
      vi.spyOn(fakeCharacter, "destroy").mockResolvedValue();

      const res: Response = await request(app).delete("/user/1/character/1");

      expect(res.status).toBe(204);
    });

    it("should return 400 if user ID is missing", async () => {
      const res: Response = await request(app).delete(
        "/user/1/character/undefined",
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if character not found for user", async () => {
      vi.spyOn(Character, "findOne").mockResolvedValue(null);

      const res: Response = await request(app).delete("/user/1/character/1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Character not found for this user" });
    });

    it("should call next() on error", async () => {
      vi.spyOn(characterController, "delete").mockImplementation(
        (_req, _res, next) => {
          next(new Error("Unexpected error"));
          return Promise.resolve();
        },
      );

      const res: Response = await request(app).delete("/user/1/character/1");

      expect(res.status).toBe(500);
    });
  });
});
