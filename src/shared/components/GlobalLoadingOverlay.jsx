import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import BrandedLoadingOverlay from "./BrandedLoadingOverlay.jsx";
import {
  getLoadingSnapshot,
  subscribeLoading,
} from "../loading/loadingStore.js";

const SHOW_DELAY_MS = 180;
const MINIMUM_VISIBLE_MS = 320;

function usePolishedVisibility(active) {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (active && !visible) {
      const timer = window.setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, SHOW_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    if (!active && visible) {
      const elapsed = Date.now() - shownAt.current;
      const timer = window.setTimeout(
        () => setVisible(false),
        Math.max(0, MINIMUM_VISIBLE_MS - elapsed),
      );
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [active, visible]);

  return visible;
}

export default function GlobalLoadingOverlay() {
  const loading = useSyncExternalStore(
    subscribeLoading,
    getLoadingSnapshot,
    getLoadingSnapshot,
  );
  const visible = usePolishedVisibility(loading.active);

  return <BrandedLoadingOverlay visible={visible} message={loading.message} />;
}
