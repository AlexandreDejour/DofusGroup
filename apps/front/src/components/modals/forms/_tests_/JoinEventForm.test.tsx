import { describe, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

// Mock config
vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock useAuth
let mockUser: any = {
  id: "ce04535a-8444-4a97-a75d-c242c78f4ae8",
  username: "toto",
};

vi.mock("../../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

// Mock useModal
const serverObj = {
  id: "058fff91-1d02-4a36-b583-442a6a611896",
  name: "Jiva",
  mono_account: true,
};
vi.mock("../../../../contexts/modalContext", () => ({
  useModal: () => ({
    updateTarget: {
      id: "a0c971db-f2b8-43e5-aafa-80b75446e8c1",
      server: serverObj,
    },
  }),
}));

// Mock useNotification
const showErrorMock = vi.fn();
vi.mock("../../../../contexts/notificationContext", () => ({
  useNotification: () => ({
    showError: showErrorMock,
  }),
}));

// Mock CharacterService
const mockGetAllEnrichedByUserId = vi.fn();
vi.mock("../../../../services/api/characterService", () => ({
  CharacterService: vi.fn(() => ({
    getAllEnrichedByUserId: (...args: any[]) =>
      mockGetAllEnrichedByUserId(...args),
  })),
}));

vi.mock("../../utils/typeGuard", () => ({
  typeGuard: {
    eventEnriched: () => true, // Toujours vrai pour les tests
  },
}));

// Mock CharactersCheckbox
vi.mock("../../formComponents/Checkbox/CharactersCheckbox", () => ({
  __esModule: true,
  default: ({ characters }: any) => (
    <div data-testid="characters-checkbox">
      {characters.map((c: any) => (
        <span key={c.id}>{c.name}</span>
      ))}
    </div>
  ),
}));

import JoinEventForm from "../JoinEventForm/JoinEventForm";

describe("JoinEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Displays the list of characters if available", async () => {
    mockGetAllEnrichedByUserId.mockResolvedValueOnce([
      {
        id: "char-d078b475-42cd-4008-9ba7-750d251e9b76",
        name: "Night-Hunter",
        server: serverObj,
        breed: { name: "Sram" },
      },
      {
        id: "char-f8027c6b-8574-4abe-af03-8459868c19ab",
        name: "Chronos",
        server: serverObj,
        breed: { name: "Xélor" },
      },
    ]);

    render(<JoinEventForm handleSubmit={vi.fn()} />);
    const checkboxContainer = await screen.findByTestId("characters-checkbox");
    expect(checkboxContainer).toBeInTheDocument();
    expect(screen.getByText("Night-Hunter")).toBeInTheDocument();
    expect(screen.getByText("Chronos")).toBeInTheDocument();
  });

  it("Display this message if no character is available", async () => {
    mockGetAllEnrichedByUserId.mockResolvedValueOnce([]);
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    await waitFor(() => {
      expect(
        screen.getByText(t("character.error.noneOnServer")),
      ).toBeInTheDocument();
    });
  });

  it("Filter characters on the correct server", async () => {
    mockGetAllEnrichedByUserId.mockResolvedValueOnce([
      {
        id: "char-d078b475-42cd-4008-9ba7-750d251e9b76",
        name: "Night-Hunter",
        server: serverObj,
        breed: { name: "Sram" },
      },
      {
        id: "char-f8027c6b-8574-4abe-af03-8459868c19ab",
        name: "Chronos",
        server: { id: "server-2", name: "other", mono_account: false },
        breed: { name: "Xélor" },
      },
    ]);
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    const checkboxContainer = await screen.findByTestId("characters-checkbox");
    expect(checkboxContainer).toBeInTheDocument();
    expect(screen.getByText("Night-Hunter")).toBeInTheDocument();
    expect(screen.queryByText("Chronos")).not.toBeInTheDocument();
  });

  it("Displays an axios error", async () => {
    mockGetAllEnrichedByUserId.mockRejectedValueOnce({
      isAxiosError: true,
      message: "Axios error",
    });
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith(
        t("common.error.default"),
        "Axios error",
      );
    });
  });

  it("Displays a general error", async () => {
    mockGetAllEnrichedByUserId.mockRejectedValueOnce(
      new Error(t("common.error.default")),
    );
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith(
        t("common.error.default"),
        t("system.error.occurred"),
      );
    });
  });

  it("Display nothing if user or updatedTarget are not defined", () => {
    mockUser = null;
    const { container } = render(<JoinEventForm handleSubmit={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
