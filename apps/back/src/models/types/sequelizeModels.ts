import Tag from "../Tag.js";
import User from "../User.js";
import Breed from "../Breeds.js";
import Event from "../Event.js";
import Server from "../Server.js";
import Character from "../Character.js";

export interface SequelizeModels {
  Tag: typeof Tag;
  User: typeof User;
  Event: typeof Event;
  Breed: typeof Breed;
  Server: typeof Server;
  Character: typeof Character;
}
