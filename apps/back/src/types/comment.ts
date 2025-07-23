import { User } from "./user.js";
import { Event } from "./event.js";

export type Comment = {
  id: string;
  content: string;
};

export type CommentEnriched = Comment & {
  user?: User;
  event?: Event;
};

export type CommentBodyData = Omit<Comment, "id"> & {
  user_id: string;
  event_id: string;
};
