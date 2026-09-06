import React, { useEffect, useRef } from "react";
import { GOOGLE_CLIENT_ID } from "../../config/google";

let scriptPromise = null;
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Renders Google's own Sign-In button (required by Google Identity Services
// - a custom-styled button can only *trigger* the flow, not render the
// FedCM-compliant widget itself) into a container div, and forwards the
// resulting ID token to `onCredential`. Renders nothing if no Client ID is
// configured yet, rather than showing a broken button.
function GoogleLoginButton({ onCredential, text = "continue_with" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;
    let cancelled = false;

    loadGoogleScript().then(() => {
      if (cancelled || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text,
        shape: "pill",
        width: 360,
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;

  return <div ref={containerRef} className="flex w-full justify-center [&>div]:!w-full" />;
}

export default GoogleLoginButton;
