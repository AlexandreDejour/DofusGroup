import { render, screen } from "@testing-library/react";

import type { CharacterEnriched } from "../../../../types/character";

import CharactersCheckbox from "../Checkbox/CharactersCheckbox";

const mockCharacters: CharacterEnriched[] = [
  {
    id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    name: "Chronos",
    sex: "M",
    level: 50,
    alignment: "Neutre",
    stuff: "https://d-bk.net/fr/d/1QVjw",
    default_character: false,
    server: {
      id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
      name: "Dakal",
      mono_account: true,
    },
    breed: {
      id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
      name: "Cra",
    },
    events: [],
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
    },
  },
  {
    id: "3278ef53-6176-4739-bf09-3028f716ecdf",
    name: "Grumpy",
    sex: "F",
    level: 100,
    alignment: "Neutre",
    stuff: "https://d-bk.net/fr/d/1QVjw",
    default_character: false,
    server: {
      id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
      name: "Dakal",
      mono_account: true,
    },
    breed: {
      id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
      name: "Ecaflip",
    },
    events: [],
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
    },
  },
];

describe("CharactersCheckbox", () => {
  it("should render a fieldset with legend", () => {
    render(<CharactersCheckbox characters={mockCharacters} />);
    expect(
      screen.getByRole("group", { name: /vos personnages/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vos personnages:")).toBeInTheDocument();
  });

  it("should render one label per character", () => {
    render(<CharactersCheckbox characters={mockCharacters} />);
    const labels = screen.getAllByRole("checkbox");
    expect(labels).toHaveLength(mockCharacters.length);
  });

  it("should render correct image based on sex and breed", () => {
    render(<CharactersCheckbox characters={mockCharacters} />);
    const maleImg = screen.getByAltText("Miniature de classe cra");
    expect(maleImg).toHaveAttribute("src", "/miniatures/cra_male.webp");

    const femaleImg = screen.getByAltText("Miniature de classe ecaflip");
    expect(femaleImg).toHaveAttribute("src", "/miniatures/ecaflip_female.webp");
  });

  it("should display character name, breed and level", () => {
    render(<CharactersCheckbox characters={mockCharacters} />);
    expect(screen.getByText("Chronos")).toBeInTheDocument();
    expect(screen.getByText("Cra")).toBeInTheDocument();
    expect(screen.getByText("niveau: 50")).toBeInTheDocument();

    expect(screen.getByText("Grumpy")).toBeInTheDocument();
    expect(screen.getByText("Ecaflip")).toBeInTheDocument();
    expect(screen.getByText("niveau: 100")).toBeInTheDocument();
  });

  it("checkbox should have correct value", () => {
    render(<CharactersCheckbox characters={mockCharacters} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0].getAttribute("value")).toBe(
      "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    );
    expect(checkboxes[1].getAttribute("value")).toBe(
      "3278ef53-6176-4739-bf09-3028f716ecdf",
    );
  });
});
