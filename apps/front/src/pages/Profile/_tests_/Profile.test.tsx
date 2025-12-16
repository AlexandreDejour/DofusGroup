import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  within,
} from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, Mock } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { t } from "../../../i18n/i18n-helper";

import Profile from "../Profile";
import NotificationProvider from "../../../contexts/notificationContext";

// ----------------------
// Mocks: contexts & hooks
// ----------------------
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

const showError = vi.fn();
vi.mock("../../../contexts/notificationContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showError,
  }),
}));

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock authContext (user present)
vi.mock("../../../contexts/authContext", () => ({
  __esModule: true,
  useAuth: () => ({
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [
        {
          id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
          name: "Chronos",
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
        },
      ],
    },
    setUser: vi.fn(),
    isAuthLoading: false,
  }),
}));

// Mock react-router navigate
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock child components
vi.mock("../../../components/ProfileEventCard/ProfileEventCard", () => ({
  default: ({ event }: any) => (
    <section data-testid="event-card">
      <h3>{event.title}</h3>
      <p data-testid="event-tag">{event.tag?.name}</p>
      <p data-testid="event-date">
        {new Date(event.date).toLocaleString("fr-FR", { timeZone: "UTC" })}
      </p>
      <p data-testid="event-players">
        {event.characters ? event.characters.length : 0}/{event.max_players}
      </p>
      <div>
        <button>{t("common.details")}</button>
        {/* use outer-scoped handleDelete mock to avoid missing/renamed prop issues */}
        <button onClick={() => handleDelete("event", event.id)}>
          {t("common.delete.default")}
        </button>
      </div>
    </section>
  ),
}));

vi.mock("../../../components/CharacterCard/CharacterCard", () => ({
  default: ({ character }: any) => (
    <section data-testid="character-card">
      <h3 data-testid="character-name">{character.name}</h3>
      <p data-testid="character-breed">{character.breed?.name}</p>
      <p data-testid="character-level">niveau: {character.level}</p>
      <div>
        <button>{t("common.details")}</button>
        {/* use outer-scoped handleDelete mock to avoid missing/renamed prop issues */}
        <button onClick={() => handleDelete("character", character.id)}>
          {t("common.delete.default")}
        </button>
      </div>
    </section>
  ),
}));

// ----------------------
// Mocks: hooks used by Profile
// ----------------------
const mockUserEnriched = {
  id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
  username: "toto",
  characters: [
    {
      id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
      name: "Chronos",
      sex: "M",
      level: 50,
      alignment: "Bonta",
      stuff: "https://d-bk.net/fr/d/1QVjw",
      default_character: true,
      user_id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
      breed_id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
      breed: { name: "Cra" },
    },
  ],
  events: [
    {
      id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
      title: "Rafle perco",
      date: "2025-12-24T23:59:59.000Z",
      duration: 180,
      description: "on rase tout",
      max_players: 8,
      status: "public",
      tag: {
        id: "31d0d841-1345-4939-9495-0f802362eb79",
        name: "Percepteur",
        color: "#2c3e50",
      },
      characters: [
        {
          id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
          name: "Chronos",
          sex: "M",
          level: 50,
        },
      ],
    },
  ],
};

const mockUpcoming = [
  {
    id: "up-1",
    title: "Upcoming 1",
    date: "2025-11-11T12:00:00.000Z",
    duration: 60,
    max_players: 5,
    characters: [
      {
        id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
        name: "Chronos",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        default_character: true,
        user_id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
        server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
        breed_id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
        breed: { name: "Cra" },
      },
    ],
    tag: { id: "tag-1", name: "Donjon" },
  },
];

