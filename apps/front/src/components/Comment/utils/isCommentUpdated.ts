import { Comment } from "../../../types/comment";

export default function isCommentUpdated(comment: Comment) {
  const created = new Date(comment.createdAt);
  const updated = new Date(comment.updatedAt);

  if (Number.isNaN(created.getTime()) || Number.isNaN(updated.getTime())) {
    return false;
  }

  return created.getTime() !== updated.getTime();
}
