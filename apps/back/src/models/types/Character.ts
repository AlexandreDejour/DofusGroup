import User from "../User.js";
import Breed from "../Breeds.js";
import Server from "../Server.js";
import Event from "../Event.js";

export interface ICharacter {
  id: number;
  name: string;
  sex: string;
  level: number;
  alignment: string;
  stuff: string;
  default_character: boolean;
  user_id: number;
  breed_id: number;
  server_id: number;
  events?: Event[];
}

export interface ICharacterEnriched
  extends Omit<ICharacter, "user_id" | "breed_id" | "server_id"> {
  user?: User;
  breed?: Breed;
  server?: Server;
  events?: Event[];
}
