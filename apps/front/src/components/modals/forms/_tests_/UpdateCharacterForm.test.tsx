import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import UpdateCharacterForm from "../UpdateCharacterForm/UpdateCharacterForm";

// --- Mocks ---
// i18n helper
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (k: string) => k,
  t: (k: string) => k,
}));

// Hooks
vi.mock("../../../../hooks/useFetchBreeds", () => ({
  __esModule: true,
  default: () => ({
    breeds: [
      { id: "b-1", name: "Iop" },
      { id: "b-2", name: "Cra" },
    ],
  }),
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

// Mock BreedRadio
vi.mock("../../formComponents/Radio/BreedRadio", () => ({
  __esModule: true,
  default: ({ breeds, onChange }: any) => (
    <div data-testid="breed-radio">
      {breeds.map((b: any) => (
        <button
          key={b.id}
          data-testid={`breed-${b.id}`}
          onClick={() => onChange(b.id)}
        >
          {b.name}
        </button>
      ))}
    </div>
  ),
}));

// Mock GenderRadio
vi.mock("../../formComponents/Radio/GenderRadio", () => ({
  __esModule: true,
  default: ({ onChange }: any) => (
    <div data-testid="gender-radio">
      <button data-testid="gender-m" onClick={() => onChange("M")}>
        M
      </button>
      <button data-testid="gender-f" onClick={() => onChange("F")}>
        F
      </button>
    </div>
  ),
}));

// Mock SelectOptions
vi.mock("../../formComponents/Options/SelectOptions", () => ({
  __esModule: true,
  default: ({ items, label, value, onChange }: any) => (
    <div data-testid={`select-${label}`}>
      {items.map((it: any) => (
        <button
          key={it.id}
          data-testid={`option-${label}-${it.id}`}
          onClick={() => onChange(it.id)}
        >
          {it.name}
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

// --- Test data ---
const updateTarget = {
  id: "char-1",
  name: "Chronos",
  level: 50,
  sex: "M",
  stuff: "Stuff de test",
  alignment: "1",
  breed: { id: "b-1", name: "Iop" },
  server: { id: "srv-1", name: "Salar" },
};

// --- Tests ---
describe("UpdateCharacterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Display all form fields with initial values", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <UpdateCharacterForm
        updateTarget={updateTarget as any}
        handleSubmit={handleSubmit}
      />,
    );

    // Title
    expect(
      screen.getByRole("heading", {
        name: t("character.modification"),
      }),
    ).toBeInTheDocument();

    // Prefilled inputs
    expect(screen.getByDisplayValue(updateTarget.name)).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(updateTarget.level.toString()),
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue(updateTarget.stuff)).toBeInTheDocument();

    // Radios & selects
    expect(screen.getByTestId("breed-radio")).toBeInTheDocument();
    expect(screen.getByTestId("gender-radio")).toBeInTheDocument();
    expect(
      screen.getByTestId(`select-${t("server.default")}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`select-${t("common.alignment")}`),
    ).toBeInTheDocument();

    // Submit button
    expect(
      screen.getByRole("button", {
        name: t("character.modification"),
      }),
    ).toBeInTheDocument();
  });

  it("Permit to update name and level", () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    const nameInput = screen.getByPlaceholderText(t("common.name"));
    const levelInput = screen.getByPlaceholderText(t("common.level"));

    fireEvent.change(nameInput, {
      target: { value: "NewName" },
    });
    fireEvent.change(levelInput, {
      target: { value: "60" },
    });

    expect(nameInput).toHaveValue("NewName");
    expect(levelInput).toHaveValue(60);
  });

  it("Permit to change breed and gender", () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId("breed-b-2"));
    fireEvent.click(screen.getByTestId("gender-f"));

    // State change is implicit; test ensures no crash
    expect(screen.getByTestId("breed-b-2")).toBeInTheDocument();
    expect(screen.getByTestId("gender-f")).toBeInTheDocument();
  });

  it("Permit to change server and alignment", () => {
    render(
      <UpdateCharacterForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId(`option-${t("server.default")}-srv-2`));
    fireEvent.click(screen.getByTestId(`option-${t("common.alignment")}-2`));

    const hiddenServer = screen.getByLabelText(`hidden-${t("server.default")}`);
    const hiddenAlignment = screen.getByLabelText(
      `hidden-${t("common.alignment")}`,
    );

    expect(hiddenServer).toHaveValue("srv-2");
    expect(hiddenAlignment).toHaveValue("2");
  });

  it("Submit form by calling handleSubmit", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <UpdateCharacterForm
        updateTarget={updateTarget as any}
        handleSubmit={handleSubmit}
      />,
    );

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
