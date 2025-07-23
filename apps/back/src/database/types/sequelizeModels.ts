import Tag from "../models/Tag.js";
import User from "../models/User.js";
import Breed from "../models/Breeds.js";
import Event from "../models/Event.js";
import Server from "../models/Server.js";
import Comment from "../models/Comment.js";
import Character from "../models/Character.js";

export interface SequelizeModels {
  Tag: typeof Tag;
  User: typeof User;
  Event: typeof Event;
  Breed: typeof Breed;
  Server: typeof Server;
  Comment: typeof Comment;
  Character: typeof Character;
}
