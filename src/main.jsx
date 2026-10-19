import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { initTracker } from "./lib/tracker";
import { initPwa } from "./lib/pwa";
import { initI18n } from "./lib/i18n";
import { initBranding } from "./lib/branding";
import { initSiteConfig } from "./lib/siteConfig";
import { isNativeApp } from "./lib/fieldTracking";
import { API_BASE_URL } from "./config/api";

initTracker();
// The PropertySerch Field app (Capacitor) bundles this site: it opens on the
// field partner's tasks and needs no service worker.
if (isNativeApp()) {
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") window.history.replaceState(null, "", "/dashboard/work-from-home");
} else {
  initPwa();
}
initI18n({ app: "website", apiBase: API_BASE_URL });
initBranding({ apiBase: API_BASE_URL });
initSiteConfig({ apiBase: API_BASE_URL });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
