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

// Mock context before import component
let mockUseModal: () => any = () => ({
  isOpen: true,
  modalType: "register",
  error: null,
  handleSubmit: vi.fn(),
  closeModal: vi.fn(),
});

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal(),
}));

import ModalsManager from "../ModalsManager";

describe("ModalsManager", () => {
  it("Display RegisterForm When modalType is 'register'", () => {
    render(
      <ModalProvider>
        <ModalsManager />
      </ModalProvider>,
    );
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it("Display close button", () => {
    render(
      <ModalProvider>
        <ModalsManager />
      </ModalProvider>,
    );
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it("Close modal when you click on the background", () => {
    const closeModal = vi.fn();
    mockUseModal = () => ({
      isOpen: true,
      modalType: "register",
      error: null,
      handleSubmit: vi.fn(),
      closeModal,
    });
    render(
      <ModalProvider>
        <ModalsManager />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(closeModal).toHaveBeenCalled();
  });

  it("Display nothing if isOpen is false", () => {
    mockUseModal = () => ({
      isOpen: false,
      modalType: "register",
      error: null,
      handleSubmit: vi.fn(),
      closeModal: vi.fn(),
    });
    const { container } = render(<ModalsManager />);
    expect(container.firstChild).toBeNull();
  });
});
