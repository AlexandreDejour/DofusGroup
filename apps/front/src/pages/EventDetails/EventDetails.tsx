import "./EventDetails.scss";

import { useState } from "react";
import { useTypedTranslation } from "../../i18n/i18n-helper";
import { Navigate, useNavigate, useParams } from "react-router";

import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EventEnriched } from "../../types/event";
import { Comment } from "../../types/comment";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";

import useFetchEvent from "./hooks/useFetchEvent";
import useCharacterRemover from "./hooks/useCharacterRemover";

import EventCharacterCard from "../../components/EventCharacterCard/EventCharacterCard";

export default function EventDetails() {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  const { id } = useParams();
  const { user } = useAuth();
  const { updateTarget, openModal, handleDelete } = useModal();

  const [event, setEvent] = useState<EventEnriched | null>(null);

  const removeCharacter = useCharacterRemover(event, setEvent);

  if (!id) return <Navigate to="/not-found" replace />;

  const { isLoading } = useFetchEvent(id, updateTarget, setEvent);

  if (!isLoading && event === null) return <Navigate to="/not-found" replace />;

  function isCommentUpdated(comment: Comment) {
    const created = new Date(comment.createdAt);
    const updated = new Date(comment.updatedAt);

    if (Number.isNaN(created.getTime()) || Number.isNaN(updated.getTime())) {
      return false;
    }

    return created.getTime() !== updated.getTime();
  }

  return (
    <main className="event">
      {event ? (
        <section className="event_section">
          <div className="event_section_title">
            <h2>
              {event.title.charAt(0).toLocaleUpperCase() + event.title.slice(1)}
            </h2>
            <p>
              {t("common.createdBy")} {event.user.username}
            </p>
            <p
              className="event_section_title_tag"
              style={{ backgroundColor: event.tag.color }}
            >
              {event.tag.name}
            </p>
          </div>

          <div className="event_section_details">
            <p className="event_section_details_item">
              <span>{t("server.upperCase")}:</span> {event.server.name}
            </p>
            <p className="event_section_details_item">
              <span>{t("common.date")}: </span>
              {new Date(event.date).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
            <p className="event_section_details_item">
              <span>{t("common.duration")}:</span> {event.duration} minutes
            </p>
            <p className="event_section_details_item">
              <span>{t("common.playerNumber")}:</span> {event.characters.length}
              /{event.max_players}
            </p>
            <p className="event_section_details_item">
              <span>{t("common.status")}:</span> {event.status}
            </p>
            {event.area && (
              <p className="event_section_details_item">
                <span>{t("common.area")}:</span> {event.area}
              </p>
            )}
            {event.sub_area && (
              <p className="event_section_details_item">
                <span>{t("common.subArea")}:</span> {event.sub_area}
              </p>
            )}
            {event.donjon_name && (
              <p className="event_section_details_item">
                <span>{t("common.dungeon")}:</span> {event.donjon_name}
              </p>
            )}
          </div>

          {event.description && (
            <div className="event_section_description">
              <span>{t("common.description")}:</span> <p>{event.description}</p>
            </div>
          )}

          <div className="event_section_characters">
            <span>{t("common.team")}: </span>
            <button
              type="button"
              className="quick button"
              onClick={() => openModal("joinEvent", event)}
              title={!user ? t("character.error.disable") : ""}
              disabled={!user}
              style={{
                background: !user
                  ? "grey"
                  : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
              }}
            >
              {t("common.join")}
            </button>
            <ul className="event_section_characters_list">
              {event.characters.map((character) => (
                <li key={character.id}>
                  <EventCharacterCard
                    event={event}
                    character={character}
                    removeCharacter={removeCharacter}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="event_section_comments">
            <span>{t("common.discussion")}: </span>
            <button
              type="button"
              className="quick button"
              onClick={() => openModal("comment", event)}
              title={!user ? t("comment.error.disable") : ""}
              disabled={!user}
              style={{
                background: !user
                  ? "grey"
                  : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
              }}
            >
              {t("comment.single")}
            </button>
            <ul className="event_section_comments_list">
              {event.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="event_section_comments_list_item"
                >
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
                </li>
              ))}
            </ul>
          </div>

          <div className="event_section_buttons">
            <button
              type="button"
              className="button"
              onClick={() => openModal("joinEvent", event)}
              title={!user ? t("character.error.disable") : ""}
              disabled={!user}
              style={{
                background: !user
                  ? "grey"
                  : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
              }}
            >
              {t("common.join")}
            </button>

            <button
              type="button"
              className="button"
              onClick={() => openModal("comment", event)}
              title={!user ? t("comment.error.disable") : ""}
              disabled={!user}
              style={{
                background: !user
                  ? "grey"
                  : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
              }}
            >
              {t("comment.single")}
            </button>
            {event.user.id === user?.id && (
              <>
                <button
                  type="button"
                  className="button"
                  onClick={() => openModal("updateEvent", event)}
                >
                  {t("common.change")}
                </button>
                <button
                  type="button"
                  className="button delete"
                  onClick={() => handleDelete("event_details", event.id)}
                >
                  {t("common.delete.default")}
                </button>
              </>
            )}
          </div>
        </section>
      ) : (
        <p>{t("common.loading")}</p>
      )}
      <button
        type="button"
        className="event_button button"
        onClick={() => navigate(-1)}
      >
        {t("common.return")}
      </button>
    </main>
  );
}
