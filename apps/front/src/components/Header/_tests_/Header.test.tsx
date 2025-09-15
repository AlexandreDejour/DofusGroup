import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock context before import component
let mockUseModal: () => any = () => ({
  openModal: vi.fn(),
});
let mockUseAuth: () => any = () => ({
  user: null,
  logout: vi.fn(),
});

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal(),
}));

vi.mock("../../../contexts/authContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockUseAuth(),
}));

import Header from "../Header";

describe("Header", () => {
  let openModal: ReturnType<typeof vi.fn>;
  let logout: ReturnType<typeof vi.fn>;

  describe("When user isn't login", () => {
    beforeEach(() => {
      openModal = vi.fn();
      logout = vi.fn();
      mockUseModal = () => ({ openModal });
      mockUseAuth = () => ({ user: null, logout });

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

    it("Display public navigation links", () => {
      expect(screen.getByRole("link", { name: "Évènements" })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByRole("link", { name: "À propos" })).toHaveAttribute(
        "href",
        "/about",
      );
    });

    it("Display buttons <<Connexion>> and <<Inscription>>", () => {
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

  describe("When user is login", () => {
    beforeEach(() => {
      openModal = vi.fn();
      logout = vi.fn();
      mockUseModal = () => ({ openModal });
      mockUseAuth = () => ({
        user: {
          id: "c5c83992-52c4-42d4-b292-148c78cc76be",
          username: "TestUser",
          mail: "test@mail.com",
        },
        logout,
      });

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );
    });

    it("Display private navigation links", () => {
      expect(screen.getByRole("link", { name: "Évènements" })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByRole("link", { name: "À propos" })).toHaveAttribute(
        "href",
        "/about",
      );
      expect(screen.getByRole("link", { name: "Profil" })).toHaveAttribute(
        "href",
        "/profile",
      );
    });

    it("Display button <<Déconnexion>>", () => {
      expect(
        screen.getByRole("button", { name: "Déconnexion" }),
      ).toBeInTheDocument();
    });

    it("Call logout on click on <<Déconnexion>>", () => {
      fireEvent.click(screen.getByRole("button", { name: "Déconnexion" }));
      expect(logout).toHaveBeenCalled();
    });

    it("Not Display buttons <<Connexion>> and <<Inscription>>", () => {
      expect(
        screen.queryByRole("button", { name: "Connexion" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Inscription" }),
      ).not.toBeInTheDocument();
    });
  });
});
