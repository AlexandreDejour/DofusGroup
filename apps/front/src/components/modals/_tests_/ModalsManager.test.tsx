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

// Mock context before component import
let mockUseModal: () => any = () => ({
  isOpen: true,
  modalType: "register",
  error: null,
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

function renderModalsManager() {
  return render(
    <ModalProvider>
      <ModalsManager />
    </ModalProvider>,
  );
}

describe("ModalsManager", () => {
  let closeModal: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Default mock setup
    closeModal = vi.fn();
    mockUseModal = () => ({
      isOpen: true,
      modalType: "register",
      error: null,
      handleSubmit: vi.fn(),
      closeModal,
      openModal: vi.fn(),
    });
  });

  it("Display RegisterForm When modalType is 'register'", () => {
    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it("Display close button", () => {
    renderModalsManager();
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it("Close modal when you click on the background", () => {
    renderModalsManager();
    fireEvent.click(screen.getByRole("dialog"));
    expect(closeModal).toHaveBeenCalled();
  });

  it("Display nothing if isOpen is false", () => {
    // overload mock for this specific test
    mockUseModal = () => ({
      isOpen: false,
      modalType: "register",
      error: null,
      handleSubmit: vi.fn(),
      closeModal: vi.fn(),
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });
});
