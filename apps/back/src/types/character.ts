import { User } from "./user.js";
import { Breed } from "./breed.js";
import { Event } from "./event.js";
import { Server } from "./server.js";

export type Character = {
  id: string;
  name: string;
  sex: string;
  level: number;
  alignment: string;
  stuff: string;
  default_character: boolean;
};

export type CharacterEnriched = Character & {
  user?: User;
  breed?: Breed;
  server?: Server;
  events?: Event[];
};

export type CharacterBodyData = Character & {
  user_id: string;
  breed_id: string;
  server_id: string;
};
