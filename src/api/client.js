import { API_BASE_URL } from "../config/api";

// Set once by AuthProvider so this plain fetch client can read the current
// refresh token and push token-refresh/session-expiry events back into auth
// state, without needing a global store (this site has none - just Context).
let authHooks = {
  getRefreshToken: () => null,
  onTokenRefreshed: () => {},
  onSessionExpired: () => {},
};

export function configureAuthClient(hooks) {
  authHooks = { ...authHooks, ...hooks };
}

// Dedupe concurrent 401s: if several requests expire at once, only one
// /auth/refresh-token call should fire; the rest await the same promise.
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = authHooks.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.message || "Session expired");
  }

  return payload.data.accessToken;
}

function buildHeaders(authToken, isFormData) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  return headers;
}

export async function apiRequest(path, { method = "GET", body, token, isFormData = false, skipAuthRefresh = false } = {}) {
  const requestBody = body === undefined ? undefined : isFormData ? body : JSON.stringify(body);

  let res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, isFormData),
    body: requestBody,
  });

  // Access token expired mid-session - refresh once and retry the original
  // request, transparently. Skipped for anonymous calls and for the
  // refresh/login endpoints themselves to avoid recursion.
  if (res.status === 401 && token && !skipAuthRefresh) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;
      authHooks.onTokenRefreshed(newAccessToken);

      res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: buildHeaders(newAccessToken, isFormData),
        body: requestBody,
      });
    } catch {
      authHooks.onSessionExpired();
      throw new Error("Your session has expired. Please log in again.");
    }
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed with status ${res.status}`);
  }

  return payload;
}
