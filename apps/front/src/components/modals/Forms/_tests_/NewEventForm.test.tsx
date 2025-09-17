import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useAuth } from "../../../../contexts/authContext";
import { useNotification } from "../../../../contexts/notificationContext";

import * as TagService from "../../../../services/api/tagService";
import formatDateToLocalInput from "../../utils/formatDateToLocalInput";
import * as ServerService from "../../../../services/api/serverService";
import * as DofusDBService from "../../../../services/api/dofusDBService";
import * as CharacterService from "../../../../services/api/characterService";
import { SelectOptionsProps } from "../../FormComponents/Options/SelectOptions";
import { CharactersOptionsProps } from "../../FormComponents/Options/CharactersOptions";

import NewEventForm from "../../Forms/NewEventForm";

// Mock config
vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock services
vi.mock("../../../../services/api/tagService");
vi.mock("../../../../services/api/serverService");
vi.mock("../../../../services/api/dofusDBService");
vi.mock("../../../../services/api/characterService");

// Mock context
vi.mock("../../../../contexts/authContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("../../../../contexts/notificationContext", () => ({
  useNotification: vi.fn(),
}));

// Mock child components
vi.mock("../../FormComponents/Options/SelectOptions", () => ({
  default: ({ name, onChange, value, label }: SelectOptionsProps<any, any>) => (
    <div data-testid={`select-options-${name}`}>
      <label>{label}</label>
      <select
        name={name}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        <option value="">Sélectionner...</option>
        {name === "area" && <option value="Astrub">Astrub</option>}
        {name === "sub_area" && (
          <option value="Forêt d’Astrub">Forêt d’Astrub</option>
        )}
        {name === "tag" && <option value="123">Donjon</option>}
      </select>
    </div>
  ),
}));

vi.mock("../../FormComponents/Options/CharactersOptions", () => ({
  default: ({
    name,
    onChange,
    value,
    items,
    label,
  }: CharactersOptionsProps<any, any>) => (
    <div data-testid={`characters-options-${name}`}>
      <label>{label}</label>
      <select
        name={name}
        onChange={(e) =>
          onChange(Array.from(e.target.selectedOptions).map((o) => o.value))
        }
        value={value}
      />
    </div>
  ),
}));

vi.mock("../../utils/formatDateToLocalInput", () => ({
  default: vi.fn(),
}));

