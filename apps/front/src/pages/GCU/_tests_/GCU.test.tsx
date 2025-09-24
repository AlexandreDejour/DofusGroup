import { render, screen } from "@testing-library/react";

import GCU from "../GCU";

describe("GCU component", () => {
  it("Display main title", () => {
    render(<GCU />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Conditions Générales d’Utilisation de DofusGroup/i,
      }),
    ).toBeInTheDocument();
  });

  it("Display date", () => {
    const today = new Date().toLocaleDateString();
    render(<GCU />);
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it("Contain presentation section", () => {
    render(<GCU />);
    expect(
      screen.getByRole("heading", { level: 3, name: /1\. Présentation/i }),
    ).toBeInTheDocument();
  });

  it("Contain acceptation section", () => {
    render(<GCU />);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /2\. Acceptation des CGU/i,
      }),
    ).toBeInTheDocument();
  });
});
