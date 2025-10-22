import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import { Server } from "../../../types/server";

import { ApiClient } from "../../client";
import { ServerService } from "../serverService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("ServerService", () => {
  let apiClientMock: any;
  let serverService: ServerService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    serverService = new ServerService(apiClientMock as ApiClient);
  });

  describe("getTags", () => {
    it("should call axios.get with the correct URL on success", async () => {
      const mockServers: Server[] = [
        { id: "123", name: "Orukram", mono_account: true },
        { id: "456", name: "Tylezia", mono_account: false },
      ];
      apiClientMock.instance.get.mockResolvedValue({ data: mockServers });

      const result = await serverService.getServers();

      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/servers");
      expect(result).toEqual(mockServers);
    });

    it("Throw specific error when any server found (handleApiError throws)", async () => {
      const error = new Error("Any server found.");
      apiClientMock.instance.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(serverService.getServers()).rejects.toThrow(
        "Any server found.",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
