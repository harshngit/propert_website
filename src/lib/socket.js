import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

const STORAGE_KEY = "ps_site_session";

// Socket.IO connects to the server's origin, not the /api path - derive it
// from the same base URL every REST call already uses.
const SOCKET_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Read fresh from localStorage at (re)connect time, same source
// AuthContext.jsx persists the session to - avoids needing this module to
// live inside React's Context tree.
function currentAccessToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw)?.accessToken || undefined : undefined;
  } catch {
    return undefined;
  }
}

let socket = null;

// Lazily created, single shared connection reused across every component
// that needs real-time chat events. Reconnects automatically (socket.io's
// default).
export function getSocket() {
  if (socket) return socket;

  socket = io(SOCKET_ORIGIN, {
    autoConnect: false,
    auth: (cb) => cb({ token: currentAccessToken() }),
  });

  return socket;
}
