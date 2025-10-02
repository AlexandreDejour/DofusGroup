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
};

export type CharacterEnriched = Character & {
  user?: User;
  breed?: Breed;
  server?: Server;
  events?: Event[];
};

export type CharacterBodyData = Omit<Character, "id"> & {
  user_id: string;
  breed_id: string;
  server_id: string;
};
