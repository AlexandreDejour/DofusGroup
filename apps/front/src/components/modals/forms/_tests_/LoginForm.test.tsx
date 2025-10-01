import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import LoginForm from "../Forms/LoginForm";

describe("LoginForm", () => {
  it("Display all form fields and button", () => {
    render(<LoginForm handleSubmit={vi.fn()} />);
    expect(screen.getByLabelText(`${t("auth.username")}:`)).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${t("auth.password.default")}:`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Call handleSubmit on form submit", () => {
    const handleSubmit = vi.fn();
    render(<LoginForm handleSubmit={handleSubmit} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
