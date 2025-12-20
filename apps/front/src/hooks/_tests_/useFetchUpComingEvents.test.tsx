import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";

import { Event } from "../../types/event";
import { UserEnriched } from "../../types/user";
import useFetchUpComingEvents from "../useFetchUpComingEvents";

// Mock des contextes
const showError = vi.fn();
vi.mock("../../contexts/notificationContext", () => ({
  useNotification: () => ({ showError }),
}));

vi.mock("../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (key: string) => key,
}));

// Helpers
function setupHook(user: UserEnriched | null, service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchUpComingEvents(user, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchUpComingEvents hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch upcoming events successfully", async () => {
    const user: UserEnriched = {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [
        {
          id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
          name: "Chronos",
          sex: "M",
          level: 50,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1QVjw",
          server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
          user: {
            id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
            username: "toto",
          },
          breed: {
            id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e21a",
            name: "Xélor",
          },
          server: {
            id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
            name: "Rafal",
            mono_account: false,
          },
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
          date: new Date("2025-12-24T23:59:59.000Z"),
          duration: 180,
          area: undefined,
          sub_area: undefined,
          donjon_name: undefined,
          description: "on rase tout",
          max_players: 8,
          status: "public",
          server: {
            id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
            name: "Rafal",
            mono_account: false,
          },
          tag: {
            id: "31d0d841-1345-4939-9495-0f802362eb79",
            name: "Percepteur",
            color: "#2c3e50",
          },
          characters: [
            {
              id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
              name: "Chronos",
              sex: "M",
              level: 50,
              alignment: "Neutre",
              stuff: "https://d-bk.net/fr/d/1QVjw",
              server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
            },
          ],
        },
      ],
    };

    const upcomingEvents: Event[] = [
      {
        id: "new-event-id",
        title: "New Event",
        date: new Date("2025-12-24T23:59:59.000Z"),
        duration: 180,
        area: undefined,
        sub_area: undefined,
        donjon_name: undefined,
        description: "on rase tout",
        max_players: 8,
        status: "public",
        server: {
          id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
          name: "Rafal",
          mono_account: false,
        },
        tag: {
          id: "tag1",
          name: "tag1",
          color: "#000",
        },
        characters: [],
      },
    ];

    const mockService = {
      getRegistered: vi.fn().mockResolvedValue(upcomingEvents),
    };

    const result = setupHook(user, mockService);

    // état initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.upComingEvents).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Le hook doit filtrer l'événement déjà possédé
    expect(result.current.upComingEvents).toEqual([
      {
        id: "new-event-id",
        title: "New Event",
        date: new Date("2025-12-24T23:59:59.000Z"),
        duration: 180,
        area: undefined,
        sub_area: undefined,
        donjon_name: undefined,
        description: "on rase tout",
        max_players: 8,
        status: "public",
        server: {
          id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
          name: "Rafal",
          mono_account: false,
        },
        tag: {
          id: "tag1",
          name: "tag1",
          color: "#000",
        },
        characters: [],
      },
    ]);
    expect(mockService.getRegistered).toHaveBeenCalledTimes(1);
    expect(mockService.getRegistered).toHaveBeenCalledWith([
      "9f0eaa8c-eec1-4e85-9365-7653c1330325",
    ]);
    expect(result.current.error).toBeNull();
    expect(showError).not.toHaveBeenCalled();
  });

  it("should return empty upcoming events if user has no characters", async () => {
    const user: UserEnriched = {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [],
      events: [],
    };

    const mockService = {
      getRegistered: vi.fn(),
    };

    const result = setupHook(user, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.upComingEvents).toEqual([]);
    expect(mockService.getRegistered).not.toHaveBeenCalled();
  });

  it("should set error when axios error occurs", async () => {
    const user: UserEnriched = {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [
        {
          id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
          name: "Chronos",
          sex: "M",
          level: 50,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1QVjw",
          server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
          user: {
            id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
            username: "toto",
          },
          breed: {
            id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e21a",
            name: "Xélor",
          },
          server: {
            id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
            name: "Rafal",
            mono_account: false,
          },
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
          date: new Date("2025-12-24T23:59:59.000Z"),
          duration: 180,
          area: undefined,
          sub_area: undefined,
          donjon_name: undefined,
          description: "on rase tout",
          max_players: 8,
          status: "public",
          server: {
            id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
            name: "Rafal",
            mono_account: false,
          },
          tag: {
            id: "31d0d841-1345-4939-9495-0f802362eb79",
            name: "Percepteur",
            color: "#2c3e50",
          },
          characters: [
            {
              id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
              name: "Chronos",
              sex: "M",
              level: 50,
              alignment: "Neutre",
              stuff: "https://d-bk.net/fr/d/1QVjw",
              server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
            },
          ],
        },
      ],
    };

    const axiosError = new AxiosError("Axios error");
    const mockService = {
      getRegistered: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(user, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Axios error");
    expect(result.current.upComingEvents).toEqual([]);
    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "Axios error",
    );
  });

  it("should set error when standard Error occurs", async () => {
    const user: UserEnriched = {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [
        {
          id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
          name: "Chronos",
          sex: "M",
          level: 50,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1QVjw",
          server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
          user: {
            id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
            username: "toto",
          },
          breed: {
            id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e21a",
            name: "Xélor",
          },
          server: {
            id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
            name: "Rafal",
            mono_account: false,
          },
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
          date: new Date("2025-12-24T23:59:59.000Z"),
          duration: 180,
          area: undefined,
          sub_area: undefined,
          donjon_name: undefined,
          description: "on rase tout",
          max_players: 8,
          status: "public",
          server: {
            id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
            name: "Rafal",
            mono_account: false,
          },
          tag: {
            id: "31d0d841-1345-4939-9495-0f802362eb79",
            name: "Percepteur",
            color: "#2c3e50",
          },
          characters: [
            {
              id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
              name: "Chronos",
              sex: "M",
              level: 50,
              alignment: "Neutre",
              stuff: "https://d-bk.net/fr/d/1QVjw",
              server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
            },
          ],
        },
      ],
    };

    const error = new Error("Standard error");
    const mockService = {
      getRegistered: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(user, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Standard error");
    expect(result.current.upComingEvents).toEqual([]);
    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.occurred",
    );
  });
});
