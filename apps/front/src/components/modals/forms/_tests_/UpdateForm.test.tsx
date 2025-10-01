// UpdateForm.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

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
    mail: { label: t("auth.email.default"), type: "email" },
    password: { label: t("auth.password.default"), type: "password" },
    username: { label: t("auth.username"), type: "text" },
  };

  it.each(Object.entries(FIELD_MAP))(
    "Display form for field '%s'",
    (field, { label, type }) => {
      render(<UpdateForm field={field} handleSubmit={handleSubmit} />);

      // Heading
      expect(
        screen.getByRole("heading", {
          level: 3,
          name: `${t("common.change")} ${label}`,
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
      const submitButton = screen.getByRole("button", {
        name: /update/i,
      });
      expect(submitButton).toBeInTheDocument();

      // Password field: confirmation input
      if (field === "password") {
        const confirmInput = screen.getByLabelText(
          new RegExp(`${t("common.confirm")} ${label}`, "i"),
        ) as HTMLInputElement;
        expect(confirmInput).toBeInTheDocument();
        expect(confirmInput).toHaveAttribute("type", "password");
        expect(confirmInput).toHaveAttribute("name", "confirmPassword");
      }
    },
  );

  it("Call handleSubmit on form submit", () => {
    render(<UpdateForm field="username" handleSubmit={handleSubmit} />);

    const input = screen.getByLabelText(t("auth.username")) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "newUsername" } });
    expect(input.value).toBe("newUsername");

    const submitButton = screen.getByRole("button", {
      name: "Update",
    });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("fallback : unknown field return input type text", () => {
    render(<UpdateForm field="inconnu" handleSubmit={handleSubmit} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(t("common.change"));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "inconnu");
  });
});
