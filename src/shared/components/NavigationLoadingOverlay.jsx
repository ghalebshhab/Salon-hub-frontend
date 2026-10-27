import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BrandedLoadingOverlay from "./BrandedLoadingOverlay.jsx";
import { navigationMessageFor } from "../loading/navigationLoading.js";

const NAVIGATION_VISIBLE_MS = 650;

export default function NavigationLoadingOverlay() {
  const location = useLocation();
  const initialLocationKey = useRef(location.key);
  const timerRef = useRef();
  const [navigation, setNavigation] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    if (location.key === initialLocationKey.current) return undefined;

    window.clearTimeout(timerRef.current);
    setNavigation({
      visible: true,
      message: navigationMessageFor(location.pathname),
    });
    timerRef.current = window.setTimeout(
      () => setNavigation((current) => ({ ...current, visible: false })),
      NAVIGATION_VISIBLE_MS,
    );

    return () => window.clearTimeout(timerRef.current);
  }, [location.key, location.pathname]);

  return (
    <BrandedLoadingOverlay
      visible={navigation.visible}
      message={navigation.message}
      variant="navigation"
      className="navigation-loading-overlay"
    />
  );
}
