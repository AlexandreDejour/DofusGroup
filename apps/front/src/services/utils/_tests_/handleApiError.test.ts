import { describe, it, expect, vi, type Mock } from "vitest";

import axios from "axios";

import handleApiError from "../handleApiError";

vi.mock("axios");

describe("handleApiError", () => {
  it("should throw an object with type API_ERROR when given an axios error with message", () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: "Bad request" },
      },
    };

    (axios.isAxiosError as unknown as Mock).mockReturnValue(true);

    expect(() => handleApiError(axiosError)).toThrowError(
      expect.objectContaining({
        type: "API_ERROR",
        status: 400,
        message: "Bad request",
        original: axiosError,
      }),
    );
  });

  it("should throw an object with default message when axios error has no message", () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {},
      },
    };

    (axios.isAxiosError as unknown as Mock).mockReturnValue(true);

    expect(() => handleApiError(axiosError)).toThrowError(
      expect.objectContaining({
        type: "API_ERROR",
        status: 500,
        message: "Unknown error",
        original: axiosError,
      }),
    );
  });

  it("should throw the original error if it is not an axios error", () => {
    const error = new Error("Network failure");

    (axios.isAxiosError as unknown as Mock).mockReturnValue(false);

    expect(() => handleApiError(error)).toThrowError(error);
  });

  it("should handle axios error with no response", () => {
    const axiosError = {
      isAxiosError: true,
      response: undefined,
    };

    (axios.isAxiosError as unknown as Mock).mockReturnValue(true);

    expect(() => handleApiError(axiosError)).toThrowError(
      expect.objectContaining({
        type: "API_ERROR",
        status: undefined,
        message: "Unknown error",
        original: axiosError,
      }),
    );
  });
});
