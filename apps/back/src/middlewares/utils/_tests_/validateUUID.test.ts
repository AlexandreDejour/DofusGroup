import { describe, it, expect, vi, beforeEach } from "vitest";

import type { Request, Response } from "express";

import validateUUID from "../../../middlewares/utils/validateUUID.js";

describe("ValidateUUID middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Shoul call next() without error if id is valid", () => {
    //GIVEN
    req.params = { id: "3d606bbb-9154-4137-98ec-d6855648530b" };
    //WHEN
    validateUUID(req as Request, res as Response, next);
    //THEN
    expect(next).toHaveBeenCalledWith();
  });

  it("Shoul call next() without error if params contain multiple valid ids", () => {
    req.params = {
      id: "3d606bbb-9154-4137-98ec-d6855648530b",
      characterId: "b238853b-72dd-4973-9e4c-bc2283432e0e",
    };

    validateUUID(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("Should call next() with error if id isn't valid", () => {
    req.params = { id: "toto" };
    const error = new Error();

    validateUUID(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid parameter "id"',
        status: 400,
      }),
    );
  });
});
