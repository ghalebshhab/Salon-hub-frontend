import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
// Self-hosted brand typefaces (SIL OFL 1.1); loaded before app styles so tokens resolve.
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "./app/styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import "./shared/theme/theme.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