// Hook mocks
vi.mock("../../../hooks/useFetchUserEnriched", () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock("../../../hooks/useFetchUpComingEvents", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useUserEnriched from "../../../hooks/useFetchUserEnriched";
import useFetchUpComingEvents from "../../../hooks/useFetchUpComingEvents";

// Helper to render Profile inside router + notification provider
const renderProfile = () =>
  render(
    <MemoryRouter>
      <NotificationProvider>
        <Profile />
      </NotificationProvider>
    </MemoryRouter>,
  );

describe("Profile Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default successful hooks
    (useUserEnriched as unknown as Mock | any).mockImplementation(() => ({
      userEnriched: mockUserEnriched,
      isLoading: false,
      error: null,
    }));

    (useFetchUpComingEvents as unknown as Mock | any).mockImplementation(
      () => ({
        upComingEvents: mockUpcoming,
        isLoading: false,
        error: null,
      }),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Display spinner at initial renderer", () => {
    // set hooks to loading
    (useUserEnriched as unknown as Mock | any).mockImplementation(() => ({
      userEnriched: {} as any, // objet vide pour passer le check user && userEnriched
      isLoading: true,
      error: null,
    }));

    (useFetchUpComingEvents as unknown as Mock | any).mockImplementation(
      () => ({
        upComingEvents: [],
        isLoading: true,
        error: null,
      }),
    );

    renderProfile();

    const upcomingSection = screen
      .getByText("Upcoming events")
      .closest("section");
    expect(upcomingSection).not.toBeNull();

    const spinner = within(upcomingSection!).getByLabelText("Loading Spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("Display user data after hooks provide data", async () => {
    renderProfile();

    await waitFor(() => {
      expect(
        screen.getByText(`${t("auth.username")}: toto`),
      ).toBeInTheDocument();
      expect(screen.getByText(`${t("event.list")}: 1`)).toBeInTheDocument();
      expect(screen.getByText(`${t("character.list")}: 1`)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("auth.usernameChange") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("auth.password.change") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("auth.email.change") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("common.delete.account") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("event.create") }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t("character.create") }),
      ).toBeInTheDocument();
    });
  });

  it("should open modals for different actions when buttons are clicked", async () => {
    renderProfile();

    const editUsernameButton = screen.getByRole("button", {
      name: t("auth.usernameChange"),
    });
    const createEventButton = screen.getByRole("button", {
      name: t("event.create"),
    });

    await act(async () => {
      fireEvent.click(editUsernameButton);
    });

    expect(openModal).toHaveBeenCalledWith("username");

    await act(async () => {
      fireEvent.click(createEventButton);
    });

    expect(openModal).toHaveBeenCalledWith("newEvent");
  });

  it("should delete the user account and log out", async () => {
    renderProfile();

    const deleteAccountButton = screen.getByRole("button", {
      name: t("common.delete.account"),
    });

    await act(async () => {
      fireEvent.click(deleteAccountButton);
    });

    expect(handleDelete).toHaveBeenCalledWith("user");
  });

  it("Display upComing events list and user events", async () => {
    renderProfile();

    await waitFor(() => {
      const upcomingSection = screen
        .getByText("Upcoming events")
        .closest("section");
      const userEventsSection = screen
        .getByText("Your events")
        .closest("section");

      expect(upcomingSection).not.toBeNull();
      expect(userEventsSection).not.toBeNull();

      // Check event"Upcoming 1" in upcoming section
      const upcomingEvent = within(upcomingSection!).getByText("Upcoming 1");
      expect(upcomingEvent).toBeInTheDocument();

      // Check event "Rafle perco" in user events section
      const userEvent = within(userEventsSection!).getByText("Rafle perco");
      expect(userEvent).toBeInTheDocument();
    });
  });

  it("should call handleDelete when delete buttons inside cards are clicked", async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText("Rafle perco")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", {
      name: t("common.delete.default"),
    });

    // delete button inside character card
    const characterCard = screen.getByTestId("character-card");
    const characterDeleteButton = within(characterCard).getByRole("button", {
      name: t("common.delete.default"),
    });

    await act(async () => {
      fireEvent.click(characterDeleteButton);
    });

    expect(handleDelete).toHaveBeenCalledWith(
      "character",
      "9f0eaa8c-eec1-4e85-9365-7653c1330325",
    );

    // delete button inside event card
    const eventCardElement = screen
      .getByText("Rafle perco")
      .closest("[data-testid='event-card']");

    if (!eventCardElement) throw new Error("Event card not found");

    const eventCard = eventCardElement as HTMLElement;

    const eventDeleteButton = within(eventCard).getByRole("button", {
      name: t("common.delete.default"),
    });

    await act(async () => {
      fireEvent.click(eventDeleteButton);
    });

    expect(handleDelete).toHaveBeenCalledWith(
      "event",
      "ef9891a6-dcab-4846-8f9c-2044efe2096c",
    );
  });

  it("Manage axios error coming from hook implementation", async () => {
    // simulate hook implementation calling showError and returning error state
    (useUserEnriched as unknown as Mock | any).mockImplementation(() => {
      showError(t("system.error.default"), "Axios error");
      return { userEnriched: null, isLoading: false, error: "Axios error" };
    });

    renderProfile();

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith(
        t("system.error.default"),
        "Axios error",
      );
    });
  });

  it("Manage general error coming from hook implementation", async () => {
    (useUserEnriched as unknown as Mock | any).mockImplementation(() => {
      showError(t("system.error.default"), t("system.error.occurred"));
      return {
        userEnriched: null,
        isLoading: false,
        error: t("system.error.occurred"),
      };
    });

    renderProfile();

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith(
        t("system.error.default"),
        t("system.error.occurred"),
      );
    });
  });
});
