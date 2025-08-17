import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock context before import component
let mockUseModal: () => any = () => ({
  openModal: vi.fn(),
});

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal(),
}));

import Header from "../Header";

describe("Header", () => {
  let openModal: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openModal = vi.fn();
    mockUseModal = () => ({ openModal });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
  });

  it("Display logo", () => {
    expect(
      screen.getByRole("heading", { name: "DofusGroup" }),
    ).toBeInTheDocument();
  });

  it("Display navigation links", () => {
    expect(screen.getByRole("link", { name: "Évènements" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "À propos" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("Display buttons <<Connexion>> et <<Inscription>>", () => {
    expect(
      screen.getByRole("button", { name: "Connexion" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Inscription" }),
    ).toBeInTheDocument();
  });

  it("Call openModal with 'login' on click on <<Connexion>>", () => {
    fireEvent.click(screen.getByRole("button", { name: "Connexion" }));
    expect(openModal).toHaveBeenCalledWith("login");
  });

  it("Call openModal with 'register' on click on <<Inscription>>", () => {
    fireEvent.click(screen.getByRole("button", { name: "Inscription" }));
    expect(openModal).toHaveBeenCalledWith("register");
  });
});
