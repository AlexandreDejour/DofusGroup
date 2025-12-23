import { Mock, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../i18n/i18n-helper";

import { useScreen } from "../../../contexts/screenContext";

import EventFilter from "../EventFilter";

// Mock context
vi.mock("../../../contexts/screenContext", () => ({
  useScreen: vi.fn(),
}));

vi.mock("../../../contexts/authContext", () => ({
  __esModule: true,
  useAuth: () => ({
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
    },
    setUser: vi.fn(),
    isAuthLoading: false,
  }),
}));

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => ({
    openModal: vi.fn(),
    handleDelete: vi.fn(),
  }),
}));

vi.mock("../../../hooks/useUserCharactersChecker", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useUserCharactersChecker from "../../../hooks/useUserCharactersChecker";

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

    (useUserCharactersChecker as unknown as Mock).mockImplementation(() => ({
      checkUserCharacters: true,
    }));

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
    expect(
      screen.getByLabelText(new RegExp(t("common.title"), "i")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(new RegExp(t("tag.upperCase"), "i")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(new RegExp(t("server.upperCase"), "i")),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("common.search") }),
    ).toBeInTheDocument();
  });

  it("calls setTitle when title input changes", () => {
    const input = screen.getByLabelText(new RegExp(t("common.title"), "i"));
    fireEvent.change(input, { target: { value: "Test Event" } });
    expect(setTitle).toHaveBeenCalledWith("Test Event");
  });

  it("calls setTag when tag select changes", () => {
    const select = screen.getByLabelText(new RegExp(t("tag.upperCase"), "i"));
    fireEvent.change(select, {
      target: { value: "e70d01fa-6074-44cc-b804-a430f4162eb5" },
    });
    expect(setTag).toHaveBeenCalledWith("e70d01fa-6074-44cc-b804-a430f4162eb5");
  });

  it("calls setServer when server select changes", () => {
    const select = screen.getByLabelText(
      new RegExp(t("server.upperCase"), "i"),
    );
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
