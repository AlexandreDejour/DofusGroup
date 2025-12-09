import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import { t } from "../../../i18n/i18n-helper";

import { EventEnriched } from "../../../types/event";
import { CommentEnriched } from "../../../types/comment";

import Comment from "../Comment";

// Mock config
vi.mock("../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock useAuth
const mockUser = { id: "user-123", username: "testuser" };
vi.mock("../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: mockUser,
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

// Mock isCommentUpdated utility
vi.mock("../utils/isCommentUpdated", () => ({
  default: (comment: CommentEnriched) => {
    return (
      comment.createdAt !== comment.updatedAt &&
      new Date(comment.updatedAt) > new Date(comment.createdAt)
    );
  },
}));

const mockComment: CommentEnriched = {
  id: "comment-1",
  content: "This is a test comment",
  user: { id: "user-123", username: "testuser" },
  createdAt: "2025-01-01T10:00:00Z",
  updatedAt: "2025-01-01T10:00:00Z",
};

const mockEvent: EventEnriched = {
  id: "event-1",
  title: "Test Event",
  date: new Date("2025-08-17T12:00:00Z"),
  duration: 120,
  area: "Amakna",
  sub_area: "Coin des bouftou",
  max_players: 8,
  status: "public",
  tag: {
    id: "tag-1",
    name: "PVM",
    color: "#ff0000",
  },
  server: {
    id: "server-1",
    name: "Jiva",
    mono_account: true,
  },
  user: { id: "user-123", username: "testuser" },
  characters: [],
  comments: [mockComment],
};

const renderComponent = (comment = mockComment, setEvent = vi.fn()) =>
  render(<Comment comment={comment} setEvent={setEvent} />);

describe("Comment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Display comment content", () => {
    renderComponent();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
  });

  it("Display author name", () => {
    renderComponent();
    expect(
      screen.getByText(`${t("common.author")}: testuser`),
    ).toBeInTheDocument();
  });

  it("Display updated label if comment was updated", () => {
    const updatedComment = {
      ...mockComment,
      updatedAt: "2025-01-01T11:00:00Z", // different from created_at
    };

    renderComponent(updatedComment);
    expect(screen.getByText(`(${t("common.updated")})`)).toBeInTheDocument();
  });

  it("Not display updated label if comment was never updated", () => {
    renderComponent(mockComment);
    expect(screen.queryByText(/common.updated/i)).not.toBeInTheDocument();
  });

  it("Display edit and delete buttons if user is comment author", () => {
    renderComponent();
    expect(
      screen.getByRole("button", {
        name: /Update comment comment-1/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Delete comment comment-1/i,
      }),
    ).toBeInTheDocument();
  });

  it("Not display edit and delete buttons if user is not comment author", () => {
    const otherComment = {
      ...mockComment,
      user: { id: "other-user", username: "otheruser" },
    };

    renderComponent(otherComment);
    expect(
      screen.queryByRole("button", {
        name: /Update comment comment-1/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Delete comment comment-1/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("Open update modal when click on edit button", () => {
    renderComponent();
    const editButton = screen.getByRole("button", {
      name: /Update comment comment-1/i,
    });
    fireEvent.click(editButton);
    expect(openModal).toHaveBeenCalledWith("updateComment", mockComment);
  });

  it("Call handleDelete and update event when click on delete button", () => {
    const setEvent = vi.fn();
    renderComponent(mockComment, setEvent);

    const deleteButton = screen.getByRole("button", {
      name: /Delete comment comment-1/i,
    });
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith("comment", "comment-1");
    expect(setEvent).toHaveBeenCalled();

    // Verify that the comment is removed from event.comments
    const setEventCall = setEvent.mock.calls[0][0];
    const updatedEvent = setEventCall(mockEvent);
    expect(updatedEvent.comments).toEqual([]);
  });

  it("Handle setEvent with null event", () => {
    const setEvent = vi.fn();
    renderComponent(mockComment, setEvent);

    const deleteButton = screen.getByRole("button", {
      name: /Delete comment comment-1/i,
    });
    fireEvent.click(deleteButton);

    // Simulate null event
    const setEventCall = setEvent.mock.calls[0][0];
    const result = setEventCall(null);
    expect(result).toBeNull();
  });

  it("Filter out deleted comment from comments array", () => {
    const multiCommentEvent: EventEnriched = {
      ...mockEvent,
      comments: [
        mockComment,
        {
          ...mockComment,
          id: "comment-2",
          content: "Another comment",
          user: { id: "user-456", username: "otheruser" },
        },
      ],
    };

    const setEvent = vi.fn();
    renderComponent(mockComment, setEvent);

    const deleteButton = screen.getByRole("button", {
      name: /Delete comment comment-1/i,
    });
    fireEvent.click(deleteButton);

    const setEventCall = setEvent.mock.calls[0][0];
    const updatedEvent = setEventCall(multiCommentEvent);

    expect(updatedEvent.comments).toHaveLength(1);
    expect(updatedEvent.comments[0].id).toBe("comment-2");
  });
});
