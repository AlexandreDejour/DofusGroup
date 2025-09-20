import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import JoinEventForm from "../JoinEventForm";

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

// Mock CharactersCheckbox
vi.mock("../../FormComponents/Checkbox/CharactersCheckbox", () => ({
  __esModule: true,
  default: ({ characters }: any) => (
    <div data-testid="characters-checkbox">
      {characters.map((c: any) => (
        <span key={c.id}>{c.name}</span>
      ))}
    </div>
  ),
}));

describe("JoinEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la liste des personnages si disponibles", async () => {
    mockGetAllEnrichedByUserId.mockResolvedValueOnce([
      {
        id: "char-d078b475-42cd-4008-9ba7-750d251e9b76",
        name: "Night-Hunter",
        server: serverObj,
      },
      {
        id: "char-f8027c6b-8574-4abe-af03-8459868c19ab",
        name: "Chronos",
        server: serverObj,
      },
    ]);

    render(<JoinEventForm handleSubmit={vi.fn()} />);
    const checkboxContainer = await screen.findByTestId("characters-checkbox");
    expect(checkboxContainer).toBeInTheDocument();
    expect(screen.getByText("Night-Hunter")).toBeInTheDocument();
    expect(screen.getByText("Chronos")).toBeInTheDocument();
  });

  it("affiche le message si aucun personnage n'est disponible", async () => {
    mockGetAllEnrichedByUserId.mockResolvedValueOnce([]);
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    await waitFor(() => {
      expect(
        screen.getByText("Aucun personnages disponible sur ce serveur"),
      ).toBeInTheDocument();
    });
  });

  it("filtre les personnages sur le bon serveur", async () => {
    mockGetAllEnrichedByUserId.mockResolvedValueOnce([
      {
        id: "char-d078b475-42cd-4008-9ba7-750d251e9b76",
        name: "Night-Hunter",
        server: serverObj,
      },
      {
        id: "char-f8027c6b-8574-4abe-af03-8459868c19ab",
        name: "Chronos",
        server: { id: "server-2", name: "Autre", mono_account: false },
      },
    ]);
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    const checkboxContainer = await screen.findByTestId("characters-checkbox");
    expect(checkboxContainer).toBeInTheDocument();
    expect(screen.getByText("Night-Hunter")).toBeInTheDocument();
    expect(screen.queryByText("Chronos")).not.toBeInTheDocument();
  });

  it("affiche une erreur axios", async () => {
    mockGetAllEnrichedByUserId.mockRejectedValueOnce({
      isAxiosError: true,
      message: "Erreur axios",
    });
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith("Erreur", "Erreur axios");
    });
  });

  it("affiche une erreur générale", async () => {
    mockGetAllEnrichedByUserId.mockRejectedValueOnce(
      new Error("Erreur générale"),
    );
    render(<JoinEventForm handleSubmit={vi.fn()} />);
    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue",
      );
    });
  });

  it("ne rend rien si user ou updateTarget sont absents", () => {
    mockUser = null;
    const { container } = render(<JoinEventForm handleSubmit={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
