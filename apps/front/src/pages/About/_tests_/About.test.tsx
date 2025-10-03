import { render, screen } from "@testing-library/react";

import i18n from "../../../i18n/i18n";
import { I18nextProvider } from "react-i18next";

import About from "../About";

describe("About component", () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <About />
      </I18nextProvider>,
    );
  });

  it("Displays main title and lead", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /About DofusGroup/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/DofusGroup is a community platform/i),
    ).toBeInTheDocument();
  });

  it("Displays all section titles", () => {
    const sectionTitles = [
      /1\. A platform to organize better/i,
      /2\. Why DofusGroup?\?/i,
      /3\. Target audience/i,
      /4\. Who am I\?/i,
      /5\. In summary/i,
    ];

    sectionTitles.forEach((titleRegex) => {
      expect(
        screen.getByRole("heading", { level: 3, name: titleRegex }),
      ).toBeInTheDocument();
    });
  });

  it("Renders paragraphs and list items in sections", () => {
    // First section's paragraph
    expect(
      screen.getByText(/The application allows users,/i),
    ).toBeInTheDocument();

    // Third section's element
    expect(
      screen.getByText(/Single-account players dependent on other players/i),
    ).toBeInTheDocument();
  });
});
