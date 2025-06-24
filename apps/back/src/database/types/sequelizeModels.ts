import Tag from "../models/Tag.js";
import User from "../models/User.js";
import Breed from "../models/Breeds.js";
import Event from "../models/Event.js";
import Server from "../models/Server.js";
import Character from "../models/Character.js";

export interface SequelizeModels {
  Tag: typeof Tag;
  User: typeof User;
  Event: typeof Event;
  Breed: typeof Breed;
  Server: typeof Server;
  Character: typeof Character;
}
