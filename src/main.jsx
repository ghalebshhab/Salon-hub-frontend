import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./app/styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import "./shared/theme/theme.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
