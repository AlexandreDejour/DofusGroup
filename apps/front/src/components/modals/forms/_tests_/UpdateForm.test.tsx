// UpdateForm.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import UpdateForm from "../Forms/UpdateForm";

describe("UpdateForm", () => {
  let handleSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Stub handler dans prevent default event
    handleSubmit = vi.fn((e: Event) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
    });
  });

  const FIELD_MAP: Record<string, { label: string; type: string }> = {
    mail: { label: "email", type: "email" },
    password: { label: "mot de passe", type: "password" },
    username: { label: "pseudo", type: "text" },
  };

  it.each(Object.entries(FIELD_MAP))(
    "Display form for field '%s'",
    (field, { label, type }) => {
      render(<UpdateForm field={field} handleSubmit={handleSubmit} />);

      // Heading
      expect(
        screen.getByRole("heading", {
          level: 3,
          name: new RegExp(`Modifier\\s+${label}`, "i"),
        }),
      ).toBeInTheDocument();

      // Main input
      const input = screen.getByLabelText(
        new RegExp(`^${label}$`, "i"),
      ) as HTMLInputElement;

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", type);
      expect(input).toHaveAttribute("name", field);
      expect(input).toHaveAttribute("id", field);
      expect(input).toBeRequired();

      // Submit button
      const submitButton = screen.getByRole("button", { name: /Update/i });
      expect(submitButton).toBeInTheDocument();

      // Password field should render confirmation input
      if (field === "password") {
        const confirmInput = screen.getByLabelText(
          /Confirmation/i,
        ) as HTMLInputElement;
        expect(confirmInput).toBeInTheDocument();
        expect(confirmInput).toHaveAttribute("type", "password");
        expect(confirmInput).toHaveAttribute("name", "confirmPassword");
      }
    },
  );

  it("Call handleSubmit on form submit", () => {
    render(<UpdateForm field="username" handleSubmit={handleSubmit} />);

    const input = screen.getByLabelText(/pseudo/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "nouveauPseudo" } });
    expect(input.value).toBe("nouveauPseudo");

    const submitButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("fallback : unknown field return input type text", () => {
    render(<UpdateForm field="inconnu" handleSubmit={handleSubmit} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/Modifier\s*/i);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "inconnu");
  });
});
