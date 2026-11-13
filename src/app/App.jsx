import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "../shared/components/ErrorBoundary.jsx";
import StartupSplash from "../shared/components/StartupSplash.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import AuthProvider from "../features/auth/providers/AuthProvider.jsx";
import GlobalLoadingOverlay from "../shared/components/GlobalLoadingOverlay.jsx";
import NavigationLoadingOverlay from "../shared/components/NavigationLoadingOverlay.jsx";

const SPLASH_SESSION_KEY = "salonhub_splash_seen";
const SPLASH_MS = 600;

// The brand splash greets the first load of a browser session only;
// reloads and later visits in the same session go straight to the app.
function splashDuration() {
  if (import.meta.env.MODE === "test") return 0;
  try {
    if (window.sessionStorage.getItem(SPLASH_SESSION_KEY)) return 0;
    window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    // Storage can be unavailable (private mode); fall back to the short splash.
  }
  return SPLASH_MS;
}

function App() {
  const [splashMs] = useState(splashDuration);
  const [showSplash, setShowSplash] = useState(splashMs > 0);

  useEffect(() => {
    if (splashMs === 0) return undefined;
    const timer = window.setTimeout(() => setShowSplash(false), splashMs);
    return () => window.clearTimeout(timer);
  }, [splashMs]);

  if (showSplash) return <StartupSplash />;

  return (
    <AuthProvider>
      <div className="application-enter">
        <ErrorBoundary>
          <BrowserRouter>
            <AppRoutes />
            <GlobalLoadingOverlay />
            <NavigationLoadingOverlay />

            <ToastContainer
              position="bottom-right"
              autoClose={3600}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
              limit={4}
              theme="dark"
              toastClassName="salon-toast-shell"
              bodyClassName="salon-toast-body"
            />
          </BrowserRouter>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
}

export default App;
