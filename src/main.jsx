import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { initTracker } from "./lib/tracker";
import { initPwa } from "./lib/pwa";
import { initI18n } from "./lib/i18n";
import { API_BASE_URL } from "./config/api";

initTracker();
initPwa();
initI18n({ app: "website", apiBase: API_BASE_URL });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
