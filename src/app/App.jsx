import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "../shared/components/ErrorBoundary.jsx";
import StartupSplash from "../shared/components/StartupSplash.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import AuthProvider from "../features/auth/providers/AuthProvider.jsx";
import GlobalLoadingOverlay from "../shared/components/GlobalLoadingOverlay.jsx";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const duration = import.meta.env.MODE === "test" ? 0 : 1800;
    const timer = window.setTimeout(() => setShowSplash(false), duration);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) return <StartupSplash />;

  return (
    <AuthProvider>
      <div className="application-enter">
        <ErrorBoundary>
          <BrowserRouter>
            <AppRoutes />
            <GlobalLoadingOverlay />

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
