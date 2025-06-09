import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { Tag } from "../../models/Tag.js";

vi.mock("../../models/Tag.js", () => ({
    Tag: {
        findAll: vi.fn(),
        findByPk: vi.fn()
    }
}));

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("GET /Tags", () => {
    const validTagList = [
        {
            id: 1,
            name: "XP",
            color:"green"
        },
        {
            id: 2,
            name: "Donjon",
            color: "blue"
        }
    ];

    it("Should return tags list and 200", async () => {
        // Prepare the fake model response
        Tag.findAll.mockResolvedValue([... validTagList]);

        const response = await request(app)
            .get("/tags")
            .expect(200);
        
        expect(response.body).toEqual([...validTagList]);
    });
});

describe("GET /tag/:id", () => {
    const validTag = {
            id: 1,
            name: "XP",
            color:"green"
        };
    
    it("Should return tag corresponding to id and 200", async () => {
        // Prepare the fake model response
        Tag.findByPk.mockResolvedValue(validTag);

        const response = await request(app)
            .get("/tag/1")
            .expect(200);
        
        expect(response.body).toEqual(validTag);
    });

    it("Should call next() if tag not found", async () => {
        Tag.findByPk.mockResolvedValue(null);

        const response = await request(app)
            .get("/tag/999");
        
        expect(response.status).toBe(404);
        expect(Tag.findByPk).toHaveBeenCalledWith("999");
    });
});