import { describe, it, expect, vi, type Mock } from "vitest";

import { displayModalError } from "../displayModalError";
import isUpdateField from "../../../components/modals/utils/isUpdateField";

const t = vi.fn((key: string) => key);

const showError = vi.fn();

vi.mock("../../../components/modals/utils/isUpdateField", () => ({
  default: vi.fn(),
}));

describe("displayModalError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display default error for non-API error", () => {
    const error = new Error("Something went wrong");

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.occurred",
    );
  });

  it("should handle 400 Bad Request", () => {
    const error = { type: "API_ERROR", status: 400, message: "Bad request" };

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.badRequest",
    );
  });

  it("should handle 401 Unauthorized", () => {
    const error = { type: "API_ERROR", status: 401, message: "Unauthorized" };

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.unauthorized",
    );
  });

  it("should handle 403 Forbidden", () => {
    const error = { type: "API_ERROR", status: 403, message: "Forbidden" };

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.forbidden",
    );
  });

  it("should handle 404 Not Found", () => {
    const error = { type: "API_ERROR", status: 404, message: "Not found" };

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.notFound",
    );
  });

  it("should handle 429 Too Many Requests", () => {
    const error = {
      type: "API_ERROR",
      status: 429,
      message: "Too many requests",
    };

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.attemps",
    );
  });

  it("should use API error message if status is unknown", () => {
    const error = { type: "API_ERROR", status: 999, message: "Custom message" };

    displayModalError(error, t, showError);

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "Custom message",
    );
  });

  it("should handle login modalType with 401", () => {
    const error = { type: "API_ERROR", status: 401, message: "Unauthorized" };

    displayModalError(error, t, showError, "login");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "auth.error.credentials.invalid",
    );
  });

  it("should handle register modalType with 409", () => {
    const error = { type: "API_ERROR", status: 409, message: "Conflict" };

    displayModalError(error, t, showError, "register");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "auth.error.credentials.unavailable",
    );
  });

  it("should handle updateField modalType with 401", () => {
    const error = { type: "API_ERROR", status: 401, message: "Unauthorized" };
    (isUpdateField as unknown as Mock).mockReturnValue(true);

    displayModalError(error, t, showError, "password");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "auth.password.error.oldPassword",
    );
    expect(isUpdateField).toHaveBeenCalledWith("password");
  });

  it("should ignore modalType if not relevant", () => {
    const error = { type: "API_ERROR", status: 401, message: "Unauthorized" };
    (isUpdateField as unknown as Mock).mockReturnValue(false);

    displayModalError(error, t, showError, "newCharacter");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.unauthorized",
    );
  });
});
