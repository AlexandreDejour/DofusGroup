import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

let mockUseAuth: () => any = () => ({
  user: null,
});

vi.mock("../../../contexts/authContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockUseAuth(),
}));

import Footer from "../Footer";

describe("Footer", () => {
  describe("When user is not login", () => {
    beforeEach(() => {
      mockUseAuth = () => ({ user: null });

      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>,
      );
    });

    it("Display main sections", () => {
      expect(
        screen.getByRole("heading", { name: "DofusGroup" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Autres liens" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Sites utiles" }),
      ).toBeInTheDocument();
    });

    it("Display internal links", () => {
      expect(screen.getByRole("link", { name: "Évènements" })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByRole("link", { name: "À propos" })).toHaveAttribute(
        "href",
        "/about",
      );
      expect(
        screen.getByRole("link", {
          name: "Conditions générales d'utilisation",
        }),
      ).toHaveAttribute("href", "/gcu");
      expect(
        screen.getByRole("link", { name: "Politique de confidentialité" }),
      ).toHaveAttribute("href", "/confidentiality");
    });

    it("Display contact links", () => {
      expect(
        screen.getByRole("link", { name: "Nous contacter" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Signaler un bug" }),
      ).toBeInTheDocument();
    });

    it("Display external links with target _blank", () => {
      const externalLinks = [
        { name: "Dofus", href: "https://www.dofus.com/fr" },
        { name: "DofusBook", href: "https://www.dofusbook.net/fr/" },
        { name: "DofusDB", href: "https://dofusdb.fr/fr/" },
        {
          name: "Dofus pour les noobs",
          href: "https://www.dofuspourlesnoobs.com/",
        },
      ];

      externalLinks.forEach(({ name, href }) => {
        const link = screen.getByRole("link", { name });
        expect(link).toHaveAttribute("href", href);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
      });
    });
  });

  describe("When user is login", () => {
    beforeEach(() => {
      mockUseAuth = () => ({
        user: {
          id: "c5c83992-52c4-42d4-b292-148c78cc76be",
          username: "TestUser",
          mail: "test@mail.com",
        },
      });

      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>,
      );
    });

    it("Display private navigation links", () => {
      expect(screen.getByRole("link", { name: "Profil" })).toHaveAttribute(
        "href",
        "/profile",
      );
    });
  });
});
