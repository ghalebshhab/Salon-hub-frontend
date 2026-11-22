import { useEffect, useState } from "react";
import { getCommunityPostLikesApi } from "../api/communityPostsApi.js";
import t from "../../../shared/i18n/t.js";

export default function useCommunityPostLikes(postId) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getCommunityPostLikesApi(postId, { signal: controller.signal })
      .then((response) => {
        if (!response.success) throw new Error(response.message);
        setLikes(response.data || []);
      })
      .catch((requestError) => {
        if (requestError.name !== "CanceledError")
          setError(requestError.message || t("Likes could not be loaded."));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [postId]);

  return { likes, loading, error };
}
