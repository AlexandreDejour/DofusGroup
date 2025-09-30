import "./Form.scss";

import { useState } from "react";

import { CommentEnriched } from "../../../../types/comment";

import { t } from "../../../../i18n/i18n-helper";
import { typeGuard } from "../../utils/typeGuard";

interface CommentFormProps {
  updateTarget?: CommentEnriched;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function CommentForm({
  updateTarget,
  handleSubmit,
}: CommentFormProps) {
  const [content, setContent] = useState<string>(updateTarget?.content ?? "");

  return (
    <div className="content_modal">
      {typeGuard.commentEnriched(updateTarget) ? (
        <h3 className="content_modal_title">{t("comment.change")}</h3>
      ) : (
        <h3 className="content_modal_title">{t("comment.add")}</h3>
      )}

      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="content" className="content_modal_form_label">
          <span>{t("comment")}: </span>
          {typeGuard.commentEnriched(updateTarget) ? (
            <textarea
              name="content"
              id="content"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder={t("comment.write")}
              className="content_modal_form_label_input"
            ></textarea>
          ) : (
            <textarea
              name="content"
              id="content"
              rows={3}
              required
              placeholder={t("comment.write")}
              className="content_modal_form_label_input"
            />
          )}
        </label>

        <button type="submit" className="content_modal_form_button button">
          {t("comment.single")}
        </button>
      </form>
    </div>
  );
}
