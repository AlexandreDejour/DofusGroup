import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";

import type { Server } from "../../../types/server";
import type { ApiClient } from "../../client";

import { ServerService } from "../serverService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("ServerService", () => {
  let apiClientMock: {
    get: Mock;
  };

  let serverService: ServerService;

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      get: vi.fn(),
    };

    serverService = new ServerService(apiClientMock as unknown as ApiClient);
  });

  describe("getServers", () => {
    it("calls apiClient.get and returns sorted servers", async () => {
      const mockServers: Server[] = [
        { id: "456", name: "Tylezia", mono_account: false },
        { id: "123", name: "Orukram", mono_account: true },
      ];

      apiClientMock.get.mockResolvedValue({ data: mockServers });

      const result = await serverService.getServers();

      expect(apiClientMock.get).toHaveBeenCalledWith("/servers");

      // sorted alphabetically by name
      expect(result).toEqual([
        { id: "123", name: "Orukram", mono_account: true },
        { id: "456", name: "Tylezia", mono_account: false },
      ]);
    });

    it("calls handleApiError and rethrows if it throws", async () => {
      const error = new Error("Any server found.");
      apiClientMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(serverService.getServers()).rejects.toThrow(
        "Any server found.",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("calls handleApiError and returns undefined if it does not throw", async () => {
      const error = new Error("API error");
      apiClientMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await serverService.getServers();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });
});
