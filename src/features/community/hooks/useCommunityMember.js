import { useCallback, useEffect, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { getCommunityProfileApi } from "../api/communityPostsApi.js";

const isCanceled = (error) =>
  error?.name === "CanceledError" || error?.name === "AbortError";

export default function useCommunityMember(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyResponse = useCallback((response) => {
    const nextProfile = requireData(response, "This profile could not be loaded.");
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      setProfile(null);
      setError("");
      setLoading(true);
    });

    getCommunityProfileApi(userId, { signal: controller.signal })
      .then(applyResponse)
      .catch((requestError) => {
        if (!isCanceled(requestError)) {
          setError(requestError.message || "This profile could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [applyResponse, userId]);

  const refresh = useCallback(async () => {
    return applyResponse(await getCommunityProfileApi(userId));
  }, [applyResponse, userId]);

  const decrementPostCount = useCallback(() => {
    setProfile((current) =>
      current
        ? { ...current, postCount: Math.max(0, (current.postCount ?? 1) - 1) }
        : current,
    );
  }, []);

  return { profile, loading, error, refresh, decrementPostCount };
}
