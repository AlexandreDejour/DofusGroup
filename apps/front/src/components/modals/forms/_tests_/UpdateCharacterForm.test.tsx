import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import { useNotification } from "../../../../contexts/notificationContext";

import * as BreedService from "../../../../services/api/breedService";
import * as ServerService from "../../../../services/api/serverService";

import UpdateCharacterForm from "../UpdateCharacterForm/UpdateCharacterForm";

// Mock config
vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock services
vi.mock("../../../../services/api/breedService");
vi.mock("../../../../services/api/serverService");

// Mock context
vi.mock("../../../../contexts/notificationContext", () => ({
  useNotification: vi.fn(),
}));

// Mock child components
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

// Données de test
const mockBreeds = [
  { id: "breed-1", name: "Cra" },
  { id: "breed-2", name: "Iop" },
];
const mockServers = [
  { id: "server-1", name: "Jiva", mono_account: true },
  { id: "server-2", name: "Agride", mono_account: false },
];
const updateTarget = {
  id: "char-1",
  name: "Night-Hunter",
  sex: "M",
  level: 190,
  alignment: "Bonta",
  stuff: "https://dofusbook.net/stuff/123",
  default_character: true,
  server_id: "server-1",
  breed: { id: "breed-1", name: "Cra" },
  server: { id: "server-1", name: "Jiva", mono_account: true },
  user: { id: "user-1", username: "toto" },
};

describe("UpdateCharacterForm", () => {
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(BreedService.BreedService.prototype.getBreeds).mockResolvedValue(
      mockBreeds,
    );
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockResolvedValue(mockServers);
    vi.mocked(useNotification).mockReturnValue({
      showError: mockShowError,
      notifications: [],
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
    });
  });

  it("Displays the form with the initial values", async () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: t("character.modification") }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(`${t("common.name")}:`)).toHaveValue(
      "Night-Hunter",
    );
    expect(screen.getByLabelText(`${t("common.level")}:`)).toHaveValue(190);
    expect(screen.getByLabelText(`${t("common.stuff")}:`)).toHaveValue(
      "https://dofusbook.net/stuff/123",
    );

    await waitFor(() => {
      expect(BreedService.BreedService.prototype.getBreeds).toHaveBeenCalled();
      expect(
        ServerService.ServerService.prototype.getServers,
      ).toHaveBeenCalled();
      expect(screen.getByTestId("breed-radio")).toBeInTheDocument();
      expect(screen.getByTestId("gender-radio")).toBeInTheDocument();
      expect(screen.getByTestId("select-options-server")).toBeInTheDocument();
      expect(
        screen.getByTestId("select-options-alignment"),
      ).toBeInTheDocument();
    });
  });

  it("Update stuff", async () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={vi.fn()}
      />,
    );
    const nameInput = screen.getByLabelText(`${t("common.name")}:`);
    const stuffInput = screen.getByLabelText(`${t("common.stuff")}:`);

    fireEvent.change(nameInput, { target: { value: "NewName" } });
    fireEvent.change(stuffInput, {
      target: { value: "https://dofusbook.net/stuff/456" },
    });

    expect(nameInput).toHaveValue("NewName");
    expect(stuffInput).toHaveValue("https://dofusbook.net/stuff/456");
  });

  it("Update class and sex", async () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Select Iop"));
    fireEvent.click(screen.getByText("Select Female"));
  });

  it("update server", async () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId("select-options-server")).toBeInTheDocument();
      expect(
        screen.getByTestId("select-options-alignment"),
      ).toBeInTheDocument();
    });

    const serverSelect = screen
      .getByTestId("select-options-server")
      .querySelector("select")!;
    const alignmentSelect = screen
      .getByTestId("select-options-alignment")
      .querySelector("select")!;

    fireEvent.change(serverSelect, { target: { value: "server-2" } });
    fireEvent.change(alignmentSelect, { target: { value: "Brâkmar" } });

    expect(serverSelect).toHaveValue("server-2");
  });

  it("Call handlesubmit", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={handleSubmit}
      />,
    );
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("Display error if breed fetch fail", async () => {
    vi.mocked(
      BreedService.BreedService.prototype.getBreeds,
    ).mockRejectedValueOnce(new Error("Breeds error"));
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        t("system.error.default"),
        t("system.error.occurred"),
      );
    });
  });

  it("Display error if server fetch fail", async () => {
    vi.mocked(
      ServerService.ServerService.prototype.getServers,
    ).mockRejectedValueOnce(new Error("Servers error"));
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget}
        handleSubmit={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        t("system.error.default"),
        t("system.error.occurred"),
      );
    });
  });
});
