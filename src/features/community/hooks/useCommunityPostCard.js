import { useState } from "react";

export default function useCommunityPostCard({ post, authorName, comments, onLoadComments }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const toggleComments = () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments === undefined) onLoadComments(post.id);
  };

  const sharePost = async () => {
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${authorName} on SalonHub`,
          text: post.content,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
      }
    } catch (error) {
      if (error?.name !== "AbortError") setShared(false);
    }
  };

  return {
    commentsOpen,
    shared,
    likesOpen,
    reportOpen,
    toggleComments,
    sharePost,
    openLikes: () => setLikesOpen(true),
    closeLikes: () => setLikesOpen(false),
    openReport: () => setReportOpen(true),
    closeReport: () => setReportOpen(false),
  };
}
