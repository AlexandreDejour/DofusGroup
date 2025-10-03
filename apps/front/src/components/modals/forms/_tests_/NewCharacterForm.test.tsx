import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import { useNotification } from "../../../../contexts/notificationContext";

import NewCharacterForm from "../NewCharacterForm/NewCharacterForm";
import * as BreedService from "../../../../services/api/breedService";
import * as ServerService from "../../../../services/api/serverService";

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
vi.mock("../../formComponents/Radio/BreedRadio", () => ({
  default: (props: any) => (
    <div data-testid="breed-radio">
      <button onClick={() => props.onChange("breed-2")}>Select Iop</button>
    </div>
  ),
}));

vi.mock("../../formComponents/Radio/GenderRadio", () => ({
  default: (props: any) => (
    <div data-testid="gender-radio">
      <button onClick={() => props.onChange("F")}>Select Female</button>
    </div>
  ),
}));

vi.mock("../../formComponents/Options/SelectOptions", () => ({
  default: (props: any) => (
    <div data-testid={`select-options-${props.name}`}>
      <label>{props.label}</label>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">Sélectionner...</option>
        {props.items.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.name || item.label || item}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe("NewCharacterForm", () => {
  const mockShowError = vi.fn();
  const mockHandleSubmit = vi.fn();

  const mockBreeds = [{ id: "123", name: "Iop" }];
  const mockServers = [{ id: "123", name: "Test server", mono_account: true }];

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

  it("Should render the form and fetch data on mount", async () => {
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);

    render(<NewCharacterForm handleSubmit={mockHandleSubmit} />);

    expect(
      screen.getByRole("heading", { name: t("character.create") }),
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

  it("Should call showError when fetching breeds fails", async () => {
    const errorMessage = "Breed connection error";
    vi.mocked(
      BreedService.BreedService.prototype.getBreeds,
    ).mockRejectedValueOnce({
      isAxiosError: true,
      message: errorMessage,
    });
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);

    render(<NewCharacterForm handleSubmit={mockHandleSubmit} />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        t("common.error.default"),
        errorMessage,
      );
    });
  });

  it("Should call showError when fetching servers fails", async () => {
    const errorMessage = "Server connection error";
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockRejectedValueOnce({
      isAxiosError: true,
      message: errorMessage,
    });

    render(<NewCharacterForm handleSubmit={mockHandleSubmit} />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        t("common.error.default"),
        errorMessage,
      );
    });
  });

  it("Should call handleSubmit on form submission", async () => {
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);

    render(<NewCharacterForm handleSubmit={mockHandleSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockHandleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ type: "submit" }),
    );
  });
});
