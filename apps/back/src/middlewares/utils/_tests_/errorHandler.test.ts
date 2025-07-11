import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import createHttpError from "http-errors";
import type { Request, Response } from "express";

import { errorHandler, notFound } from "../errorHandler.js";

describe("Error handling middleware", () => {
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

  it("notFound middleware should call next with 404", () => {
    const error = createHttpError(status.NOT_FOUND, "Not Found");

    notFound(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Not Found",
        status: status.NOT_FOUND,
      }),
    );
  });

  it("errorHandler middleware should send response with error status and message", () => {
    const error = createHttpError(status.BAD_REQUEST, "Bad Request");

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bad Request",
    });
  });

  it("errorHandler middleware should default to status 500 if no statusCode on error", () => {
    const error = createHttpError();

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(status.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
