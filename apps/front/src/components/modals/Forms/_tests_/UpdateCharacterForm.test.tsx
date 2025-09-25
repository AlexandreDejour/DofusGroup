import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useNotification } from "../../../../contexts/notificationContext";

import { BreedRadioProps } from "../../FormComponents/Radio/BreedRadio";
import { GenderRadioProps } from "../../FormComponents/Radio/GenderRadio";
import { SelectOptionsProps } from "../../FormComponents/Options/SelectOptions";

import UpdateCharacterForm from "../../forms/UpdateCharacterForm/UpdateCharacterForm";
import * as BreedService from "../../../../services/api/breedService";
import * as ServerService from "../../../../services/api/serverService";

// Mock config
vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// 1. Mock services
vi.mock("../../../../services/api/breedService");
vi.mock("../../../../services/api/serverService");

// 2. Mock context
vi.mock("../../../../contexts/notificationContext", () => ({
  useNotification: vi.fn(),
}));

// 3. Mock components
vi.mock("../../FormComponents/Radio/BreedRadio", () => ({
  default: ({ onChange, breeds, value, sex }: BreedRadioProps) => (
    <div data-testid="breed-radio">
      <input
        data-testid="breed-radio-input"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  ),
}));

vi.mock("../../FormComponents/Radio/GenderRadio", () => ({
  default: ({ onChange, value }: GenderRadioProps) => (
    <div data-testid="gender-radio">
      <input
        data-testid="gender-radio-input"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  ),
}));

vi.mock("../../FormComponents/Options/SelectOptions", () => ({
  default: ({ name, onChange, value, label }: SelectOptionsProps<any, any>) => (
    // Le data-testid est maintenant unique pour chaque SelectOptions
    <div data-testid={`select-options-${name}`}>
      <label>{label}</label>
      <select
        name={name}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  ),
}));

describe("NewCharacterForm", () => {
  const mockShowError = vi.fn();
  const mockHandleSubmit = vi.fn();

  const mockUpdateTarget = {
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
  const mockBreeds = [{ id: "123", name: "Iop" }];
  const mockServers = [{ id: "123", name: "Serveur Test", mono_account: true }];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNotification).mockReturnValue({
      showError: mockShowError,
      notifications: [],
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
    });
  });

  it("should render the form and fetch data on mount", async () => {
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);

    render(
      <UpdateCharacterForm
        updateTarget={mockUpdateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Modification de personnage/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        BreedService.BreedService.prototype.getBreeds,
      ).toHaveBeenCalledTimes(1);
      expect(
        ServerService.ServerService.prototype.getServers,
      ).toHaveBeenCalledTimes(1);

      expect(screen.getByTestId("breed-radio")).toBeInTheDocument();
      expect(screen.getByTestId("gender-radio")).toBeInTheDocument();
      expect(screen.getByTestId("select-options-server")).toBeInTheDocument();
      expect(
        screen.getByTestId("select-options-alignment"),
      ).toBeInTheDocument();
    });
  });

  it("should call showError when fetching breeds fails", async () => {
    const errorMessage = "Erreur de connexion aux races";
    vi.mocked(
      BreedService.BreedService.prototype.getBreeds,
    ).mockRejectedValueOnce({
      isAxiosError: true,
      message: errorMessage,
    });
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);

    render(
      <UpdateCharacterForm
        updateTarget={mockUpdateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith("Erreur", errorMessage);
    });
  });

  it("should call showError when fetching servers fails", async () => {
    const errorMessage = "Erreur de connexion aux serveurs";
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockRejectedValueOnce({
      isAxiosError: true,
      message: errorMessage,
    });

    render(
      <UpdateCharacterForm
        updateTarget={mockUpdateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith("Erreur", errorMessage);
    });
  });

  it("should call handleSubmit on form submission", async () => {
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);

    render(
      <UpdateCharacterForm
        updateTarget={mockUpdateTarget}
        handleSubmit={mockHandleSubmit}
      />,
    );

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockHandleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ type: "submit" }),
    );
  });
});
