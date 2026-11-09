import { useEffect, useState } from "react";
import { getCommunityProfileApi } from "../api/communityPostsApi.js";

export default function useCommunityProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getCommunityProfileApi(userId, { signal: controller.signal })
      .then((response) => {
        if (!response.success) throw new Error(response.message);
        setProfile(response.data);
      })
      .catch((requestError) => {
        if (requestError.name !== "CanceledError")
          setError(requestError.message || "This profile could not be loaded.");
      });
    return () => controller.abort();
  }, [userId]);

  return { profile, error };
}
