import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";

import RegisterForm from "../Forms/RegisterForm";

describe("RegisterForm", () => {
  it("Display all form fields and button", () => {
    render(<RegisterForm handleSubmit={vi.fn()} />);
    expect(screen.getByLabelText(`${t("auth.username")}:`)).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${t("auth.email.default")}:`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${t("auth.password.default")}:`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${t("auth.password.confirm")}:`),
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
