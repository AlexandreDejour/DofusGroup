import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act, waitFor } from "@testing-library/react";

import * as authContext from "../../../../contexts/authContext";

import useFetchUserEnriched from "../useFetchUserEnriched";
import { UserEnriched } from "../../../../types/user";

// mock i18n helper so t(...) returns the key
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (k: string) => k,
}));

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

// Mock useNotification
const showError = vi.fn();
vi.mock("../../../../contexts/notificationContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showError,
  }),
}));

// Mock useAuth
vi.mock("../../../../contexts/authContext", () => ({
  __esModule: true,
  useAuth: () => ({
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [
        {
          id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
          name: "Chronos",
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
        },
      ],
    },
    setUser: vi.fn(),
    isAuthLoading: false,
  }),
}));

let mockGetOneEnriched: any;

vi.mock("../../../../services/api/userService", () => {
  return {
    UserService: vi.fn().mockImplementation(() => ({
      getOneEnriched: (...args: any[]) => mockGetOneEnriched(...args),
    })),
  };
});

// Mock useNavigate de react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Utility function to test hook
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchUserEnriched();
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchUserEnriched hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initialises with null userEnriched and isLoading true", () => {
    mockGetOneEnriched = vi.fn().mockResolvedValue({} as UserEnriched);
    const ref = setupHook();

    expect(ref.current.userEnriched).toBeNull();
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("fetches user enriched successfully", async () => {
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

    mockGetOneEnriched = vi.fn().mockResolvedValue(mockUserEnriched);

    const ref = setupHook();

    // wait for the service to be called and hook to update state
    await waitFor(() => {
      expect(mockGetOneEnriched).toHaveBeenCalled();
    });

    // then assert final state
    expect(ref.current.userEnriched).toEqual(mockUserEnriched);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
    expect(showError).not.toHaveBeenCalled();
  });

  it("handles axios error", async () => {
    const errorMessage = "Axios error";
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be true
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await waitFor(() => {
      expect(mockGetOneEnriched).toHaveBeenCalled();
    });

    expect(ref.current.userEnriched).toBeNull();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
    expect(showError).toHaveBeenCalled();
  });

  it("handles general error", async () => {
    const errorMessage = "Some error";
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be false
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await waitFor(() => {
      expect(mockGetOneEnriched).toHaveBeenCalled();
    });

    expect(ref.current.userEnriched).toBeNull();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
    expect(showError).toHaveBeenCalled();
  });

  it("navigates to root when user is missing", async () => {
    // override useAuth mock to return no user and not loading (ESM-friendly)
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      user: null,
      setUser: vi.fn(),
      isAuthLoading: false,
    } as any);

    mockGetOneEnriched = vi.fn();

    const ref = setupHook();

    // wait for effect to run and navigation attempt
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    // no call to service
    expect(mockGetOneEnriched).not.toHaveBeenCalled();
  });
});
