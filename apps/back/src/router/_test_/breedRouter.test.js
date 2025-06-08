import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { Breed } from "../../models/Breed.js";

vi.mock("../../models/Breed.js", () => ({
    Breed: {
        findAll: vi.fn(),
        findByPk: vi.fn()
    }
}));

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("GET /breeds", () => {
    const validBreedList = [
        {
            id: 1,
            name: "Ecaflip"
        },
        {
            id: 2,
            name: "Feca"
        }
    ];

    it("Should return breeds list and 200", async () => {
        // Prepare the fake model response
        Breed.findAll.mockResolvedValue([... validBreedList]);

        const response = await request(app)
            .get("/breeds")
            .expect(200);
        
        expect(response.body).toEqual([...validBreedList]);
    });
});

describe("GET /breed/:id", () => {
    const validBreed = {
            id: 1,
            name: "Ecaflip"
        };
    
    it("Should return breed corresponding to id and 200", async () => {
        // Prepare the fake model response
        Breed.findByPk.mockResolvedValue(validBreed);

        const response = await request(app)
            .get("/breed/1")
            .expect(200);
        
        expect(response.body).toEqual(validBreed);
    });

    it("Should call next() if breed not found", async () => {
        Breed.findByPk.mockResolvedValue(null);

        const response = await request(app)
            .get("/breed/999");
        
        expect(response.status).toBe(404);
        expect(Breed.findByPk).toHaveBeenCalledWith("999");
    });
});