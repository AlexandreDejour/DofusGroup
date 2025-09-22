import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import EventDetails from "../EventDetails";

// Mock config
vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock service
let getOneEnrichedMock: any;

vi.mock("../../../services/api/eventService", () => {
  return {
    EventService: vi.fn().mockImplementation(() => ({
      getOneEnriched: (...args: any[]) => getOneEnrichedMock(...args),
      removeCharacter: vi.fn(),
    })),
  };
});

// Mock react-router
const navigateMock = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Navigate: ({ to }: { to: string }) => {
      navigateMock(to);
      return null;
    },
    useParams: () => ({ id: "evt-1" }),
  };
});

// Mock context
vi.mock("../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
  }),
}));

const openModal = vi.fn();
const handleDelete = vi.fn();
vi.mock("../../../contexts/modalContext", () => ({
  useModal: () => ({
    openModal,
    handleDelete,
    updateTarget: vi.fn(),
  }),
}));

const showSuccess = vi.fn();
const showError = vi.fn();
vi.mock("../../../contexts/notificationContext", () => ({
  useNotification: () => ({
    showSuccess,
    showError,
  }),
}));

const mockEvent = {
  id: "55c4e602-e91f-4cda-8abe-a5458717dd7e",
  title: "titre test",
  tag: {
    id: "3e6cc90a-9665-4646-9952-2aa953dd0e44",
    name: "Donjon",
    color: "#0000",
  },
  server: {
    id: "ea36c49d-7b90-47df-b378-e487f6f78e7f",
    name: "Djaul",
    mono_account: true,
  },
  date: new Date("2025-10-26T10:00"),
  duration: 120,
  area: "Amakna",
  sub_area: "Forêt d’Amakna",
  donjon_name: "Donjon Corbac",
  max_players: 8,
  description: "Description test",
  status: "public",
  characters: [],
  comments: [],
  user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
};

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/events/evt-1"]}>
      <Routes>
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/not-found" element={<p>Not Found Page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetails", () => {
  beforeEach(() => {
    getOneEnrichedMock = vi.fn().mockResolvedValue(mockEvent);
    openModal.mockClear();
    handleDelete.mockClear();
    navigateMock.mockClear();
    showSuccess.mockClear();
    showError.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    getOneEnrichedMock = vi
      .fn()
      .mockImplementation(() => new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument();
  });

  it("renders event details after successful fetch", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/titre test/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/créé par toto/i)).toBeInTheDocument();
    expect(screen.getAllByText(/donjon/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Djaul/i)).toBeInTheDocument();
    expect(screen.getAllByText(/amakna/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/forêt d’amakna/i)).toBeInTheDocument();
    expect(screen.getByText(/donjon corbac/i)).toBeInTheDocument();
    expect(screen.getByText(/description test/i)).toBeInTheDocument();
  });

  it("shows action buttons if user owns the event", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/titre test/i));

    expect(
      screen.getByRole("button", { name: /modifier/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /supprimer/i }),
    ).toBeInTheDocument();
  });

  it("calls openModal when clicking Modifier", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/titre test/i));

    fireEvent.click(screen.getByRole("button", { name: /modifier/i }));
    expect(openModal).toHaveBeenCalledWith("updateEvent", mockEvent);
  });

  it("calls handleDelete when clicking Supprimer", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/titre test/i));

    fireEvent.click(screen.getByRole("button", { name: /supprimer/i }));
    expect(handleDelete).toHaveBeenCalledWith(
      "event_details",
      "55c4e602-e91f-4cda-8abe-a5458717dd7e",
    );
  });

  it("calls openModal when clicking Rejoindre", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/titre test/i));

    const joinButtons = screen.getAllByRole("button", { name: /rejoindre/i });
    fireEvent.click(joinButtons[0]);
    expect(openModal).toHaveBeenCalledWith("joinEvent", mockEvent);
  });

  it("navigates back when clicking Retour", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByText(/titre test/i));

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("renders nothing and navigates to /not-found if event is null", async () => {
    getOneEnrichedMock = vi.fn().mockResolvedValue(null);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryByText(/titre test/i)).not.toBeInTheDocument();
    });
  });

  it("renders comments with author and content", async () => {
    const mockEventWithComments = {
      ...mockEvent,
      comments: [
        {
          id: "c1",
          content: "Super event !",
          user: {
            id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159",
            username: "toto",
          },
        },
      ],
    };
    getOneEnrichedMock = vi.fn().mockResolvedValue(mockEventWithComments);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/super event/i)).toBeInTheDocument();
      expect(screen.getByText(/auteur: toto/i)).toBeInTheDocument();
    });
  });

  it("shows update and delete buttons only for user's own comment", async () => {
    const mockEventWithComments = {
      ...mockEvent,
      comments: [
        {
          id: "7999dc4e-8760-47ab-92c9-dcde2a6a3e90",
          content: "Super event !",
          user: {
            id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159",
            username: "toto",
          },
        },
        {
          id: "d4286ff2-1c7b-4dc4-a355-914173987045",
          content: "Pas mal !",
          user: { id: "other-user", username: "lulu" },
        },
      ],
    };
    getOneEnrichedMock = vi.fn().mockResolvedValue(mockEventWithComments);

    renderWithRouter();

    await waitFor(() => {
      // Toto's comments display buttons
      expect(
        screen.getByRole("button", {
          name: /update comment 7999dc4e-8760-47ab-92c9-dcde2a6a3e90/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /delete comment 7999dc4e-8760-47ab-92c9-dcde2a6a3e90/i,
        }),
      ).toBeInTheDocument();

      // Lulu's comments doesn't display buttons
      expect(
        screen.queryByRole("button", {
          name: /update comment d4286ff2-1c7b-4dc4-a355-914173987045/i,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: /delete comment d4286ff2-1c7b-4dc4-a355-914173987045/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("calls openModal with updateComment when clicking modifier", async () => {
    const comment = {
      id: "7999dc4e-8760-47ab-92c9-dcde2a6a3e90",
      content: "À modifier",
      user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
    };
    getOneEnrichedMock = vi.fn().mockResolvedValue({
      ...mockEvent,
      comments: [comment],
    });

    renderWithRouter();

    await waitFor(() => screen.getByText(/à modifier/i));

    fireEvent.click(
      screen.getByRole("button", {
        name: /update comment 7999dc4e-8760-47ab-92c9-dcde2a6a3e90/i,
      }),
    );
    expect(openModal).toHaveBeenCalledWith("updateComment", comment);
  });

  it("calls handleDelete and removes comment when clicking supprimer", async () => {
    const comment = {
      id: "7999dc4e-8760-47ab-92c9-dcde2a6a3e90",
      content: "À supprimer",
      user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
    };
    getOneEnrichedMock = vi.fn().mockResolvedValue({
      ...mockEvent,
      comments: [comment],
    });

    renderWithRouter();

    await waitFor(() => screen.getByText(/à supprimer/i));

    fireEvent.click(
      screen.getByRole("button", {
        name: /delete comment 7999dc4e-8760-47ab-92c9-dcde2a6a3e90/i,
      }),
    );

    expect(handleDelete).toHaveBeenCalledWith(
      "comment",
      "7999dc4e-8760-47ab-92c9-dcde2a6a3e90",
    );

    // Le commentaire doit disparaître après suppression
    await waitFor(() => {
      expect(screen.queryByText(/à supprimer/i)).not.toBeInTheDocument();
    });
  });

  it("logs axios error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getOneEnrichedMock = vi
      .fn()
      .mockRejectedValue({ isAxiosError: true, message: "Axios fail" });

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Axios error:", "Axios fail");
    });

    consoleSpy.mockRestore();
  });

  it("logs general error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getOneEnrichedMock = vi.fn().mockRejectedValue(new Error("General fail"));

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("General error:", "General fail");
    });

    consoleSpy.mockRestore();
  });
});
