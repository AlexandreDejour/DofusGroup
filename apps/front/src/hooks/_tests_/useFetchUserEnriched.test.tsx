import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";

import useFetchUserEnriched from "../useFetchUserEnriched";
import { UserEnriched } from "../../types/user";

const navigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigate,
}));

const showError = vi.fn();
vi.mock("../../contexts/notificationContext", () => ({
  useNotification: () => ({ showError }),
}));

let mockAuthState: any;
vi.mock("../../contexts/authContext", () => ({
  useAuth: () => mockAuthState,
}));

// Helpers
function setupHook(service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchUserEnriched(service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useUserEnriched hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch enriched user successfully", async () => {
    mockAuthState = {
      user: { id: "user1", username: "toto" },
      isLoading: false,
    };

    const enrichedUser: UserEnriched = {
      id: "user1",
      username: "toto",
      characters: [],
      events: [],
    };

    const mockService = {
      getOneEnriched: vi.fn().mockResolvedValue(enrichedUser),
    };

    const result = setupHook(mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.userEnriched).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userEnriched).toEqual(enrichedUser);
    expect(result.current.error).toBeNull();
    expect(mockService.getOneEnriched).toHaveBeenCalledWith("user1");
  });

  it("should redirect to home when user is not authenticated", async () => {
    mockAuthState = {
      user: null,
      isLoading: false,
    };

    const mockService = {
      getOneEnriched: vi.fn(),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/", { replace: true });
    });

    expect(result.current.userEnriched).toBeNull();
    expect(mockService.getOneEnriched).not.toHaveBeenCalled();
  });

  it("should do nothing while auth is loading", async () => {
    mockAuthState = {
      user: null,
      isLoading: true,
    };

    const mockService = {
      getOneEnriched: vi.fn(),
    };

    const result = setupHook(mockService);

    // le hook ne doit rien déclencher
    expect(result.current.isLoading).toBe(true);
    expect(mockService.getOneEnriched).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("should set error and show notification on axios error", async () => {
    mockAuthState = {
      user: { id: "user1", username: "toto" },
      isLoading: false,
    };

    const axiosError = new AxiosError("Axios error");

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userEnriched).toBeNull();
    expect(showError).toHaveBeenCalled();
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error and show generic notification on standard Error", async () => {
    mockAuthState = {
      user: { id: "user1", username: "toto" },
      isLoading: false,
    };

    const error = new Error("Standard error");

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userEnriched).toBeNull();
    expect(showError).toHaveBeenCalled();
    expect(result.current.error).toBe("Standard error");
  });
});
