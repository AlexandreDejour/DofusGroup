import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach } from "vitest";

import { MemoryRouter } from "react-router-dom";
import { t } from "../../../i18n/i18n-helper";

// Mock des services
let deleteEventMock: any;
let deleteCharacterMock: any;
let deleteUserMock: any;
let getOneMock: any;
let getOneEnrichedMock: any;

// Mock config
vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock useAuth
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

// Mock useNavigate de react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock services
vi.mock("../../../services/api/eventService", () => {
  return {
    EventService: vi.fn().mockImplementation(() => ({
      delete: (...args: any[]) => deleteEventMock(...args),
    })),
  };
});

vi.mock("../../../services/api/characterService", () => {
  return {
    CharacterService: vi.fn().mockImplementation(() => ({
      delete: (...args: any[]) => deleteCharacterMock(...args),
    })),
  };
});

vi.mock("../../../services/api/userService", () => {
  return {
    UserService: vi.fn().mockImplementation(() => ({
      getOneEnriched: (...args: any[]) => getOneEnrichedMock(...args),
      getOne: (...args: any[]) => getOneMock(...args),
      delete: (...args: any[]) => deleteUserMock(...args),
    })),
  };
});

// Mock ProfileEventCard
vi.mock("../../../components/ProfileEventCard/ProfileEventCard", () => ({
  default: ({ event, handleDelete }: any) => (
    <section data-testid="event-card">
      <h3>{event.title}</h3>
      <p data-testid="event-tag">{event.tag.name}</p>
      <p data-testid="event-date">
        {new Date(event.date).toLocaleString("fr-FR", { timeZone: "UTC" })}
      </p>
      <p data-testid="event-players">
        {event.characters ? event.characters.length : 0}/{event.max_players}
      </p>
      <div>
        <button>{t("common.details")}</button>
        {/* Pass the handleDelete prop and call it with the correct arguments */}
        <button onClick={() => handleDelete("event", event.id)}>
          {t("common.delete.default")}
        </button>
      </div>
    </section>
  ),
}));

// Mock CharacterCard
vi.mock("../../../components/CharacterCard/CharacterCard", () => ({
  default: ({ character, handleDelete }: any) => (
    <section data-testid="character-card">
      <h3 data-testid="character-name">{character.name}</h3>
      <p data-testid="character-breed">{character.breed?.name}</p>
      <p data-testid="character-level">niveau: {character.level}</p>
      <div>
        <button>{t("common.details")}</button>
        {/* Pass the handleDelete prop and call it with the correct arguments */}
        <button onClick={() => handleDelete("character", character.id)}>
          {t("common.delete.default")}
        </button>
      </div>
    </section>
  ),
}));

import Profile from "../Profile";
import NotificationProvider from "../../../contexts/notificationContext";

const renderProfile = () => {
  return render(
    <MemoryRouter>
      <NotificationProvider>
        <Profile />
      </NotificationProvider>
    </MemoryRouter>,
  );
};

