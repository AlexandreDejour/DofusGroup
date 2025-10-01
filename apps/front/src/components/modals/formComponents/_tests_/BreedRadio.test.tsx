import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import BreedRadio from "../Radio/BreedRadio";

describe("BreedRadio", () => {
  const mockBreeds = [
    { id: "123", name: "Cra" },
    { id: "456", name: "Iop" },
  ];

  it("renders the legend correctly", () => {
    render(
      <BreedRadio
        name="character"
        value=""
        sex="M"
        breeds={mockBreeds}
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByText(new RegExp(t("breed.upperCase"), "i")),
    ).toBeInTheDocument();
  });

  it("renders all breeds with correct labels and images", () => {
    render(
      <BreedRadio
        name="character"
        value=""
        sex="M"
        breeds={mockBreeds}
        onChange={() => {}}
      />,
    );

    // Verify img with alt attribut
    const craImg = screen.getByAltText("Miniature de Cra");
    const iopImg = screen.getByAltText("Miniature de Iop");

    expect(craImg).toHaveAttribute("src", "/miniatures/cra_male.webp");
    expect(iopImg).toHaveAttribute("src", "/miniatures/iop_male.webp");
  });

  it("marks the correct radio as checked based on value prop", () => {
    render(
      <BreedRadio
        name="character"
        value="456"
        sex="M"
        breeds={mockBreeds}
        onChange={() => {}}
      />,
    );

    // Handle inputs with getByLabelText
    const craInput = screen.getByLabelText("Cra", {
      selector: "input",
    }) as HTMLInputElement;
    const iopInput = screen.getByLabelText("Iop", {
      selector: "input",
    }) as HTMLInputElement;

    expect(craInput.checked).toBe(false);
    expect(iopInput.checked).toBe(true);
  });

  it("calls onChange with the selected breed when an image is clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BreedRadio
        name="character"
        value=""
        sex="F"
        breeds={mockBreeds}
        onChange={handleChange}
      />,
    );

    const craImg = screen.getByAltText("Miniature de Cra");
    await user.click(craImg);

    expect(handleChange).toHaveBeenCalledWith("123");
  });

  it("renders images with correct src for female sex", () => {
    render(
      <BreedRadio
        name="character"
        value=""
        sex="F"
        breeds={[{ id: "sram", name: "Sram" }]}
        onChange={() => {}}
      />,
    );

    const sramImg = screen.getByAltText("Miniature de Sram");
    expect(sramImg).toHaveAttribute("src", "/miniatures/sram_female.webp");
  });
});
