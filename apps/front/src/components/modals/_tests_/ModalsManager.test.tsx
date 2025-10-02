import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../i18n/i18n-helper";

import ModalProvider from "../../../contexts/modalContext";

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
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

// Mock before component import
let mockUseModal: () => any = () => ({
  isOpen: true,
  modalType: "register",
  handleSubmit: vi.fn(),
  closeModal: vi.fn(),
  openModal: vi.fn(),
});

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal(),
}));

import { CharacterEnriched } from "../../../types/character";
import { CommentEnriched } from "../../../types/comment";

import ModalsManager from "../ModalsManager";

const FIELD_LABELS: Record<string, string> = {
  mail: t("auth.email.default"),
  password: t("auth.password.default"),
  username: t("auth.username"),
};

function renderModalsManager() {
  return render(
    <ModalProvider>
      <ModalsManager />
    </ModalProvider>,
  );
}

describe("ModalsManager", () => {
  let closeModal: ReturnType<typeof vi.fn>;
  let handleSubmit: ReturnType<typeof vi.fn>;

  const eventTarget = {
    id: "05d29664-ca0e-4500-bf06-352384986d95",
    title: "Passage korriandre",
    date: "2025-09-20T09:50:00.000Z",
    duration: 40,
    area: "Île de Frigost",
    sub_area: "Antre du Korriandre",
    donjon_name: "Antre du Korriandre",
    description: "Tu payes, je te fais passer en fast",
    max_players: 8,
    status: "public",
    tag: {
      id: "6f2cf523-18be-470e-99e1-3fea1d91ab4c",
      name: "Donjon",
      color: "#c0392b",
    },
    server: {
      id: "3e354b84-1516-4160-b750-cbe798d7b11e",
      name: "Salar",
      mono_account: false,
    },
    comments: [],
    characters: [
      {
        id: "a5c8f77a-2b7d-4a45-87e2-fae117936829",
        name: "gniouf",
        sex: "M",
        level: 2,
        alignment: "Neutre",
        stuff: null,
        default_character: false,
        user: {
          id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
          username: "totolebeau",
        },
        breed: {
          id: "bd0783a6-8012-4724-8319-42e2349b88a4",
          name: "Ecaflip",
        },
        server: {
          id: "73b70f36-b546-4ee4-95ce-9bbc4adb67df",
          name: "Brial",
          mono_account: false,
        },
      },
    ],
    user: {
      id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
      username: "totolebeau",
    },
  };

  beforeEach(() => {
    closeModal = vi.fn();
    handleSubmit = vi.fn();

    // Default mock : register form
    mockUseModal = () => ({
      isOpen: true,
      modalType: "register",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });
  });

  it("Display RegisterForm when modalType is 'register'", () => {
    renderModalsManager();
    expect(
      screen.getByRole("button", { name: t("auth.register") }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: t("auth.register") }),
    ).toBeInTheDocument();
  });

  it("Display LoginForm when modalType is 'login'", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "login",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    renderModalsManager();
    expect(
      screen.getByRole("button", { name: t("auth.login") }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: t("auth.login") }),
    ).toBeInTheDocument();
  });

  it.each(Object.entries(FIELD_LABELS))(
    "Display UpdateForm when modalType is '%s'",
    (field, expectedLabel) => {
      mockUseModal = () => ({
        isOpen: true,
        modalType: field,
        handleSubmit,
        closeModal,
        openModal: vi.fn(),
      });

      renderModalsManager();

      expect(
        screen.getByRole("heading", {
          level: 3,
          name: new RegExp(`${t("common.change")}\\s+${expectedLabel}`, "i"),
        }),
      ).toBeInTheDocument();

      const mainPlaceholder = `${t("common.new")} ${expectedLabel}`;

      const mainInput = screen.getByPlaceholderText(
        mainPlaceholder,
      ) as HTMLInputElement;
      expect(mainInput).toBeInTheDocument();
      // vérifications supplémentaires optionnelles
      expect(mainInput).toHaveAttribute("name", field);
      expect(mainInput).toHaveAttribute("id", field);

      if (field === "password") {
        const confirmPlaceholder = `${t("common.confirm")} ${expectedLabel}`;
        const confirmInput = screen.getByPlaceholderText(
          confirmPlaceholder,
        ) as HTMLInputElement;
        expect(confirmInput).toBeInTheDocument();
        const expectedConfirmName = `confirm${
          field.charAt(0).toUpperCase() + field.slice(1)
        }`; // confirmPassword
        expect(confirmInput).toHaveAttribute("name", expectedConfirmName);
        expect(confirmInput).toHaveAttribute("id", expectedConfirmName);
      }

      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    },
  );

  it("Display NewCharacterForm when modalType is 'newCharacter'", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "newCharacter",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: null,
    });
    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Display UpdateCharacterForm when modalType is 'updateCharacter' and target is valid", () => {
    const target: CharacterEnriched = {
      id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
      name: "Chronos",
      sex: "M",
      level: 50,
      alignment: "Neutre",
      stuff: "https://d-bk.net/fr/d/1QVjw",
      server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
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
    };

    mockUseModal = () => ({
      isOpen: true,
      modalType: "updateCharacter",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: target,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Display UpdateEventForm when modalType is 'updateEvent' and target is valid", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "updateEvent",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: eventTarget,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders CommentForm for 'comment' modalType with EventEnriched target", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "comment",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: eventTarget,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t("comment.write"))).toBeInTheDocument();
  });

  it("renders CommentForm for 'updateComment' modalType with CommentEnriched target", () => {
    const commentTarget: CommentEnriched = {
      id: "d4286ff2-1c7b-4dc4-a355-914173987045",
      content: "Test comment",
      user: { id: "6e3d7d0d-2043-4831-9b33-d97aa6d38e48", username: "toto" },
    };

    mockUseModal = () => ({
      isOpen: true,
      modalType: "updateComment",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: commentTarget,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test comment")).toBeInTheDocument();
  });

  it("Display close button", () => {
    renderModalsManager();
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it("Close modal when user click on background", () => {
    renderModalsManager();
    fireEvent.click(screen.getByRole("dialog"));
    expect(closeModal).toHaveBeenCalled();
  });

  it("Don't close modal when user click on content", () => {
    renderModalsManager();
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("renders JoinEventForm for 'joinEvent' modalType with EventEnriched target", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "joinEvent",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: eventTarget,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Display nothing if isOpen is false", () => {
    mockUseModal = () => ({
      isOpen: false,
      modalType: "register",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });

  it("Display nothing if modalType is null", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: null,
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });
});
