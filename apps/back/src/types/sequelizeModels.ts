import { IUser } from "../models/User.js";
import { IEvent } from "../models/Event.js";
import { IServer } from "../models/Server.js";
import { IBreed } from "../models/Breeds.js";
import { ITag } from "../models/Tag.js";
import { ICharacter } from "../models/Character.js";

export interface SequelizeModels {
  User: typeof IUser;
}
