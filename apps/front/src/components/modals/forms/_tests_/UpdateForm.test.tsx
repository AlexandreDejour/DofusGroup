// UpdateForm.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { t } from "../../../../i18n/i18n-helper";
import UpdateForm from "../Forms/UpdateForm";

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock complet de useModal
const mockUseModal = {
  openModal: vi.fn(),
  handleDelete: vi.fn(),
  modalType: null as string | null,
  isOpen: true,
  updateTarget: null,
  formData: new FormData(),
  resetForm: vi.fn(),
  handleSubmit: vi.fn(),
  closeModal: vi.fn(),
};

vi.mock("../../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal,
}));

describe("UpdateForm", () => {
  let handleSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleSubmit = vi.fn((e: Event) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
    });

    // Reset modal mock between tests
    mockUseModal.modalType = null;
    vi.clearAllMocks();
  });

  const FIELD_MAP: Record<
    string,
    { label: string; type: string; modalType?: string }
  > = {
    mail: {
      label: t("auth.email.default"),
      type: "email",
      modalType: "mailToken",
    },
    password: {
      label: t("auth.password.default"),
      type: "password",
      modalType: "password",
    },
    username: {
      label: t("auth.username"),
      type: "text",
      modalType: "username",
    },
  };

  it.each(Object.entries(FIELD_MAP))(
    "Display form for field '%s'",
    (field, { label, type, modalType }) => {
      // On définit le modalType spécifique au test
      mockUseModal.modalType = modalType || null;

      render(
        <MemoryRouter>
          <UpdateForm field={field} handleSubmit={handleSubmit} />
        </MemoryRouter>,
      );

      // Vérifie le titre
      const expectedTitle =
        field === "mail" && modalType === "mailToken"
          ? `${t("common.validation")} ${label}`
          : `${t("common.change")} ${label}`;

      expect(
        screen.getByRole("heading", { level: 3, name: expectedTitle }),
      ).toBeInTheDocument();

      // Vérifie l'input principal
      const inputLabel =
        field === "mail" && modalType === "mailToken"
          ? label
          : `${t("common.new")} ${label}`;
      const input = screen.getByLabelText(inputLabel) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", type);
      expect(input).toHaveAttribute("name", field);
      expect(input).toHaveAttribute("id", field);
      expect(input).toBeRequired();

      // Vérifie le bouton de submit
      const submitButton = screen.getByRole("button", { name: "Update" });
      expect(submitButton).toBeInTheDocument();

      // Vérifie les inputs supplémentaires pour le mot de passe
      if (field === "password") {
        const confirmInput = screen.getByLabelText(
          new RegExp(`${t("common.confirm")} ${label}`, "i"),
        ) as HTMLInputElement;
        expect(confirmInput).toBeInTheDocument();
        expect(confirmInput).toHaveAttribute("type", "password");
        expect(confirmInput).toHaveAttribute("name", "confirmPassword");

        const oldInput = screen.getByLabelText(
          new RegExp(`${t("common.old")} ${label}`, "i"),
        ) as HTMLInputElement;
        expect(oldInput).toBeInTheDocument();
        expect(oldInput).toHaveAttribute("type", "password");
        expect(oldInput).toHaveAttribute("name", "oldPassword");
      }
    },
  );

  it("Call handleSubmit on form submit", () => {
    mockUseModal.modalType = "username";

    render(<UpdateForm field="username" handleSubmit={handleSubmit} />);

    const input = screen.getByLabelText(
      `${t("common.new")} ${t("auth.username")}`,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "newUsername" } });
    expect(input.value).toBe("newUsername");

    const submitButton = screen.getByRole("button", { name: "Update" });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("fallback : unknown field returns input type text", () => {
    mockUseModal.modalType = "unknown";

    render(<UpdateForm field="inconnu" handleSubmit={handleSubmit} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(t("common.change"));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "inconnu");
  });
});
