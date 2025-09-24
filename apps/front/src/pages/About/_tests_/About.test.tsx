import { render, screen } from "@testing-library/react";

import About from "../About";

describe("About component", () => {
  it("Display main title", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /À propos de DofusGroup/i,
      }),
    ).toBeInTheDocument();
  });

  it("Contain presentation section", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /1\. Une plateforme pour mieux s’organiser/i,
      }),
    ).toBeInTheDocument();
  });

  it("Contain acceptation section", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /5\. En résumé/i,
      }),
    ).toBeInTheDocument();
  });
});
