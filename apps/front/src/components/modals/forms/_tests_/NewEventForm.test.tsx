import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { t } from "../../../../i18n/i18n-helper";

import NewEventForm from "../NewEventForm/NewEventForm";

// --- Mocks ---
// i18n helper (t returns key)
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (k: string) => k,
  t: (k: string) => k,
}));

// Auth context -> provide a user so component renders
vi.mock("../../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: { id: "user-1", username: "tester" },
  }),
}));

// Hooks used by NewEventForm
vi.mock("../../../../hooks/useFetchTags", () => ({
  __esModule: true,
  default: () => ({ tags: [{ id: "tag-1", name: "Donjon" }] }),
}));
vi.mock("../../../../hooks/useFetchServers", () => ({
  __esModule: true,
  default: () => ({
    servers: [
      { id: "srv-1", name: "Salar" },
      { id: "srv-2", name: "Dakal" },
    ],
  }),
}));
vi.mock("../../../../hooks/useFetchUserCharacters", () => ({
  __esModule: true,
  default: (userId: string, serverId: string) => ({
    characters:
      serverId === "srv-2"
        ? [
            { id: "c-2", name: "CharTwo", level: 20 },
            { id: "c-3", name: "CharThree", level: 30 },
          ]
        : [{ id: "c-1", name: "Chronos", level: 50 }],
  }),
}));
vi.mock("../../../../hooks/useFetchAreas", () => ({
  __esModule: true,
  default: () => ({ areas: [{ id: "a-1", name: "Amakna" }] }),
}));
vi.mock("../../../../hooks/useFetchSubAreas", () => ({
  __esModule: true,
  default: (areas: any, area: string) => ({
    subAreas: area ? [{ id: "sa-1", name: "Coin des bouftous" }] : [],
  }),
}));
vi.mock("../../../../hooks/useFetchDungeons", () => ({
  __esModule: true,
  default: () => ({ dungeons: [], isDungeon: false }),
}));

// Mock SelectOptions and CharactersOptions to simple elements we can interact with
vi.mock("../../formComponents/Options/SelectOptions", () => ({
  __esModule: true,
  default: ({ items, label, value, onChange }: any) => (
    <div data-testid={`select-${label}`}>
      <span>{label}</span>
      {items?.map((it: any) => (
        <button
          key={it.id}
          data-testid={`option-${label}-${it.id}`}
          onClick={() => onChange(it.id)}
        >
          {it.name ?? it.label ?? it.value}
        </button>
      ))}
      <input
        aria-label={`hidden-${label}`}
        value={value ?? ""}
        readOnly
        style={{ display: "none" }}
      />
    </div>
  ),
}));

vi.mock("../../formComponents/Options/CharactersOptions", () => ({
  __esModule: true,
  default: ({ items, label, onChange, value }: any) => (
    <div data-testid={`chars-${label}`}>
      <span>{label}</span>
      {items?.map((c: any) => (
        <button
          key={c.id}
          data-testid={`char-option-${c.id}`}
          onClick={() => onChange([...(value ?? []), c.id])}
        >
          {c.name}
        </button>
      ))}
      <input
        aria-label={`hidden-${label}-value`}
        value={(value ?? []).join(",")}
        readOnly
        style={{ display: "none" }}
      />
    </div>
  ),
}));

// --- Tests ---
describe("NewEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rend le formulaire avec tous les champs attendus", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(<NewEventForm handleSubmit={handleSubmit} />);

    // titre du formulaire
    expect(
      screen.getByRole("heading", { name: t("event.create") }),
    ).toBeInTheDocument();

    // inputs principaux
    expect(screen.getByPlaceholderText(t("common.title"))).toBeInTheDocument();
    expect(
      screen.getByLabelText("date", {
        selector: "input,textarea",
        exact: false,
      }) || screen.getByLabelText("date", { selector: "input,textarea" }),
    ).toBeTruthy();

    // durée, description et bouton de soumission
    expect(
      screen.getByPlaceholderText(t("common.durationInMin")),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(t("common.description")),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("event.create") }),
    ).toBeInTheDocument();
  });

  it("permet de sélectionner un serveur et met à jour la liste des personnages", async () => {
    render(<NewEventForm handleSubmit={() => {}} />);

    // Vérifier que les options de serveur sont présentes
    const serverOption = screen.getByTestId("option-server.default-srv-1");
    expect(serverOption).toBeInTheDocument();

    // Cliquer sur serveur 2 pour changer sélection et provoquer fetch des characters
    const serverOption2 = screen.getByTestId("option-server.default-srv-2");
    fireEvent.click(serverOption2);

    // After selecting server, CharactersOptions should render characters for srv-2
    await waitFor(() => {
      expect(screen.getByTestId("char-option-c-2")).toBeInTheDocument();
      expect(screen.getByTestId("char-option-c-3")).toBeInTheDocument();
    });
  });

  it("permet d'ajouter des personnages sélectionnés via CharactersOptions", async () => {
    render(<NewEventForm handleSubmit={() => {}} />);

    // Select server 1 (default) then click character
    const charButton = screen.getByTestId("char-option-c-1");
    fireEvent.click(charButton);

    // The hidden input should reflect selection
    const hidden = screen.getByLabelText("hidden-character.selection-value");
    expect(hidden).toHaveValue("c-1");
  });

  it("soumet le formulaire en appelant handleSubmit", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(<NewEventForm handleSubmit={handleSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("change la valeur de la date et respecte l'attribut min", () => {
    render(<NewEventForm handleSubmit={() => {}} />);

    const dateInput =
      screen.getByLabelText("date", {
        selector: "input,textarea",
        exact: false,
      }) || screen.getByLabelText("date", { selector: "input,textarea" });

    // On vérifie qu'il existe et qu'il contient un attribut min
    expect(dateInput).toBeDefined();
    expect(dateInput.getAttribute("min")).toBeTruthy();

    // Simuler changement
    fireEvent.change(dateInput, { target: { value: "2025-12-24T20:00" } });
    expect(dateInput).toHaveValue("2025-12-24T20:00");
  });
});
