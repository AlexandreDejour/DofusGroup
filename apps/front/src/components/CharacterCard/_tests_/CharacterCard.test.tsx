import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router";

import CharacterCard from "../CharacterCard";

// Mock useNavigate de react-router
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useNavigate: () => mockNavigate,
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCharacter = {
  id: "9f448a1a-79a6-4850-9489-f532745cfc14",
  name: "Peloty",
  sex: "F",
  level: 50,
  alignment: "Bonta",
  stuff: "https://d-bk.net/fr/d/1QVjw",
  default_character: true,
  user_id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
  server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
  breed_id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
  createdAt: "2025-07-27T18:24:12.207Z",
  updatedAt: "2025-07-27T18:24:12.207Z",
  server: {
    id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
    name: "Dakal",
    mono_account: true,
    createdAt: "2025-07-27T12:39:28.731Z",
    updatedAt: "2025-07-27T12:39:28.731Z",
  },
  breed: {
    id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
    name: "Cra",
    createdAt: "2025-07-27T12:39:28.731Z",
    updatedAt: "2025-07-27T12:39:28.731Z",
  },
  events: [],
  user: {
    id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
    username: "toto",
    createdAt: "2025-07-27T17:40:34.489Z",
    updatedAt: "2025-07-27T17:40:34.489Z",
  },
};

const handleDelete = vi.fn();

const renderCharacterCard = (character = mockCharacter) =>
  render(
    <MemoryRouter>
      <CharacterCard character={character} handleDelete={handleDelete} />
    </MemoryRouter>,
  );

describe("CharacterCard", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    handleDelete.mockReset();
  });

  it("Dispay image with male character ", () => {
    const maleCharacter = { ...mockCharacter, sex: "M" };
    renderCharacterCard(maleCharacter);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/miniatures/cra_male.webp");
    expect(img).toHaveAttribute("alt", "Miniature de classe cra");
  });

  it("Display image with female character", () => {
    const femaleCharacter = { ...mockCharacter, sex: "F" };
    renderCharacterCard(femaleCharacter);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/miniatures/cra_female.webp");
    expect(img).toHaveAttribute("alt", "Miniature de classe cra");
  });

  it("Display character name", () => {
    renderCharacterCard();
    expect(screen.getByText("Peloty")).toBeInTheDocument();
  });

  it("Display character breed", () => {
    renderCharacterCard();
    expect(screen.getByText("Cra")).toBeInTheDocument();
  });

  it("Display character level", () => {
    renderCharacterCard();
    expect(screen.getByText("niveau: 50")).toBeInTheDocument();
  });
});
