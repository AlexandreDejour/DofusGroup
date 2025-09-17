import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import CharactersOptions from "../../FormComponents/Options/CharactersOptions";

describe("CharactersOptions", () => {
  const mockItems = [
    { id: "123", name: "Character A" },
    { id: "456", name: "Character B" },
  ];

  const mockGenerateOptions = (items: typeof mockItems) =>
    items.map((c) => ({ id: c.id, value: c.id, label: c.name }));

  it("renders the label with provided text", () => {
    render(
      <CharactersOptions
        name="characters"
        value={[]}
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Choose Characters"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Choose Characters:")).toBeInTheDocument();
  });

  it("renders all options generated from items", () => {
    render(
      <CharactersOptions
        name="characters"
        value={[]}
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Choose Characters"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Character A" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Character B" }),
    ).toBeInTheDocument();
  });

  it("marks options as selected based on the value prop", () => {
    render(
      <CharactersOptions
        name="characters"
        value={["456"]}
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Choose Characters"
        onChange={() => {}}
      />,
    );

    const optionA = screen.getByRole("option", {
      name: "Character A",
    }) as HTMLOptionElement;
    const optionB = screen.getByRole("option", {
      name: "Character B",
    }) as HTMLOptionElement;

    expect(optionA.selected).toBe(false);
    expect(optionB.selected).toBe(true);
  });

  it("calls onChange once with both values (fireEvent single change)", () => {
    const handleChange = vi.fn();

    render(
      <CharactersOptions
        name="characters"
        value={[]}
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Choose Characters"
        onChange={handleChange}
      />,
    );

    const select = screen.getByRole("listbox");
    const optionA = screen.getByRole("option", {
      name: "Character A",
    }) as HTMLOptionElement;
    const optionB = screen.getByRole("option", {
      name: "Character B",
    }) as HTMLOptionElement;

    optionA.selected = true;
    optionB.selected = true;

    // Single Event change, based on DOM actual state
    fireEvent.change(select);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(["123", "456"]);
  });

  it("renders with required and multiple attributes", () => {
    render(
      <CharactersOptions
        name="characters"
        value={[]}
        items={mockItems}
        generateOptions={mockGenerateOptions}
        label="Choose Characters"
        onChange={() => {}}
      />,
    );

    const select = screen.getByRole("listbox");
    expect(select).toHaveAttribute("required");
    expect(select).toHaveAttribute("multiple");
  });
});
