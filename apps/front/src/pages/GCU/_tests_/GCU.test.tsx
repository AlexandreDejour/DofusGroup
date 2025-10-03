import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/i18n";

import GCU from "../GCU";

describe("GCU component", () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <GCU />
      </I18nextProvider>,
    );
  });

  it("displays main title", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Terms of Use of DofusGroup/i,
      }),
    ).toBeInTheDocument();
  });

  it("displays last update date", () => {
    const today = new Date().toLocaleDateString();
    expect(screen.getByText(new RegExp(today))).toBeInTheDocument();
  });

  it("renders first sections", () => {
    expect(
      screen.getByRole("heading", { level: 3, name: /1\. Presentation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /2\. Acceptance of Terms/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders subsections for section 4", () => {
    // sub-section 4.1
    expect(
      screen.getByRole("heading", {
        level: 4,
        name: /4\.1 Registration Conditions/i,
      }),
    ).toBeInTheDocument();

    // Check one list item
    expect(
      screen.getByText(/To create an account, you must be of legal age/i),
    ).toBeInTheDocument();
  });

  it("renders some content for later sections", () => {
    expect(
      screen.getByRole("heading", { level: 3, name: /5\. Rules of Conduct/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Respect other users and DofusGroup staff/i),
    ).toBeInTheDocument();
  });
});
