import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import { t } from "../../../i18n/i18n-helper";

import CharacterDetails from "../CharacterDetails";

// Mock config
vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock service
let getOneEnrichedMock: any;

vi.mock("../../../services/api/characterService", () => {
  return {
    CharacterService: vi.fn().mockImplementation(() => ({
      getOneEnriched: (...args: any[]) => getOneEnrichedMock(...args),
    })),
  };
});

// Mock react-router
const navigateMock = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Navigate: ({ to }: { to: string }) => {
      navigateMock(to);
      return null; // render nothing instead of real Navigate
    },
    useParams: () => ({ id: "123" }),
  };
});

// Mock context
vi.mock("../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: { id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e", username: "toto" },
  }),
}));

const openModal = vi.fn();
const handleDelete = vi.fn();
vi.mock("../../../contexts/modalContext", () => ({
  useModal: () => ({
    openModal,
    handleDelete,
    updateTarget: vi.fn(),
  }),
}));

const mockCharacter = {
  id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
  name: "Chronos",
  sex: "M",
  level: 50,
  alignment: "Neutre",
  stuff: "https://d-bk.net/fr/d/1QVjw",
  default_character: false,
  server: {
    id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
    name: "Dakal",
    mono_account: true,
  },
  breed: {
    id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
    name: "Cra",
  },
  events: [],
  user: {
    id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
    username: "toto",
  },
};

function renderWithRouter() {
  return render(
    <MemoryRouter
      initialEntries={["/character/cfff40b3-9625-4f0a-854b-d8d6d6b4b667"]}
    >
      <Routes>
        <Route path="/character/:id" element={<CharacterDetails />} />
        <Route path="/not-found" element={<p>Not Found Page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CharacterDetails", () => {
  beforeEach(() => {
    getOneEnrichedMock = vi.fn().mockResolvedValue(mockCharacter);
    openModal.mockClear();
    handleDelete.mockClear();
    navigateMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    getOneEnrichedMock = vi.fn().mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    renderWithRouter();

    expect(screen.getByText(t("common.loading"))).toBeInTheDocument();
  });

  it("renders character details after successful fetch", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Chronos")).toBeInTheDocument();
    });

    expect(
      screen.getByText(t("breed.upperCase"), { exact: false }).closest("p"),
    ).toHaveTextContent(`${t("breed.upperCase")}: Cra`);

    expect(
      screen.getByText(t("server.upperCase"), { exact: false }).closest("p"),
    ).toHaveTextContent(`${t("server.upperCase")}: Dakal`);

    expect(
      screen.getByText(t("common.level"), { exact: false }).closest("p"),
    ).toHaveTextContent(`${t("common.level")}: 50`);

    expect(
      screen.getByText(t("common.alignment"), { exact: false }).closest("p"),
    ).toHaveTextContent(`${t("common.alignment")}: Neutre`);

    expect(
      screen.getByText(t("common.sex"), { exact: false }).closest("p"),
    ).toHaveTextContent(`${t("common.sex")}: M`);

    expect(
      screen.getByText(t("common.stuff"), { exact: false }).closest("a"),
    ).toHaveTextContent(`${t("common.stuff")}: https://d-bk.net/fr/d/1QVjw`);
  });

  it("renders nothing if character is null (Navigate is rendered)", async () => {
    getOneEnrichedMock = vi.fn().mockResolvedValue(null);

    renderWithRouter();

    await waitFor(() => {
      // Vérifie que le contenu "Chronos" ou les boutons ne sont pas présents
      expect(screen.queryByText("Chronos")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: t("common.return") }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows action buttons if character belongs to logged-in user", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: t("common.change") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("common.delete.default") }),
      ).toBeInTheDocument();
    });
  });

  it("calls openModal when clicking Edit", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText("Chronos"));

    fireEvent.click(screen.getByRole("button", { name: t("common.change") }));

    expect(openModal).toHaveBeenCalledWith("updateCharacter", mockCharacter);
  });

  it("calls handleDelete when clicking Delete", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText("Chronos"));

    fireEvent.click(
      screen.getByRole("button", { name: t("common.delete.default") }),
    );

    expect(handleDelete).toHaveBeenCalledWith(
      "character_details",
      "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    );
  });

  it("navigates back to profile when clicking Return", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText("Chronos"));

    fireEvent.click(screen.getByRole("button", { name: t("common.return") }));

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("logs axios error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getOneEnrichedMock = vi
      .fn()
      .mockRejectedValue({ isAxiosError: true, message: "Axios fail" });

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Axios error:", "Axios fail");
    });

    consoleSpy.mockRestore();
  });

  it("logs general error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getOneEnrichedMock = vi.fn().mockRejectedValue(new Error("General fail"));

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("General error:", "General fail");
    });

    consoleSpy.mockRestore();
  });
});
