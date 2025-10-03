import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";
import { t } from "../../../i18n/i18n-helper";

import { Server } from "../../../types/server";

import { ApiClient } from "../../client";
import { ServerService } from "../serverService";

vi.mock("axios");

describe("ServerService", () => {
  let apiClientMock: any;
  let serverService: ServerService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    serverService = new ServerService(apiClientMock as ApiClient);
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
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

    it("should throw a specific error if response status is 204", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(serverService.getServers()).rejects.toThrow(
        t("server.error.notFound"),
      );
    });

    it("should re-throw a generic error if it's not an AxiosError", async () => {
      const genericError = new Error("Network error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      await expect(serverService.getServers()).rejects.toThrow("Network error");
    });
  });
});
