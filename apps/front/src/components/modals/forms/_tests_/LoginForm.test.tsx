import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import LoginForm from "../Forms/LoginForm";

describe("LoginForm", () => {
  it("Display all form fields and button", () => {
    render(<LoginForm handleSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/Pseudo:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mot de passe:$/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Call handleSubmit on form submit", () => {
    const handleSubmit = vi.fn();
    render(<LoginForm handleSubmit={handleSubmit} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
