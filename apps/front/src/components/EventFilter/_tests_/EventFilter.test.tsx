import { vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { useScreen } from "../../../contexts/screenContext";

import EventFilter from "../EventFilter";

// Mock context
vi.mock("../../../contexts/screenContext", () => ({
  useScreen: vi.fn(),
}));

const mockTags = [
  { id: "e70d01fa-6074-44cc-b804-a430f4162eb5", name: "PvP", color: "#ffff" },
];
const mockServers = [
  {
    id: "b8c145a0-c68a-4adb-a33b-ae6f0ec89ee1",
    name: "Hel Munster",
    mono_account: false,
  },
];

describe("EventFilter component", () => {
  let setTag: ReturnType<typeof vi.fn>;
  let setTitle: ReturnType<typeof vi.fn>;
  let setServer: ReturnType<typeof vi.fn>;
  let handleSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.mocked(useScreen).mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
    setTag = vi.fn();
    setTitle = vi.fn();
    setServer = vi.fn();
    handleSearch = vi.fn().mockResolvedValue(undefined);

    render(
      <EventFilter
        tags={mockTags}
        servers={mockServers}
        tag=""
        title=""
        server=""
        setTag={setTag}
        setTitle={setTitle}
        setServer={setServer}
        handleSearch={handleSearch}
      />,
    );
  });

  it("renders all input fields and button", () => {
    expect(screen.getByLabelText(/Titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Serveur/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Rechercher/i }),
    ).toBeInTheDocument();
  });

  it("calls setTitle when title input changes", () => {
    const input = screen.getByLabelText(/Titre/i);
    fireEvent.change(input, { target: { value: "Test Event" } });
    expect(setTitle).toHaveBeenCalledWith("Test Event");
  });

  it("calls setTag when tag select changes", () => {
    const select = screen.getByLabelText(/Tag/i);
    fireEvent.change(select, {
      target: { value: "e70d01fa-6074-44cc-b804-a430f4162eb5" },
    });
    expect(setTag).toHaveBeenCalledWith("e70d01fa-6074-44cc-b804-a430f4162eb5");
  });

  it("calls setServer when server select changes", () => {
    const select = screen.getByLabelText(/Serveur/i);
    fireEvent.change(select, {
      target: { value: "b8c145a0-c68a-4adb-a33b-ae6f0ec89ee1" },
    });
    expect(setServer).toHaveBeenCalledWith(
      "b8c145a0-c68a-4adb-a33b-ae6f0ec89ee1",
    );
  });

  it("calls handleSearch on form submit", async () => {
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(handleSearch).toHaveBeenCalled();
  });
});
