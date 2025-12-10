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
      return null;
    },
    useParams: () => ({ id: "char-1" }),
  };
});

// Mock context
vi.mock("../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
  }),
}));

const openModal = vi.fn();
const handleDelete = vi.fn();
vi.mock("../../../contexts/modalContext", () => ({
  useModal: () => ({
    openModal,
    handleDelete,
  }),
}));

const mockCharacter = {
  id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
  name: "Chronos",
  sex: "M",
  level: 50,
  alignment: "Bonta",
  stuff: "https://d-bk.net/fr/d/1QVjw",
  server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
  user: {
    id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159",
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
};

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/character/char-1"]}>
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

  it("Display spinner at initial renderer", async () => {
    getOneEnrichedMock = vi
      .fn()
      .mockImplementation(() => new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByLabelText("Loading Spinner")).toBeInTheDocument();
  });

  it("Renders character details after successful fetch", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/chronos/i)).toBeInTheDocument();
    });

    const classLine = screen.getByText(/Class/i).closest("p");
    expect(classLine).toHaveTextContent("Xélor");
    const serverLine = screen.getByText(/Server/i).closest("p");
    expect(serverLine).toHaveTextContent("Rafal");
    const levelLine = screen.getByText(/Level/i).closest("p");
    expect(levelLine).toHaveTextContent("50");
    const alignmentLine = screen.getByText(/Alignment/i).closest("p");
    expect(alignmentLine).toHaveTextContent("Bonta");
    const sexLine = screen.getByText(/Sex/i).closest("p");
    expect(sexLine).toHaveTextContent("M");
    const stuffLine = screen.getByText(/Stuff/i).closest("a");
    expect(stuffLine).toHaveTextContent("https://d-bk.net");
  });

  it("Displays correct breed image for male character", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/chronos/i)).toBeInTheDocument();
    });

    const img = screen.getByAltText(/Class thumbnail xélor/i);
    expect(img).toHaveAttribute("src", "/characters/xélor_male.webp");
  });

  it("Displays correct breed image for female character", async () => {
    const femaleCharacter = { ...mockCharacter, sex: "F" };
    getOneEnrichedMock = vi.fn().mockResolvedValue(femaleCharacter);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/chronos/i)).toBeInTheDocument();
    });

    const img = screen.getByAltText(/Class thumbnail xélor/i);
    expect(img).toHaveAttribute("src", "/characters/xélor_female.webp");
  });

  it("Shows action buttons if user owns the character", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/chronos/i));

    expect(
      screen.getByRole("button", { name: t("common.change") }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("common.delete.default") }),
    ).toBeInTheDocument();
  });

  it("Hides action buttons if user does not own the character", async () => {
    const otherUserCharacter = {
      ...mockCharacter,
      user: {
        id: "other-user-id",
        username: "otheruser",
      },
    };
    getOneEnrichedMock = vi.fn().mockResolvedValue(otherUserCharacter);

    renderWithRouter();

    await waitFor(() => screen.getByText(/chronos/i));

    expect(
      screen.queryByRole("button", { name: t("common.change") }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: t("common.delete.default") }),
    ).not.toBeInTheDocument();
  });

  it("Calls openModal when clicking Modifier", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/chronos/i));

    fireEvent.click(screen.getByRole("button", { name: t("common.change") }));
    expect(openModal).toHaveBeenCalledWith("updateCharacter", mockCharacter);
  });

  it("Calls handleDelete when clicking Supprimer", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/chronos/i));

    fireEvent.click(
      screen.getByRole("button", { name: t("common.delete.default") }),
    );
    expect(handleDelete).toHaveBeenCalledWith(
      "character_details",
      "9f0eaa8c-eec1-4e85-9365-7653c1330325",
    );
  });

  it("Navigates back when clicking Retour", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/chronos/i));

    fireEvent.click(screen.getByRole("button", { name: t("common.return") }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("Renders nothing and navigates to /not-found if character is null", async () => {
    getOneEnrichedMock = vi.fn().mockResolvedValue(null);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/chronos/i)).not.toBeInTheDocument();
    });
  });

  it("Renders nothing and navigates to /not-found if event is null", async () => {
    getOneEnrichedMock = vi.fn().mockResolvedValue(null);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/titre test/i)).not.toBeInTheDocument();
    });
  });

  it("Capitalizes first letter of character name", async () => {
    const lowercaseCharacter = {
      ...mockCharacter,
      name: "chronos",
    };
    getOneEnrichedMock = vi.fn().mockResolvedValue(lowercaseCharacter);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/chronos/i)).toBeInTheDocument();
    });

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Chronos");
  });

  it("Renders stuff link with correct href", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/chronos/i));

    const stuffLink = screen.getByRole("link");
    expect(stuffLink).toHaveAttribute("href", mockCharacter.stuff);
    expect(stuffLink).toHaveAttribute("target", "_blank");
    expect(stuffLink).toHaveAttribute("rel", "noreferrer");
  });
});
