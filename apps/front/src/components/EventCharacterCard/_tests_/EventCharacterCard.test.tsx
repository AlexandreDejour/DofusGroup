import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router";

import EventCharacterCard from "../EventCharacterCard";
import { EventEnriched } from "../../../types/event";
import { CharacterEnriched } from "../../../types/character";

// Mock config
vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
vi.mock("../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: { id: "bfba9e1b-266a-4c4d-ba3c-21229300d8ba", username: "toto" },
  }),
}));

// Mock useModal
const openModal = vi.fn();
const handleDelete = vi.fn();
vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => ({
    openModal,
    handleDelete,
  }),
}));

// Mock useNotification
const showError = vi.fn();
vi.mock("../../../contexts/notificationContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showError,
  }),
}));

const mockRemoveCharacter = vi.fn();

const mockEvent: EventEnriched = {
  id: "dabcc767-1902-4e47-be77-d486c7b3af39",
  title: "Event Test",
  date: new Date("2025-08-17T12:00:00Z"),
  duration: 120,
  area: "Amakna",
  sub_area: "Coin des bouftou",
  max_players: 8,
  status: "public",
  tag: {
    id: "46046ca8-39a4-451a-b33e-35ecfe3ec993",
    name: "PVM",
    color: "#ff0000",
  },
  server: {
    id: "baad4320-c34c-440b-aab1-205564893e9e",
    name: "Jiva",
    mono_account: true,
  },
  user: { id: "bfba9e1b-266a-4c4d-ba3c-21229300d8ba", username: "toto" }, // créateur de l'event
  characters: [],
  comments: [],
};

const mockCharacter: CharacterEnriched = {
  id: "95a333b9-0228-47a7-abfb-e002d61fddde",
  name: "Night-Hunter",
  sex: "M",
  level: 190,
  alignment: "Bonta",
  stuff: "https://d-bk.net/fr/d/1EFhw",
  default_character: true,
  breed: { id: "313ba421-abb0-4beb-b4ed-4e2e5a3a72c2", name: "Iop" },
  server: {
    id: "dabcc767-1902-4e47-be77-d486c7b3af39",
    name: "Rafal",
    mono_account: true,
  },
  user: { id: "bfba9e1b-266a-4c4d-ba3c-21229300d8ba", username: "toto" },
};

const renderComponent = (event = mockEvent, character = mockCharacter) =>
  render(
    <MemoryRouter>
      <EventCharacterCard
        event={event}
        character={character}
        removeCharacter={mockRemoveCharacter}
      />
    </MemoryRouter>,
  );

describe("EventCharacterCard", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockRemoveCharacter.mockReset();
  });

  it("Display character's name and breed", () => {
    renderComponent();
    expect(screen.getByText("Night-Hunter")).toBeInTheDocument();
    expect(screen.getByText("Iop")).toBeInTheDocument();
    expect(screen.getByText("niveau: 190")).toBeInTheDocument();
  });

  it("Display male image if character is male", () => {
    renderComponent();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/miniatures/iop_male.webp");
  });

  it("Display female image if character is female", () => {
    renderComponent(mockEvent, { ...mockCharacter, sex: "F" });
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/miniatures/iop_female.webp");
  });

  it("Display details and delete buttons if user is event author", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /détails/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete event night-hunter/i }),
    ).toBeInTheDocument();
  });

  it("Not display details and delete buttons if user isn't link to event or characters", () => {
    const event = { ...mockEvent, user: { id: "other-user", username: "x" } };
    const character = {
      ...mockCharacter,
      user: { id: "other-user", username: "x" },
    };

    renderComponent(event, character);

    expect(
      screen.getByRole("button", { name: /détails/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it("Navigate to character page on click to details", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /détails/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/character/95a333b9-0228-47a7-abfb-e002d61fddde",
    );
  });

  it("Call removeCharacter when click on delete", () => {
    renderComponent();
    const button = screen.getByRole("button", {
      name: /delete event night-hunter/i,
    });
    fireEvent.click(button);
    expect(mockRemoveCharacter).toHaveBeenCalledWith(
      "dabcc767-1902-4e47-be77-d486c7b3af39",
      "95a333b9-0228-47a7-abfb-e002d61fddde",
    );
  });
});
