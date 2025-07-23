import { Event } from "./event.js";
import { Comment } from "./comment.js";
import { Character } from "./character.js";

export type User = {
  id: string;
  username: string;
};

export type UserEnriched = User & {
  events?: Event[];
  comments?: Comment[];
  characters?: Character[];
};

export type UserBodyData = Omit<User, "id"> & {
  password: string;
  mail: string;
};
