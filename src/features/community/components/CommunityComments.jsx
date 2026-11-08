import { Send } from "lucide-react";
import { useState } from "react";
import CommunityAvatar from "./CommunityAvatar.jsx";

export default function CommunityComments({
  postId,
  comments = [],
  busy,
  onAddComment,
}) {
  const [draft, setDraft] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    if (await onAddComment(postId, draft)) setDraft("");
  };

  return (
    <section className="community-comments" aria-label="Comments">
      {comments.map((comment) => (
        <div className="community-comment" key={comment.id}>
          <CommunityAvatar name={comment.author.displayName} size="small" />
          <div>
            <strong>
              {comment.author.displayName || comment.author.userName}
            </strong>
            <p>{comment.content}</p>
          </div>
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
          disabled={!draft.trim() || busy === `comment-${postId}`}
        >
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}
