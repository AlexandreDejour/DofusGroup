import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useAuth } from "../../../../contexts/authContext";
import { useNotification } from "../../../../contexts/notificationContext";

import * as TagService from "../../../../services/api/tagService";
import formatDateToLocalInput from "../../utils/formatDateToLocalInput";
import * as ServerService from "../../../../services/api/serverService";
import * as DofusDBService from "../../../../services/api/dofusDBService";
import { SelectOptionsProps } from "../../FormComponents/Options/SelectOptions";

import UpdateEventForm from "../UpdateEventForm";
import { EventEnriched } from "../../../../types/event";

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
        {name === "area" && <option value="Amakna">Amakna</option>}
        {name === "sub_area" && (
          <option value="Forêt d’Amakna">Forêt d’Amakna</option>
        )}
        {name === "tag" && <option value="123">Donjon</option>}
      </select>
    </div>
  ),
}));

vi.mock("../../utils/formatDateToLocalInput", () => ({
  default: vi.fn(),
}));

describe("UpdateEventForm", () => {
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

  const updateTarget: EventEnriched = {
    id: "evt-1",
    title: "Titre existant",
    tag: { id: "123", name: "Donjon", color: "#0000" },
    server: { id: "456", name: "Serveur Test", mono_account: true },
    date: new Date("2025-10-26T10:00"),
    duration: 120,
    area: "Amakna",
    sub_area: "Forêt d’Amakna",
    donjon_name: "Donjon Corbac",
    max_players: 8,
    description: "Description existante",
    status: "public",
    characters: [],
    comments: [],
    user: { id: "user123", username: "toto" },
  };

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

    vi.mocked(TagService.TagService.prototype.getTags).mockResolvedValue(
      mockTags,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);
    vi.mocked(
      DofusDBService.DofusDBService.prototype.getAreas,
    ).mockResolvedValue(mockAreas);
  });

  it("should render the form and fetch initial data on mount", async () => {
    render(
      <UpdateEventForm
        updateTarget={updateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Modification d'évènement/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();

    await waitFor(() => {
      expect(TagService.TagService.prototype.getTags).toHaveBeenCalledTimes(1);
      expect(
        ServerService.ServerService.prototype.getServers,
      ).toHaveBeenCalledTimes(1);
      expect(
        DofusDBService.DofusDBService.prototype.getAreas,
      ).toHaveBeenCalledTimes(1);
    });
  });

  it("should call handleSubmit on form submission", async () => {
    render(
      <UpdateEventForm
        updateTarget={updateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    fireEvent.submit(screen.getByRole("form"));

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockHandleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ type: "submit" }),
    );
  });

  it("should show error if fetching tags fails", async () => {
    vi.mocked(TagService.TagService.prototype.getTags).mockRejectedValue(
      new Error("Erreur générale"),
    );

    render(
      <UpdateEventForm
        updateTarget={updateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue",
      );
    });
  });

  it("should show error if fetching servers fails", async () => {
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockRejectedValue(new Error("Erreur générale"));

    render(
      <UpdateEventForm
        updateTarget={updateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue",
      );
    });
  });

  it("should show error if fetching areas fails", async () => {
    vi.mocked(
      DofusDBService.DofusDBService.prototype.getAreas,
    ).mockRejectedValue(new Error("Erreur générale"));

    render(
      <UpdateEventForm
        updateTarget={updateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue",
      );
    });
  });
});