describe("NewEventForm", () => {
  const mockShowError = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockUser = {
    id: "123",
    username: "testuser",
    password: "motdepasse",
    mail: "user@mail.test",
  };

  const mockTags = [{ id: "123", name: "Donjon", color: "#0000" }];
  const mockServers = [{ id: "456", name: "Serveur Test", mono_account: true }];
  const mockAreas = [
    {
      id: 1,
      name: {
        id: "123",
        en: "Astrub",
        es: "Astrub",
        pt: "Astrub",
        de: "Astrub",
        fr: "Astrub",
      },
    },
  ];
  const mockSubAreas = [
    {
      id: 2,
      dungeonId: 3,
      name: {
        id: "123",
        en: "Astrub forest",
        es: "Bosque de Astrub",
        pt: "Floresta de Astrub",
        de: "Astrub-Wald",
        fr: "Forêt d’Astrub",
      },
    },
  ];
  const mockDungeons = [
    {
      id: 3,
      name: {
        id: "123",
        en: "Bouftou Dungeon",
        es: "Mazmorra de Bouftou",
        pt: "Calabouço Bouftou",
        de: "Bouftou-Dungeon",
        fr: "Donjon Bouftou",
      },
    },
  ];
  const mockCharacters = [
    {
      id: "789",
      name: "Perso Test",
      sex: "M",
      level: 200,
      alignment: "Bonta",
      stuff: "",
      default_character: true,
      user_id: "123",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      setUser: vi.fn(),
      isAuthLoading: false,
      logout: vi.fn(),
    });
    vi.mocked(useNotification).mockReturnValue({
      showError: mockShowError,
      notifications: [],
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
    });
    vi.mocked(formatDateToLocalInput).mockReturnValue("2025-10-26T10:00");

    // Simuler les appels API réussis par défaut
    vi.mocked(TagService.TagService.prototype.getTags).mockResolvedValue(
      mockTags,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);
    vi.mocked(
      DofusDBService.DofusDBService.prototype.getAreas,
    ).mockResolvedValue(mockAreas);
    vi.mocked(
      CharacterService.CharacterService.prototype.getAllByUserId,
    ).mockResolvedValue(mockCharacters);
  });

  it("should render the form and fetch initial data on mount", async () => {
    render(<NewEventForm handleSubmit={mockHandleSubmit} />);

    // Vérification du rendu initial
    expect(
      screen.getByRole("heading", { name: /Création d'évènement/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();

    // Attendre que tous les appels API initiaux soient terminés
    await waitFor(() => {
      expect(TagService.TagService.prototype.getTags).toHaveBeenCalledTimes(1);
      expect(
        ServerService.ServerService.prototype.getServers,
      ).toHaveBeenCalledTimes(1);
      expect(
        DofusDBService.DofusDBService.prototype.getAreas,
      ).toHaveBeenCalledTimes(1);
      expect(
        CharacterService.CharacterService.prototype.getAllByUserId,
      ).toHaveBeenCalledTimes(1);
    });
  });

  it("should fetch sub-areas when area state changes", async () => {
    vi.mocked(
      DofusDBService.DofusDBService.prototype.getSubAreas,
    ).mockResolvedValue(mockSubAreas);

    render(<NewEventForm handleSubmit={mockHandleSubmit} />);

    await waitFor(() => {
      expect(screen.getByTestId("select-options-area")).toBeInTheDocument();
    });

    const areaSelect = screen
      .getByTestId("select-options-area")
      .querySelector("select")!;
    fireEvent.change(areaSelect, {
      target: { value: "Astrub" },
    });

    await waitFor(() => {
      expect(
        DofusDBService.DofusDBService.prototype.getSubAreas,
      ).toHaveBeenCalledWith(1);
      expect(screen.getByTestId("select-options-sub_area")).toBeInTheDocument();
    });
  });

  it("should fetch dungeons when tag and sub-area states change", async () => {
    vi.mocked(
      DofusDBService.DofusDBService.prototype.getDungeons,
    ).mockResolvedValue(mockDungeons);
    vi.mocked(
      DofusDBService.DofusDBService.prototype.getSubAreas,
    ).mockResolvedValue(mockSubAreas);

    render(<NewEventForm handleSubmit={mockHandleSubmit} />);

    // Wait for the initial rendering and data fetching to complete
    await waitFor(() => {
      expect(screen.getByTestId("select-options-tag")).toBeInTheDocument();
      expect(screen.getByTestId("select-options-area")).toBeInTheDocument();
    });

    // 1. Simulate the tag change to "Donjon"
    const tagSelect = screen
      .getByTestId("select-options-tag")
      .querySelector("select")!;
    fireEvent.change(tagSelect, {
      target: { value: "123" },
    });

    // 2. Simulate the area change to "Astrub"
    const areaSelect = screen
      .getByTestId("select-options-area")
      .querySelector("select")!;
    fireEvent.change(areaSelect, {
      target: { value: "Astrub" },
    });

    // 3. Wait for the sub-areas to be fetched and the new select element to appear
    await waitFor(() => {
      expect(
        DofusDBService.DofusDBService.prototype.getSubAreas,
      ).toHaveBeenCalledWith(1);
      expect(screen.getByTestId("select-options-sub_area")).toBeInTheDocument();
    });

    // 4. Simulate the sub-area change to "Forêt d’Astrub"
    const subAreaSelect = screen
      .getByTestId("select-options-sub_area")
      .querySelector("select")!;
    fireEvent.change(subAreaSelect, {
      target: { value: "Forêt d’Astrub" },
    });

    // 5. Wait for the dungeons to be fetched and the dungeon select to appear
    await waitFor(() => {
      expect(
        DofusDBService.DofusDBService.prototype.getDungeons,
      ).toHaveBeenCalledWith(3);
      expect(
        screen.getByTestId("select-options-donjon_name"),
      ).toBeInTheDocument();
    });
  });

  it("should not fetch characters if user is not authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      setUser: vi.fn(),
      isAuthLoading: false,
      logout: vi.fn(),
    });

    render(<NewEventForm handleSubmit={mockHandleSubmit} />);

    await waitFor(() => {
      expect(
        CharacterService.CharacterService.prototype.getAllByUserId,
      ).not.toHaveBeenCalled();
    });
  });

  it("should call handleSubmit on form submission", async () => {
    render(<NewEventForm handleSubmit={mockHandleSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockHandleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ type: "submit" }),
    );
  });
});
