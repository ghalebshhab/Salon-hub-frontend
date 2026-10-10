import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "../shared/components/ErrorBoundary.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />

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
  );
}

export default App;
