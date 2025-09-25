import { describe, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { CommentEnriched } from "../../../../types/comment";

import CommentForm from "../Forms/CommentForm";

describe("CommentForm", () => {
  const handleSubmitMock = vi.fn();

  beforeEach(() => {
    handleSubmitMock.mockClear();
  });

  it("Renders correctly in creation mode", () => {
    render(<CommentForm handleSubmit={handleSubmitMock} />);

    expect(screen.getByText(/ajouter un commentaire/i)).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/rédigez un commentaire/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /commenter/i }),
    ).toBeInTheDocument();
  });

  it("Renders correctly in update mode with pre-filled content", () => {
    const updateTarget: CommentEnriched = {
      id: "c1",
      content: "Contenu existant",
      user: { id: "u1", username: "toto" },
    };

    render(
      <CommentForm
        handleSubmit={handleSubmitMock}
        updateTarget={updateTarget}
      />,
    );

    expect(screen.getByText(/modifier un commentaire/i)).toBeInTheDocument();
    const textarea = screen.getByDisplayValue("Contenu existant");
    expect(textarea).toBeInTheDocument();
  });

  it("Updates the textarea value when typing", () => {
    render(<CommentForm handleSubmit={handleSubmitMock} />);
    const textarea = screen.getByPlaceholderText(/rédigez un commentaire/i);

    fireEvent.change(textarea, { target: { value: "Nouveau commentaire" } });
    expect(textarea).toHaveValue("Nouveau commentaire");
  });

  it("Calls handleSubmit when submitting the form", () => {
    render(<CommentForm handleSubmit={handleSubmitMock} />);
    const form = screen.getByRole("form");

    fireEvent.submit(form);
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });
});
