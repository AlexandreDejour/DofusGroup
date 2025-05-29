import { describe, it, expect, vi } from 'vitest';

import { validateInt } from "../validateInt.js";

describe('validateInt middleware', () => {
    it("Should call next() without error if id is a valid integer", () => {
        const req = { params: { id: '123' } };
        const res = {};
        const next = vi.fn();

        validateInt(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    it("Should call next() with error if id isn't a valid integer", () => {
        const req = { params: { id: 'abc' } };
        const res = {};
        const next = vi.fn();

        validateInt(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        const errorArg = next.mock.calls[0][0];
        expect(errorArg.message).toBe("Not found");
        expect(errorArg.statusCode).toBe(404);
    });

    it("Should reject negativ or float integer", () => {
        const req = { params: { id: '-5' } };
        const res = {};
        const next = vi.fn();

        validateInt(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));

        req.params.id = '3.14';
        validateInt(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
