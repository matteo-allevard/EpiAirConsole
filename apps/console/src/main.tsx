import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@byoc/ui/src/brand/tokens.css";
import "@byoc/ui/src/brand/motion.css";
import "./styles/theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
