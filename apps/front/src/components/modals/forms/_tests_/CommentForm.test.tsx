import { describe, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import { CommentEnriched } from "../../../../types/comment";

import CommentForm from "../Forms/CommentForm";

describe("CommentForm", () => {
  const handleSubmitMock = vi.fn();

  beforeEach(() => {
    handleSubmitMock.mockClear();
  });

  it("Renders correctly in creation mode", () => {
    render(<CommentForm handleSubmit={handleSubmitMock} />);

    expect(screen.getByText(t("comment.add"))).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(t("comment.write"));
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("");
    expect(
      screen.getByRole("button", { name: t("comment.single") }),
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

    expect(screen.getByText(t("comment.change"))).toBeInTheDocument();
    const textarea = screen.getByDisplayValue("Contenu existant");
    expect(textarea).toBeInTheDocument();
  });

  it("Updates the textarea value when typing", () => {
    render(<CommentForm handleSubmit={handleSubmitMock} />);
    const textarea = screen.getByPlaceholderText(t("comment.write"));

    fireEvent.change(textarea, { target: { value: t("comment.new") } });
    expect(textarea).toHaveValue(t("comment.new"));
  });

  it("Calls handleSubmit when submitting the form", () => {
    render(<CommentForm handleSubmit={handleSubmitMock} />);
    const form = screen.getByRole("form");

    fireEvent.submit(form);
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });
});
