import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterForm from "../RegisterForm/RegisterForm";

describe("RegisterForm", () => {
  it("Display all form fields and button", () => {
    render(<RegisterForm handleSubmit={vi.fn()} error={null} />);
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mot de passe:$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^Confirmation mot de passe:$/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Display message if error is define", () => {
    render(<RegisterForm handleSubmit={vi.fn()} error="Erreur !" />);
    expect(screen.getByText("Erreur !")).toBeInTheDocument();
  });

  it("Call handleSubmit on form submit", () => {
    const handleSubmit = vi.fn();
    render(<RegisterForm handleSubmit={handleSubmit} error={null} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
