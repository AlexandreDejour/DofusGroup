import { vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { MemoryRouter } from "react-router";
import { t } from "../../../i18n/i18n-helper";

import { useScreen } from "../../../contexts/screenContext";

import EventCard from "../EventCard";

// Mock context
vi.mock("../../../contexts/screenContext", () => ({
  useScreen: vi.fn(),
}));

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

const mockEvent = {
  id: "e804f5c2-09af-4aac-ab05-8dc7743fcc2d",
  title: "Event Test",
  date: new Date("2025-08-17T12:00:00Z"),
  duration: 120,
  area: "Amakna",
  sub_area: "Coin des  bouftou",
  max_players: 8,
  status: "private",
  tag: {
    id: "1d42a1f1-d747-4034-8f59-2f420e384d11",
    name: "PVM",
    color: "#ff0000",
  },
  server: {
    id: "0508669a-d352-4145-89b4-87b481d44938",
    name: "Jiva",
    mono_account: true,
  },
  characters: [
    {
      id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
      name: "Night-Hunter",
      sex: "M",
      level: 190,
      alignment: "Bonta",
      stuff: "https://d-bk.net/fr/d/1EFhw",
      default_character: true,
      server_id: "0508669a-d352-4145-89b4-87b481d44938",
    },
  ],
};

const renderEventCard = (event = mockEvent) =>
  render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>,
  );

describe("EventCard", () => {
  beforeEach(() => {
    vi.mocked(useScreen).mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
    mockNavigate.mockReset();
    vi.spyOn(Date.prototype, "toLocaleString").mockReturnValue(
      "17/08/2025 12:00",
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Display event title", () => {
    renderEventCard();
    expect(screen.getByText("Event Test")).toBeInTheDocument();
  });

  it("Display tag title with his color", () => {
    renderEventCard();
    const tagElement = screen.getByText("PVM");
    expect(tagElement).toBeInTheDocument();
    expect(tagElement).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("Display server", () => {
    renderEventCard();
    expect(screen.getByText("Jiva")).toBeInTheDocument();
  });

  it("Display date", () => {
    renderEventCard();
    expect(screen.getByText("17/08/2025 12:00")).toBeInTheDocument();
    expect(Date.prototype.toLocaleString).toHaveBeenCalled();
  });

  it("Display Duration", () => {
    renderEventCard();
    expect(screen.getByText("120 min")).toBeInTheDocument();
  });

  it("Display current players", () => {
    renderEventCard();
    expect(screen.getByText("1/8")).toBeInTheDocument();
  });

  it("Navigate to details on button click", () => {
    renderEventCard();
    const button = screen.getByRole("button", { name: t("common.details") });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/event/e804f5c2-09af-4aac-ab05-8dc7743fcc2d",
    );
  });
});
