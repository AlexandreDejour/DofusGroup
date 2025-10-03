import { User } from "./user";
import { Event } from "./event";
import { Breed } from "./breed";
import { Server } from "./server";

export type Character = {
  id: string;
  name: string;
  sex: string;
  level: number;
  alignment: string;
  stuff?: string | null;
  server_id: string;
};

export type CharacterEnriched = Character & {
  user: User;
  breed: Breed;
  server: Server;
  events?: Event[];
};
