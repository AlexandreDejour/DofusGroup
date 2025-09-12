export type RegisterForm = {
  username: string;
  mail: string;
  password: string;
  confirmPassword: string;
};

export type LoginForm = Omit<RegisterForm, "mail" | "confirmPassword">;

export type UpdateForm = Partial<Omit<RegisterForm, "confirmPassword">>;

export type CreateCharacterForm = {
  name: string;
  sex: string;
  level: number;
  alignment?: string;
  stuff?: string;
  default_character: boolean;
  breed_id: string;
  server_id: string;
};
