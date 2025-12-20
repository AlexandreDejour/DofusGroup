import i18n from "i18next";
import { vi } from "vitest";
import { AxiosError } from "axios";
import { render, waitFor } from "@testing-library/react";

import { Area, SubArea } from "../../types/dofusDB";

import useFetchSubAreas from "../useFetchSubAreas";

// Helpers
function setupHook(areas: Area[], area: string, service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchSubAreas(areas, area, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchSubAreas hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.language = "en"; // force language
  });

  it("should fetch subAreas successfully when area exists", async () => {
    const areas: Area[] = [
      {
        id: 1,
        name: {
          id: "area1",
          de: "area1",
          en: "area1",
          es: "area1",
          fr: "area1",
          pt: "area1",
        },
      },
    ];
    const subAreas: SubArea[] = [
      {
        id: 1,
        name: {
          id: "subArea1",
          de: "subArea1",
          en: "subArea1",
          es: "subArea1",
          fr: "subArea1",
          pt: "subArea1",
        },
        dungeonId: 10,
      },
    ];

    const mockService = {
      getSubAreas: vi.fn().mockResolvedValue(subAreas),
    };

    const result = setupHook(areas, "area1", mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.subAreas).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getSubAreas).toHaveBeenCalledTimes(1);
    expect(mockService.getSubAreas).toHaveBeenCalledWith(1);
    expect(result.current.subAreas).toEqual(subAreas);
    expect(result.current.error).toBeNull();
  });

  it("should return empty subAreas if area does not exist", async () => {
    const areas: Area[] = [
      {
        id: 1,
        name: {
          id: "area1",
          de: "area1",
          en: "area1",
          es: "area1",
          fr: "area1",
          pt: "area1",
        },
      },
    ];

    const mockService = {
      getSubAreas: vi.fn(),
    };

    const result = setupHook(areas, "area2", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subAreas).toEqual([]);
    expect(mockService.getSubAreas).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const areas: Area[] = [
      {
        id: 1,
        name: {
          id: "area1",
          de: "area1",
          en: "area1",
          es: "area1",
          fr: "area1",
          pt: "area1",
        },
      },
    ];

    const axiosError = new AxiosError("Axios error");
    const mockService = {
      getSubAreas: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(areas, "area1", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subAreas).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const areas: Area[] = [
      {
        id: 1,
        name: {
          id: "area1",
          de: "area1",
          en: "area1",
          es: "area1",
          fr: "area1",
          pt: "area1",
        },
      },
    ];

    const error = new Error("Standard error");
    const mockService = {
      getSubAreas: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(areas, "area1", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subAreas).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
