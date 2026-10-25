import "@fontsource-variable/source-sans-3";
import "@fontsource/barlow-condensed/latin-700-italic.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-900-italic.css";
import "@fontsource/barlow-condensed/latin-ext-700-italic.css";
import "@fontsource/barlow-condensed/latin-ext-700.css";
import "@fontsource/barlow-condensed/latin-ext-900-italic.css";
import "@fontsource/rye/latin-400.css";
import "@fontsource/rye/latin-ext-400.css";
import "./app/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { registerServiceWorker } from "./app/register-service-worker";
import { AppRouter } from "./app/router";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
