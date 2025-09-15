import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import SelectOptions from "../FormComponents/Options/SelectOptions";

describe("SelectOptions", () => {
  const mockItems = [
    { id: "1", name: "Option A" },
    { id: "2", name: "Option B" },
  ];

  const mockGenerateOptions = (items: typeof mockItems) =>
    items.map((o) => ({ id: o.id, value: o.id, label: o.name }));

  it("renders the label correctly", () => {
    render(
      <SelectOptions
        name="test"
        value=""
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Category"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Category:")).toBeInTheDocument();
  });

  it("renders a custom placeholder when provided", () => {
    render(
      <SelectOptions
        name="test"
        value=""
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Category"
        placeholder="Choisissez une catégorie"
        onChange={() => {}}
      />,
    );

    const placeholder = screen.getByRole("option", {
      name: "Choisissez une catégorie",
    });
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it("renders a default placeholder when none is provided", () => {
    render(
      <SelectOptions
        name="test"
        value=""
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Category"
        onChange={() => {}}
      />,
    );

    const placeholder = screen.getByRole("option", {
      name: "Sélectionnez category",
    });
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it("renders all generated options", () => {
    render(
      <SelectOptions
        name="test"
        value=""
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Category"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Option A" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option B" }),
    ).toBeInTheDocument();
  });

  it("marks the correct option as selected based on value prop", () => {
    render(
      <SelectOptions
        name="test"
        value="2"
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Category"
        onChange={() => {}}
      />,
    );

    const optionA = screen.getByRole("option", {
      name: "Option A",
    }) as HTMLOptionElement;
    const optionB = screen.getByRole("option", {
      name: "Option B",
    }) as HTMLOptionElement;

    expect(optionA.selected).toBe(false);
    expect(optionB.selected).toBe(true);
  });

  it("calls onChange with the new value when a different option is selected", () => {
    const handleChange = vi.fn();

    render(
      <SelectOptions
        name="test"
        value=""
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Category"
        onChange={handleChange}
      />,
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });

    expect(handleChange).toHaveBeenCalledWith("2");
  });
});
