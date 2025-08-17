export type RegisterForm = {
  username: string;
  mail: string;
  password: string;
  confirmPassword: string;
};

export type LoginForm = Omit<RegisterForm, "mail" | "confirmPassword">;
