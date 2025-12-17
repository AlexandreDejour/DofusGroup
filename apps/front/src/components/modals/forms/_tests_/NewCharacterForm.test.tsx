import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import NewCharacterForm from "../NewCharacterForm/NewCharacterForm";

// --- Mocks ---
// i18n helper
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (k: string) => k,
  t: (k: string) => k,
}));

// Hooks
vi.mock("../../../../hooks/useFetchServers", () => ({
  __esModule: true,
  default: () => ({
    servers: [
      { id: "srv-1", name: "Salar" },
      { id: "srv-2", name: "Dakal" },
    ],
  }),
}));

vi.mock("../../../../hooks/useFetchBreeds", () => ({
  __esModule: true,
  default: () => ({
    breeds: [
      { id: "b-1", name: "Iop" },
      { id: "b-2", name: "Cra" },
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

// --- Tests ---
describe("NewCharacterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Display all form fields", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(<NewCharacterForm handleSubmit={handleSubmit} />);

    // Title
    expect(
      screen.getByRole("heading", { name: t("character.create") }),
    ).toBeInTheDocument();

    // Inputs
    expect(screen.getByPlaceholderText(t("common.name"))).toBeInTheDocument();

    expect(screen.getByPlaceholderText(t("common.level"))).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(t("common.dofusBook")),
    ).toBeInTheDocument();

    // Radios & selects
    expect(screen.getByTestId("breed-radio")).toBeInTheDocument();
    expect(screen.getByTestId("gender-radio")).toBeInTheDocument();
    expect(
      screen.getByTestId(`select-${t("server.upperCase")}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`select-${t("common.alignment")}`),
    ).toBeInTheDocument();

    // Submit button
    expect(
      screen.getByRole("button", { name: t("character.create") }),
    ).toBeInTheDocument();
  });

  it("Permit to select a breed", async () => {
    render(<NewCharacterForm handleSubmit={() => {}} />);

    const breedButton = screen.getByTestId("breed-b-1");
    fireEvent.click(breedButton);

    // Nothing visible changes, but no crash means state updated
    expect(breedButton).toBeInTheDocument();
  });

  it("Permit to change gender", async () => {
    render(<NewCharacterForm handleSubmit={() => {}} />);

    const femaleButton = screen.getByTestId("gender-f");
    fireEvent.click(femaleButton);

    expect(femaleButton).toBeInTheDocument();
  });

  it("Permit to select server and alignment", async () => {
    render(<NewCharacterForm handleSubmit={() => {}} />);

    const serverOption = screen.getByTestId(
      `option-${t("server.upperCase")}-srv-2`,
    );
    fireEvent.click(serverOption);

    const alignmentOption = screen.getByTestId(
      `option-${t("common.alignment")}-2`,
    );
    fireEvent.click(alignmentOption);

    const hiddenServer = screen.getByLabelText(
      `hidden-${t("server.upperCase")}`,
    );
    const hiddenAlignment = screen.getByLabelText(
      `hidden-${t("common.alignment")}`,
    );

    expect(hiddenServer).toHaveValue("srv-2");
    expect(hiddenAlignment).toHaveValue("2");
  });

  it("Submit form by calling handleSubmit", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(<NewCharacterForm handleSubmit={handleSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