describe("Profile Page", () => {
  const mockUserAfterDelete = {
    id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
    username: "toto",
    events: [],
    characters: [],
  };

  beforeEach(() => {
    getOneEnrichedMock = vi.fn().mockResolvedValue({
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      createdAt: "2025-07-27T17:40:34.489Z",
      updatedAt: "2025-07-27T17:40:34.489Z",
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
          createdAt: "2025-07-27T18:59:55.613Z",
          updatedAt: "2025-07-27T18:59:55.613Z",
          breed: { name: "Cra" },
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
          date: "2025-12-24T23:59:59.000Z",
          duration: 180,
          area: null,
          sub_area: null,
          donjon_name: null,
          description: "on rase tout",
          max_players: 8,
          status: "public",
          tag_id: "31d0d841-1345-4939-9495-0f802362eb79",
          user_id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
          server_id: "62592fd9-66b8-410c-a42e-f98b9a8173f1",
          createdAt: "2025-08-10T11:21:30.520Z",
          updatedAt: "2025-08-10T11:21:30.520Z",
          tag: {
            id: "31d0d841-1345-4939-9495-0f802362eb79",
            name: "Percepteur",
            color: "#2c3e50",
            createdAt: "2025-07-27T12:39:28.731Z",
            updatedAt: "2025-07-27T12:39:28.731Z",
          },
          characters: [
            {
              id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
              name: "Chronos",
              sex: "M",
              level: 50,
              alignment: "Neutre",
              stuff: "https://d-bk.net/fr/d/1QVjw",
              default_character: false,
              user_id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
              server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
              breed_id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
              createdAt: "2025-07-27T18:23:32.837Z",
              updatedAt: "2025-07-27T18:23:32.837Z",
              event_team: {
                createdAt: "2025-08-10T11:21:30.544Z",
                updatedAt: "2025-08-10T11:21:30.544Z",
                event_id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
                character_id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
              },
              breed: {
                id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
                name: "Cra",
                createdAt: "2025-07-27T12:39:28.731Z",
                updatedAt: "2025-07-27T12:39:28.731Z",
              },
            },
          ],
        },
      ],
    });
    showError.mockClear();
    openModal.mockClear();
    handleDelete.mockClear();
    mockNavigate.mockClear();
    getOneMock = vi.fn().mockResolvedValue(mockUserAfterDelete);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Display user data after API call", async () => {
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

    await waitFor(() => {
      expect(getOneEnrichedMock).toHaveBeenCalled();
    });

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

    await waitFor(() => {
      expect(
        screen.getByText(`${t("auth.username")}: toto`),
      ).toBeInTheDocument();
    });

    const deleteAccountButton = screen.getByRole("button", {
      name: t("common.delete.account"),
    });

    await act(async () => {
      fireEvent.click(deleteAccountButton);
    });

    expect(handleDelete).toHaveBeenCalledWith("user");
  });

  it("Display events list after API call", async () => {
    renderProfile();

    await waitFor(() => {
      const card = screen.getByTestId("event-card");
      expect(card).toBeInTheDocument();
      expect(screen.getByText("Rafle perco")).toBeInTheDocument();
      expect(screen.getByTestId("event-tag")).toHaveTextContent("Percepteur");
      expect(screen.getByTestId("event-date")).toHaveTextContent(
        new Date("2025-12-24T23:59:59.000Z").toLocaleString("fr-FR", {
          timeZone: "UTC",
        }),
      );
      expect(screen.getByTestId("event-players")).toHaveTextContent("1/8");
    });
  });

  it("should call the deleteEvent service when the delete button is clicked", async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText("Rafle perco")).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByRole("button", {
      name: t("common.delete.default"),
    })[0];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Check delete service is call with valid arguments
    expect(handleDelete).toHaveBeenCalledWith(
      "event",
      "ef9891a6-dcab-4846-8f9c-2044efe2096c",
    );
  });

  it("Display characters list after API call", async () => {
    renderProfile();

    await waitFor(() => {
      const card = screen.getByTestId("character-card");
      expect(card).toBeInTheDocument();
      expect(screen.getByTestId("character-name")).toHaveTextContent("Chronos");
      expect(screen.getByTestId("character-breed")).toHaveTextContent("Cra");
      expect(screen.getByTestId("character-level")).toHaveTextContent("50");
    });
  });

  it("should call the deleteCharacter service when the delete button is clicked", async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText("Chronos")).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByRole("button", {
      name: t("common.delete.default"),
    })[1];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Check delete service is call with valid arguments
    expect(handleDelete).toHaveBeenCalledWith(
      "character",
      "9f0eaa8c-eec1-4e85-9365-7653c1330325",
    );
  });

  it("Manage axios error", async () => {
    getOneEnrichedMock = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error("Axios error"), { isAxiosError: true }),
      );
    renderProfile();

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith(
        t("system.error.default"),
        "Axios error",
      );
    });
  });

  it("Manage general error", async () => {
    getOneEnrichedMock = vi
      .fn()
      .mockRejectedValue(new Error(t("system.error.occurred")));
    renderProfile();

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith(
        t("system.error.default"),
        t("system.error.occurred"),
      );
    });
  });
});
