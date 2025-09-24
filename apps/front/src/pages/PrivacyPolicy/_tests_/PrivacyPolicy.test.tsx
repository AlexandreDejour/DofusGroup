import { render, screen } from "@testing-library/react";

import PrivacyPolicy from "../PrivacyPolicy";

describe("PrivacyPolicy component", () => {
  it("Display main title", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Politique de confidentialité/i,
      }),
    ).toBeInTheDocument();
  });

  it("Display date", () => {
    const today = new Date().toLocaleDateString();
    render(<PrivacyPolicy />);
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it("Contain introduction section", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole("heading", { level: 3, name: /1\. Introduction/i }),
    ).toBeInTheDocument();
  });

  it("Contain policy modifications section", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /10\. Modifications de la politique/i,
      }),
    ).toBeInTheDocument();
  });
});
