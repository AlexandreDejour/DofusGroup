import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalProvider from "../../../contexts/modalContext";

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock before component import
let mockUseModal: () => any = () => ({
  isOpen: true,
  modalType: "register",
  handleSubmit: vi.fn(),
  closeModal: vi.fn(),
  openModal: vi.fn(),
});

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal(),
}));

import ModalsManager from "../ModalsManager";

const FIELD_LABELS: Record<string, string> = {
  mail: "email",
  password: "mot de passe",
  username: "pseudo",
};

function renderModalsManager() {
  return render(
    <ModalProvider>
      <ModalsManager />
    </ModalProvider>,
  );
}

describe("ModalsManager", () => {
  let closeModal: ReturnType<typeof vi.fn>;
  let handleSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    closeModal = vi.fn();
    handleSubmit = vi.fn();

    // Default mock : register form
    mockUseModal = () => ({
      isOpen: true,
      modalType: "register",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });
  });

  it("Display RegisterForm when modalType is 'register'", () => {
    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it("Display LoginForm when modalType is 'login'", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "login",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
  });

  it.each(Object.entries(FIELD_LABELS))(
    "Display UpdateForm when modalType is '%s'",
    (field, expectedLabel) => {
      mockUseModal = () => ({
        isOpen: true,
        modalType: field,
        handleSubmit,
        closeModal,
        openModal: vi.fn(),
      });

      const { container } = renderModalsManager();

      expect(
        screen.getByRole("heading", {
          level: 3,
          name: new RegExp(`Modifier\\s+${expectedLabel}`, "i"),
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByLabelText(new RegExp(expectedLabel, "i")),
      ).toBeInTheDocument();

      const form = container.querySelector("form");
      expect(form).not.toBeNull();

      if (form) {
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
      }
    },
  );

  it("Display close button", () => {
    renderModalsManager();
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it("Close modal when user click on background", () => {
    renderModalsManager();
    fireEvent.click(screen.getByRole("dialog"));
    expect(closeModal).toHaveBeenCalled();
  });

  it("Don't close modal when user click on content", () => {
    renderModalsManager();
    fireEvent.click(screen.getByText(/Inscription/i));
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("Display nothing if isOpen is false", () => {
    mockUseModal = () => ({
      isOpen: false,
      modalType: "register",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });

  it("Display nothing if modalType is null", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: null,
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });
});
