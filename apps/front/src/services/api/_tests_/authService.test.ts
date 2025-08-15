import { AuthService } from "../authService";
import type { RegisterForm } from "../../../types/form";
import type { AuthUser } from "../../../types/user";

describe("AuthService", () => {
  let axiosMock: any;
  let authService: AuthService;

  beforeEach(() => {
    axiosMock = {
      post: vi.fn(),
    };
    authService = new AuthService({ instance: axiosMock } as any);
  });

  it("Reject if password is to weak", async () => {
    const data: RegisterForm = {
      username: "user",
      mail: "user@mail.com",
      password: "abc",
      confirmPassword: "abc",
    };
    await expect(authService.register(data)).rejects.toThrow(
      "Le mot de passe ne respecte pas les conditions minimales de sécurité.",
    );
    expect(axiosMock.post).not.toHaveBeenCalled();
  });

  it("Reject if password and confirmPassword are not similar", async () => {
    const data: RegisterForm = {
      username: "user",
      mail: "user@mail.com",
      password: "Abcd1234!",
      confirmPassword: "Abcd12345!",
    };
    await expect(authService.register(data)).rejects.toThrow(
      "Le mot de passe et la confirmation doivent être identique.",
    );
    expect(axiosMock.post).not.toHaveBeenCalled();
  });

  it("Return user if request is successful", async () => {
    const user: AuthUser = {
      id: "91c28d2e-758a-4679-9ba7-a3d2b74ae60f",
      username: "user",
      mail: "user@mail.com",
      password: "supersecret",
    };
    axiosMock.post.mockResolvedValue({ data: user });
    const data: RegisterForm = {
      username: "user",
      mail: "user@mail.com",
      password: "Abcd1234!",
      confirmPassword: "Abcd1234!",
    };
    await expect(authService.register(data)).resolves.toEqual(user);
    expect(axiosMock.post).toHaveBeenCalledWith("/auth/register", data);
  });

  it("Reject with special message if server return code 409", async () => {
    axiosMock.post.mockRejectedValue({
      response: { status: 409 },
    });
    const data: RegisterForm = {
      username: "user",
      mail: "user@mail.com",
      password: "Abcd1234!",
      confirmPassword: "Abcd1234!",
    };
    await expect(authService.register(data)).rejects.toThrow(
      "Ce nom d'utilisateur ou email n'est pas disponible.",
    );
  });

  it("Reject with error's origin for other errors", async () => {
    const error = new Error("Network error");
    axiosMock.post.mockRejectedValue(error);
    const data: RegisterForm = {
      username: "user",
      mail: "user@mail.com",
      password: "Abcd1234!",
      confirmPassword: "Abcd1234!",
    };
    await expect(authService.register(data)).rejects.toThrow("Network error");
  });
});
