import request from "supertest";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../app/app.js";
import { Server } from "../../models/Server.js";

vi.mock("../../models/Server.js", () => ({
    Server: {
        findAll: vi.fn(),
        findByPk: vi.fn()
    }
}));

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("GET /servers", () => {
    const validServerList = [
        {
            id: 1,
            name: "Rafal"
        },
        {
            id: 2,
            name: "Salar"
        }
    ];

    it("Should return servers list and 200", async () => {
        // Prepare the fake model response
        Server.findAll.mockResolvedValue([... validServerList]);

        const response = await request(app)
            .get("/servers")
            .expect(200);
        
        expect(response.body).toEqual([...validServerList]);
    });
});

describe("GET /server/:id", () => {
    const validServer = {
            id: 1,
            name: "Rafal"
        };
    
    it("Should return breed corresponding to id and 200", async () => {
        // Prepare the fake model response
        Server.findByPk.mockResolvedValue(validServer);

        const response = await request(app)
            .get("/server/1")
            .expect(200);
        
        expect(response.body).toEqual(validServer);
    });

    it("Should call next() if server not found", async () => {
        Server.findByPk.mockResolvedValue(null);

        const response = await request(app)
            .get("/server/999");
        
        expect(response.status).toBe(404);
        expect(Server.findByPk).toHaveBeenCalledWith("999");
    });
});