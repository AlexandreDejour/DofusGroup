export type Character = {
  id: number;
  name: string;
  sex: string;
  level: number;
  alignment: string;
  stuff: string;
  default_character: boolean;
};

export type CharacterEnriched = Character & {
  user: [];
  breed: string;
  server: string;
  events: [];
};
