import { Mock, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";

import { Tag } from "../../../types/tag";
import { Event } from "../../../types/event";
import { Server } from "../../../types/server";

import { t } from "../../../i18n/i18n-helper";

import { useScreen } from "../../../contexts/screenContext";

import Home from "../Home";

// Mock context
vi.mock("../../../contexts/screenContext", () => ({
  useScreen: vi.fn(),
}));

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

const showError = vi.fn();
vi.mock("../../../contexts/notificationContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showError,
  }),
}));

vi.mock("../../../components/EventCard/EventCard", () => ({
  default: ({ event }: any) => (
    <article data-testid="event-card">
      <h3>{event.title}</h3>
      <p data-testid="event-tag">{event.tag.name}</p>
      <p data-testid="event-server">{event.server.name}</p>
      <p data-testid="event-date">
        {new Date(event.date).toLocaleString("fr-FR", { timeZone: "UTC" })}
      </p>
      <p data-testid="event-duration">{event.duration} min</p>
      <p data-testid="event-players">
        {event.characters ? event.characters.length : 0}/{event.max_players}
      </p>
      <button>{t("common.details")}</button>
    </article>
  ),
}));

vi.mock("../../../components/Pagination/Pagination", () => ({
  default: ({
    totalPages,
    currentPage,
    onPageChange,
    maxVisiblePages,
  }: any) => {
    // Can simulate simple list with only one page
    const pages = Array.from(
      { length: Math.min(totalPages, maxVisiblePages) },
      (_, i) => i + 1,
    );

    return (
      <ul data-testid="pagination">
        {pages.map((page) => (
          <button
            key={page}
            aria-label={`To page ${page}`}
            className={page === currentPage ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </ul>
    );
  },
}));

const mockEventsPage1: Event[] = [
  {
    id: "1",
    title: "Event 1",
    tag: { id: "tag1", name: "tag1", color: "#000" },
    server: {
      id: "srv1",
      name: "srv1",
      mono_account: false,
    },
    date: new Date("2025-08-17T12:00:00Z"),
    duration: 90,
    characters: [
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
      },
      {
        id: "char2",
        name: "char2",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
      },
    ],
    max_players: 8,
    status: "public",
  },
];

const mockEventsPage2: Event[] = [
  {
    id: "2",
    title: "Event 2",
    tag: { id: "tag2", name: "tag2", color: "#000" },
    server: {
      id: "srv2",
      name: "srv2",
      mono_account: false,
    },
    date: new Date("2025-08-17T12:00:00Z"),
    duration: 90,
    characters: [
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv2",
      },
    ],
    max_players: 4,
    status: "public",
  },
];

const mockTags: Tag[] = [{ id: "tag1", name: "tag1", color: "#f0f" }];

const mockServers: Server[] = [
  {
    id: "srv1",
    name: "srv1",
    mono_account: false,
  },
];

vi.mock("../../../hooks/useFetchTags", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../../hooks/useFetchServers", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../../hooks/useFetchEvents", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useFetchTags from "../../../hooks/useFetchTags";
import useFetchEvents from "../../../hooks/useFetchEvents";
import useFetchServers from "../../../hooks/useFetchServers";

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
};

describe("Home page", () => {
  beforeEach(() => {
    vi.mocked(useScreen).mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });

    (useFetchTags as unknown as Mock).mockImplementation(() => ({
      tags: mockTags,
    }));
    (useFetchServers as unknown as Mock).mockImplementation(() => ({
      servers: mockServers,
    }));
    (useFetchEvents as unknown as Mock).mockImplementation(
      (events, setEvents, currentPage, setTotalPages) => {
        Promise.resolve().then(() => {
          setTotalPages(3);

          if (currentPage === 1) {
            setEvents(mockEventsPage1);
          }

          if (currentPage === 2) {
            setEvents(mockEventsPage2);
          }
        });

        return { isLoading: false };
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Renders filter inputs", async () => {
    renderHome();
    expect(
      await screen.findByLabelText(`${t("common.title")}:`),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(`${t("tag.upperCase")}:`)).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${t("server.upperCase")}:`),
    ).toBeInTheDocument();
  });

  it("Display list header", () => {
    renderHome();

    expect(screen.getByText(`${t("common.title")}`)).toBeInTheDocument();
    expect(screen.getByText(`${t("tag.upperCase")}`)).toBeInTheDocument();
    expect(screen.getByText(`${t("server.upperCase")}`)).toBeInTheDocument();
    expect(screen.getByText(`${t("common.date")}`)).toBeInTheDocument();
    expect(screen.getByText(`${t("common.duration")}`)).toBeInTheDocument();
    expect(screen.getByText(`${t("common.players")}`)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("common.new") }),
    ).toBeInTheDocument();
  });

  it("Display spinner at initial renderer", () => {
    (useFetchEvents as unknown as Mock).mockImplementation(
      (events, setEvents, page, setTotalPages) => {
        Promise.resolve().then(() => {
          setEvents(mockEventsPage1);
          setTotalPages(3);
        });

        return { isLoading: true };
      },
    );

    renderHome();
    expect(screen.getByLabelText("Loading Spinner")).toBeInTheDocument();
  });

  it("Display events list after API call", async () => {
    renderHome();

    await waitFor(() => {
      const card = screen.getByTestId("event-card");
      expect(card).toBeInTheDocument();
      expect(screen.getByText("Event 1")).toBeInTheDocument();
      expect(screen.getByTestId("event-tag")).toHaveTextContent("tag1");
      expect(screen.getByTestId("event-server")).toHaveTextContent("srv1");
      expect(screen.getByTestId("event-date")).toHaveTextContent(
        new Date("2025-08-17T12:00:00Z").toLocaleString("fr-FR", {
          timeZone: "UTC",
        }),
      );
      expect(screen.getByTestId("event-duration")).toHaveTextContent("90 min");
      expect(screen.getByTestId("event-players")).toHaveTextContent("2/8");
    });
  });

  it("Display pagination", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "To page 1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "To page 2" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "To page 3" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "To page 1" })).toHaveClass(
        "active",
      );
    });
  });

  it("Change page on pagination click", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Event 1")).toBeInTheDocument();
    });

    screen.getByRole("button", { name: "To page 2" }).click();

    await waitFor(() => {
      const card = screen.getByTestId("event-card");
      expect(card).toBeInTheDocument();
      expect(screen.getByText("Event 2")).toBeInTheDocument();
      expect(screen.getByTestId("event-tag")).toHaveTextContent("tag2");
      expect(screen.getByTestId("event-server")).toHaveTextContent("srv2");
      expect(screen.getByTestId("event-duration")).toHaveTextContent("90 min");
      expect(screen.getByTestId("event-players")).toHaveTextContent("1/4");
    });
  });
});
