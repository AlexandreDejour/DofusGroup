vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

vi.mock("../../../services/api/authService", () => {
  return {
    AuthService: vi.fn().mockImplementation(() => ({
      validateEmail: vi.fn(),
    })),
  };
});

import { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import i18n from "../../../i18n/i18n";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import VerifyEmail from "../VerifyEmail";
import * as VerifyEmailModule from "../VerifyEmail";
import { AuthService } from "../../../services/api/authService";

describe("VerifyEmail component", () => {
  let mockValidateEmail: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateEmail = vi.fn();
    (AuthService as unknown as Mock).mockImplementation(() => ({
      validateEmail: mockValidateEmail,
    }));
    (VerifyEmailModule as any).authService = new AuthService({} as any);
  });

  it("Displays loading message initially", () => {
    render(
      <MemoryRouter initialEntries={["/verify_email?token=test"]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/verify_email" element={<VerifyEmail />} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/progress/i)).toBeInTheDocument();
  });

  it("Displays success message when email validation succeeds", async () => {
    mockValidateEmail.mockResolvedValue("success");

    render(
      <MemoryRouter initialEntries={["/verify_email?token=goodtoken"]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/verify_email" element={<VerifyEmail />} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>,
    );

    // check loading state first (optional, but helps debug ordering)
    expect(screen.getByText(/progress/i)).toBeInTheDocument();

    // ensure validateEmail was called with the right token
    await waitFor(() => {
      expect(mockValidateEmail).toHaveBeenCalledWith("goodtoken");
    });

    // finally expect the success message after the promise resolves
    await waitFor(() => {
      expect(screen.getByText(/checked/i)).toBeInTheDocument();
    });
  });

  it("Displays error message and resend button when validation fails", async () => {
    mockValidateEmail.mockResolvedValue("error");

    render(
      <MemoryRouter initialEntries={["/verify_email?token=badtoken"]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/verify_email" element={<VerifyEmail />} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/expired/i)).toBeInTheDocument(),
    );

    expect(screen.getByRole("button", { name: /resend/i })).toBeInTheDocument();
  });

  it("Displays error message when no token is provided", async () => {
    render(
      <MemoryRouter initialEntries={["/verify_email"]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/verify_email" element={<VerifyEmail />} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/expired/i)).toBeInTheDocument(),
    );
  });

  it("Displays error message when validateEmail throws", async () => {
    mockValidateEmail.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter initialEntries={["/verify-email?token=badtoken"]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/expired/i)).toBeInTheDocument(),
    );
  });
});
