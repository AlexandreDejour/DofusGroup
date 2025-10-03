// tests/profanityCleaner.test.ts
import { profanityCleaner } from "../profanity.js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock la fonction clean pour contrôler le résultat
vi.mock("leo-profanity", async (importOriginal) => {
  const actual = await importOriginal<typeof import("leo-profanity")>();
  return {
    ...actual,
    default: {
      ...actual.default,
      clean: vi.fn((s: string) => s.replace(/badword/gi, "***")),
    },
  };
});

describe("profanityCleaner middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {};
    next = vi.fn();
  });

  it("should clean strings in req.body", () => {
    req.body = { text: "this is a badword" };

    profanityCleaner(req as Request, res as Response, next);

    expect(req.body.text).toBe("this is a ***");
    expect(next).toHaveBeenCalled();
  });

  it("should clean strings in req.query", () => {
    req.query = { q: "search badword" };

    profanityCleaner(req as Request, res as Response, next);

    expect(req.query.q).toBe("search ***");
    expect(next).toHaveBeenCalled();
  });

  it("should clean strings in req.params", () => {
    req.params = { id: "badword123" };

    profanityCleaner(req as Request, res as Response, next);

    expect(req.params.id).toBe("***123");
    expect(next).toHaveBeenCalled();
  });

  it("should preserve Date instances", () => {
    const date = new Date();
    req.body = { createdAt: date };

    profanityCleaner(req as Request, res as Response, next);

    expect(req.body.createdAt).toBe(date);
    expect(next).toHaveBeenCalled();
  });

  it("should preserve Buffer instances", () => {
    const buf = Buffer.from("test badword");
    req.body = { file: buf };

    profanityCleaner(req as Request, res as Response, next);

    expect(req.body.file).toBe(buf);
    expect(next).toHaveBeenCalled();
  });

  it("should clean strings nested in arrays and objects", () => {
    req.body = {
      messages: [{ content: "hello badword" }, { content: "clean text" }],
    };

    profanityCleaner(req as Request, res as Response, next);

    expect(req.body.messages[0].content).toBe("hello ***");
    expect(req.body.messages[1].content).toBe("clean text");
    expect(next).toHaveBeenCalled();
  });

  it("should not break if req.query is getter-only", () => {
    const originalQuery = { q: "badword" };
    Object.defineProperty(req, "query", {
      get: () => originalQuery,
    });

    profanityCleaner(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
