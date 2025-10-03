import { vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { t } from "../../../i18n/i18n-helper";

import { useScreen } from "../../../contexts/screenContext";

import Header from "../Header";

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

// Mock context
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

vi.mock("../../../contexts/screenContext", () => ({
  useScreen: vi.fn(),
}));

describe("Header", () => {
  let openModal: ReturnType<typeof vi.fn>;
  let logout: ReturnType<typeof vi.fn>;

  describe("When user isn't login", () => {
    beforeEach(() => {
      openModal = vi.fn();
      logout = vi.fn();
      mockUseModal = () => ({ openModal });
      mockUseAuth = () => ({ user: null, logout });
      vi.mocked(useScreen).mockReturnValue({
        isDesktop: true,
        isTablet: false,
        isMobile: false,
      });

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
      expect(
        screen.getByRole("link", { name: t("event.list") }),
      ).toHaveAttribute("href", "/");
      expect(
        screen.getByRole("link", { name: t("common.about") }),
      ).toHaveAttribute("href", "/about");
    });

    it("Display buttons Login and Register", () => {
      expect(
        screen.getByRole("button", { name: t("auth.login") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("auth.register") }),
      ).toBeInTheDocument();
    });

    it("Call openModal with 'login' on click on Login", () => {
      fireEvent.click(screen.getByRole("button", { name: t("auth.login") }));
      expect(openModal).toHaveBeenCalledWith("login");
    });

    it("Call openModal with 'register' on click on Register", () => {
      fireEvent.click(screen.getByRole("button", { name: t("auth.register") }));
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
      expect(
        screen.getByRole("link", { name: t("event.list") }),
      ).toHaveAttribute("href", "/");
      expect(
        screen.getByRole("link", { name: t("common.about") }),
      ).toHaveAttribute("href", "/about");
      expect(
        screen.getByRole("link", { name: t("common.profile") }),
      ).toHaveAttribute("href", "/profile");
    });

    it("Display button Logout", () => {
      expect(
        screen.getByRole("button", { name: t("auth.logout") }),
      ).toBeInTheDocument();
    });

    it("Call logout on click on Logout", () => {
      fireEvent.click(screen.getByRole("button", { name: t("auth.logout") }));
      expect(logout).toHaveBeenCalled();
    });

    it("Not Display buttons Login and Register", () => {
      expect(
        screen.queryByRole("button", { name: t("auth.login") }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: t("auth.register") }),
      ).not.toBeInTheDocument();
    });
  });
});
