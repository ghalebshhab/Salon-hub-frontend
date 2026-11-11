import { Flag, Send } from "lucide-react";
import { useState } from "react";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import ReportDialog from "../../moderation/components/ReportDialog.jsx";

export default function CommunityComments({
  postId,
  comments = [],
  busy,
  onAddComment,
}) {
  const [draft, setDraft] = useState("");
  const [reporting, setReporting] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    if (await onAddComment(postId, draft)) setDraft("");
  };

  return (
    <section className="community-comments" aria-label="Comments">
      {comments.map((comment) => (
        <div className="community-comment" key={comment.id}>
          <CommunityProfileLink user={comment.author} size="small" />
          <div>
            <CommunityProfileLink
              className="community-comment-author-name"
              user={comment.author}
              showAvatar={false}
            >
              <strong>
                {comment.author.displayName || comment.author.userName}
              </strong>
            </CommunityProfileLink>
            <p>{comment.content}</p>
          </div>
          {!comment.ownedByMe && (
            <button
              className="community-comment-report"
              type="button"
              aria-label={`Report comment by ${comment.author.displayName || comment.author.userName}`}
              onClick={() => setReporting(comment)}
            >
              <Flag size={14} />
            </button>
          )}
        </div>
      ))}
      {comments.length === 0 && (
        <p className="community-comments-empty">Start the conversation.</p>
      )}
      <form className="community-comment-form" onSubmit={submit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={2000}
          placeholder="Write a thoughtful comment…"
          aria-label="Comment"
        />
        <button
          type="submit"
          aria-label="Send comment"
          disabled={!draft.trim() || isCommunityActionBusy(busy, `comment-${postId}`)}
        >
          <Send size={17} />
        </button>
      </form>
      {reporting && (
        <ReportDialog
          targetType="COMMENT"
          targetId={reporting.id}
          targetLabel="comment"
          onClose={() => setReporting(null)}
        />
      )}
    </section>
  );
}
