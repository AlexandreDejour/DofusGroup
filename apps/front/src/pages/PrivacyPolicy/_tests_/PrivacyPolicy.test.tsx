import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/i18n";

import PrivacyPolicy from "../PrivacyPolicy";

describe("PrivacyPolicy component", () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <PrivacyPolicy />
      </I18nextProvider>,
    );
  });

  it("displays main title", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Privacy Policy/i,
      }),
    ).toBeInTheDocument();
  });

  it("displays last update date", () => {
    const today = new Date().toLocaleDateString();
    expect(screen.getByText(new RegExp(today))).toBeInTheDocument();
  });

  it("renders first and last sections", () => {
    // Section 1
    expect(
      screen.getByRole("heading", { level: 3, name: /1\. Introduction/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This privacy policy explains how the community site DofusGroup works/i,
      ),
    ).toBeInTheDocument();

    // Section 10
    expect(
      screen.getByRole("heading", { level: 3, name: /10\. Policy Updates/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We reserve the right to update this privacy policy/i),
    ).toBeInTheDocument();
  });

  it("renders list items in sections", () => {
    // Section 2 li
    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByText(/password \(stored as a hash, never in plain text\)/i),
    ).toBeInTheDocument();

    // Section 6 li
    expect(screen.getByText(/secure password hashing/i)).toBeInTheDocument();
    expect(screen.getByText(/email encryption/i)).toBeInTheDocument();
  });
});
