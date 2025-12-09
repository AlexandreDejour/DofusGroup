import "./Comment.scss";

import { Dispatch, SetStateAction } from "react";

import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EventEnriched } from "../../types/event";
import { CommentEnriched } from "../../types/comment";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";

import { useTypedTranslation } from "../../i18n/i18n-helper";
import isCommentUpdated from "../../pages/EventDetails/utils/isCommentUpdated";

interface CommentProps {
  comment: CommentEnriched;
  setEvent: Dispatch<SetStateAction<EventEnriched | null>>;
}

export default function Comment({ comment, setEvent }: CommentProps) {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { openModal, handleDelete } = useModal();

  return (
    <>
      <p className="event_section_comments_list_item_content">
        {comment.content}
        {isCommentUpdated(comment) && (
          <em className="event_section_comments_list_item_content_updated">
            {" "}
            ({t("common.updated")})
          </em>
        )}
      </p>
      <p className="event_section_comments_list_item_author">
        {t("common.author")}: {comment.user.username}
      </p>
      {user?.id === comment.user.id && (
        <div className="event_section_comments_list_item_buttons">
          <button
            className="event_section_comments_list_item_buttons_update button"
            aria-label={`Update comment ${comment.id}`}
            onClick={() => openModal("updateComment", comment)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className="event_section_comments_list_item_buttons_delete button delete"
            aria-label={`Delete comment ${comment.id}`}
            onClick={() => {
              handleDelete("comment", comment.id);
              setEvent((prev) =>
                prev
                  ? {
                      ...prev,
                      comments: prev.comments.filter(
                        (c) => c.id !== comment.id,
                      ),
                    }
                  : prev,
              );
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </>
  );
}
