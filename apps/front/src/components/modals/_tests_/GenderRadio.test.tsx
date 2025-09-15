import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import GenderRadio from "../FormComponents/Radio/GenderRadio";

describe("GenderRadio", () => {
  it("renders the legend correctly", () => {
    render(<GenderRadio name="gender" value="" onChange={() => {}} />);
    expect(screen.getByText("Sexe:")).toBeInTheDocument();
  });

  it("renders both gender options with icons", () => {
    render(<GenderRadio name="gender" value="" onChange={() => {}} />);

    // Labels are hidden but can verifie icons by className
    expect(
      document.querySelector(".gender_choices_label_icon.mars"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".gender_choices_label_icon.venus"),
    ).toBeInTheDocument();
  });

  it("marks the correct radio as checked based on value prop", () => {
    render(<GenderRadio name="gender" value="F" onChange={() => {}} />);

    const maleInput = screen.getByLabelText("Mâle", {
      selector: "input",
    }) as HTMLInputElement;
    const femaleInput = screen.getByLabelText("Femelle", {
      selector: "input",
    }) as HTMLInputElement;

    expect(maleInput.checked).toBe(false);
    expect(femaleInput.checked).toBe(true);
  });

  it("calls onChange with the correct value when an icon is clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<GenderRadio name="gender" value="" onChange={handleChange} />);

    // Click on male icon
    const maleIcon = document.querySelector(".gender_choices_label_icon.mars")!;
    await user.click(maleIcon);

    expect(handleChange).toHaveBeenCalledWith("M");

    // Click on female icon
    const femaleIcon = document.querySelector(
      ".gender_choices_label_icon.venus",
    )!;
    await user.click(femaleIcon);

    expect(handleChange).toHaveBeenCalledWith("F");
  });

  it("renders the correct labels for accessibility", () => {
    render(<GenderRadio name="gender" value="" onChange={() => {}} />);

    const maleLabel = screen.getByLabelText("Mâle", { selector: "input" });
    const femaleLabel = screen.getByLabelText("Femelle", { selector: "input" });

    expect(maleLabel).toBeInTheDocument();
    expect(femaleLabel).toBeInTheDocument();
  });
});
