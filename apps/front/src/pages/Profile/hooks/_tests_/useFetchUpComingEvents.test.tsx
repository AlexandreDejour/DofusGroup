import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import { UserEnriched } from "../../../../types/user";

import useFetchUpComingEvents from "../useFetchUpComingEvents";

// mock i18n so t(...) returns key
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (k: string) => k,
}));

const mockUserEnriched: UserEnriched = {
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

// keep axios / config mocks (ApiClient used in hook but not needed to stub here)
vi.mock("axios", () => {
  const axiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  return {
    default: {
      create: vi.fn(() => axiosInstance),
    },
    isAxiosError: vi.fn(),
  };
});

vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// replace previous serverService mock by EventService mock used in the hook
let mockGetRegistered: any;
vi.mock("../../../../services/api/eventService", () => {
  return {
    EventService: vi.fn().mockImplementation(() => ({
      getRegistered: (...args: any[]) => mockGetRegistered(...args),
    })),
  };
});

// Mock useNotification
const showError = vi.fn();
vi.mock("../../../../contexts/notificationContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showError,
  }),
}));

// Utility function to test hook
function setupHook(user: UserEnriched | null = mockUserEnriched) {
  const ref = { current: null as any };

  function TestComponent() {
    // use undefined instead of null when calling the hook to satisfy its param type
    ref.current = useFetchUpComingEvents(user ?? null);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchUpComingEvents hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Initialises with empty state and isLoading true", () => {
    mockGetRegistered = vi.fn().mockResolvedValue([]);
    const ref = setupHook();

    expect(ref.current.upComingEvents).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Fetches upcoming events and excludes owner's events", async () => {
    // returned events contains one owned (same id as in user.events) and one new
    const returned = [
      {
        id: "ef9891a6-dcab-4846-8f9c-2044efe2096c", // owned -> should be filtered out
        title: "Rafle perco",
      },
      { id: "new-evt-1", title: "Other event" },
    ];
    mockGetRegistered = vi.fn().mockResolvedValue(returned);

    const ref = setupHook();

    await act(async () => {
      // allow effect microtasks to run
      await Promise.resolve();
    });

    expect(ref.current.upComingEvents).toEqual([
      { id: "new-evt-1", title: "Other event" },
    ]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Fetches upcoming events when none owned (returns all)", async () => {
    const returned = [{ id: "evt-a", title: "A" }];
    mockGetRegistered = vi.fn().mockResolvedValue(returned);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.upComingEvents).toEqual(returned);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Handles axios error and sets error message", async () => {
    const errorMessage = "Axios error occurred";
    mockGetRegistered = vi.fn().mockRejectedValue(new Error(errorMessage));

    // mark as axios error
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.upComingEvents).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
    expect(showError).toHaveBeenCalled();
  });

  it("Handles general error and sets error message", async () => {
    const errorMessage = "Generic failure";
    mockGetRegistered = vi.fn().mockRejectedValue(new Error(errorMessage));

    // mark as not axios error
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.upComingEvents).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
    expect(showError).toHaveBeenCalled();
  });

  it("Does nothing if userEnriched is null or has no characters", async () => {
    mockGetRegistered = vi.fn().mockResolvedValue([{ id: "x" }]);

    const ref = setupHook(null);

    // effect should early-return; wait a tick
    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.upComingEvents).toEqual([]);
    expect(ref.current.isLoading).toBe(true); // stays true because fetch not triggered
    expect(ref.current.error).toBeNull();
    expect(mockGetRegistered).not.toHaveBeenCalled();
  });
});
