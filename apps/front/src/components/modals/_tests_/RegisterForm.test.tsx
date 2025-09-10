import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import RegisterForm from "../Forms/RegisterForm";

describe("RegisterForm", () => {
  it("Display all form fields and button", () => {
    render(<RegisterForm handleSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/Pseudo:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mot de passe:$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^Confirmation mot de passe:$/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Call handleSubmit on form submit", () => {
    const handleSubmit = vi.fn();
    render(<RegisterForm handleSubmit={handleSubmit} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
