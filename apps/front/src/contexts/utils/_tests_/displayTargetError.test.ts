import { describe, it, expect, vi, beforeEach } from "vitest";

import { displayTargetError } from "../displayTargetError";

describe("displayTargetError", () => {
  const t = vi.fn((key: string) => key);
  const showError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle a generic API error (no specific status)", () => {
    const error = { type: "API_ERROR", message: "Custom error" };

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "Custom error",
    );
  });

  it("should handle a 400 Bad Request", () => {
    const error = { type: "API_ERROR", status: 400 };

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.badRequest",
    );
  });

  it("should handle a 401 Unauthorized", () => {
    const error = { type: "API_ERROR", status: 401 };

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.unauthorized",
    );
  });

  it("should handle a 403 Forbidden", () => {
    const error = { type: "API_ERROR", status: 403 };

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.forbidden",
    );
  });

  it("should handle a 404 Not Found (generic)", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.notFound",
    );
  });

  it("should handle a 429 Too Many Requests", () => {
    const error = { type: "API_ERROR", status: 429 };

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.attemps",
    );
  });

  it("should handle a 500 Internal Server Error", () => {
    const error = { type: "API_ERROR", status: 500 };

    displayTargetError(error, t, showError);

    // Note: in ton code, le 'case 500' ne change rien,
    // donc on attend le message par défaut
    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.occurred",
    );
  });

  it("should handle a 404 with targetType 'user'", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError, "user");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "auth.error.user.notFound",
    );
  });

  it("should handle a 404 with targetType 'event'", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError, "event");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "event.error.notFound",
    );
  });

  it("should handle a 404 with targetType 'event_details'", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError, "event_details");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "event.error.notFound",
    );
  });

  it("should handle a 404 with targetType 'character'", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError, "character");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "character.error.notFound",
    );
  });

  it("should handle a 404 with targetType 'character_details'", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError, "character_details");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "character.error.notFound",
    );
  });

  it("should handle a 404 with targetType 'comment'", () => {
    const error = { type: "API_ERROR", status: 404 };

    displayTargetError(error, t, showError, "comment");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "comment.error.notFound",
    );
  });

  it("should handle non-API errors gracefully", () => {
    const error = new Error("Something bad");

    displayTargetError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.occurred",
    );
  });
});
