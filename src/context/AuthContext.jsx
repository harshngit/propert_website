import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, configureAuthClient } from "../api/client";

const STORAGE_KEY = "ps_site_session";
const AuthContext = createContext(null);

const loadSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable (private browsing, etc.) - session just won't persist across reloads
  }
};

// /auth/login and /auth/me return slightly different shapes (camelCase vs
// snake_case respectively) - this normalizes both into one consistent shape
// the rest of the app can rely on. Only ever called with a *full* user
// object from one of those two endpoints, never a partial response.
const normalizeUser = (apiUser) =>
  apiUser
    ? {
        id: apiUser.id,
        fullName: apiUser.fullName || apiUser.full_name,
        email: apiUser.email,
        mobile: apiUser.mobile,
        role: apiUser.role || apiUser.role_name,
        tenantId: apiUser.tenantId ?? apiUser.tenant_id ?? null,
        profilePictureUrl: apiUser.profilePictureUrl || apiUser.profile_picture_url || "",
      }
    : null;

export function AuthProvider({ children }) {
  const initial = loadSession();
  const [user, setUser] = useState(initial?.user || null);
  const [accessToken, setAccessToken] = useState(initial?.accessToken || null);
  const [refreshToken, setRefreshToken] = useState(initial?.refreshToken || null);
  const [status, setStatus] = useState("loading"); // loading | ready
  const [error, setError] = useState(null);

  // The api client calls these from outside React's render cycle, so it
  // needs to always see the latest tokens/setters - not a stale closure
  // captured on the first render.
  const refreshTokenRef = useRef(refreshToken);
  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  useEffect(() => {
    configureAuthClient({
      getRefreshToken: () => refreshTokenRef.current,
      onTokenRefreshed: (newAccessToken) => {
        setAccessToken(newAccessToken);
      },
      onSessionExpired: () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        persistSession(null);
      },
    });
  }, []);

  // Keep localStorage in sync with whatever the session currently is.
  useEffect(() => {
    if (user && accessToken && refreshToken) {
      persistSession({ user, accessToken, refreshToken });
    } else if (!accessToken) {
      persistSession(null);
    }
  }, [user, accessToken, refreshToken]);

  // On first load, if a session was persisted, confirm it's still valid
  // (and pick up any profile changes) via /auth/me rather than trusting the
  // cached user object forever.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!initial?.accessToken) {
        setStatus("ready");
        return;
      }
      try {
        const res = await apiRequest("/auth/me", { token: initial.accessToken });
        if (!cancelled) setUser(normalizeUser(res.data));
      } catch {
        if (!cancelled) {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          persistSession(null);
        }
      } finally {
        if (!cancelled) setStatus("ready");
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async ({ identifier, password }) => {
    setError(null);
    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: { identifier, password },
        skipAuthRefresh: true,
      });
      const loggedInUser = normalizeUser(res.data.user);
      setUser(loggedInUser);
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const sendLoginOtp = useCallback(async (identifier) => {
    setError(null);
    try {
      await apiRequest("/auth/otp/send", {
        method: "POST",
        body: { identifier, purpose: "login" },
        skipAuthRefresh: true,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // /auth/otp/verify only returns tokens for purpose "login" (no user
  // object, unlike /auth/login) - so the user is fetched separately via
  // /auth/me straight after, the same way hydrate() does on page load.
  const loginWithOtp = useCallback(async ({ identifier, otp }) => {
    setError(null);
    try {
      const res = await apiRequest("/auth/otp/verify", {
        method: "POST",
        body: { identifier, otp, purpose: "login" },
        skipAuthRefresh: true,
      });
      const me = await apiRequest("/auth/me", { token: res.data.accessToken });
      const loggedInUser = normalizeUser(me.data);
      setUser(loggedInUser);
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Unlike password/OTP login, /auth/google returns a full user object
  // directly (no separate /auth/me round trip needed) - it's one flow that
  // covers both login and signup, since allowSelfRegister: true here means
  // a brand-new Google email creates a `customer` account server-side.
  const loginWithGoogle = useCallback(async (idToken) => {
    setError(null);
    try {
      const res = await apiRequest("/auth/google", {
        method: "POST",
        body: { idToken, allowSelfRegister: true },
        skipAuthRefresh: true,
      });
      const loggedInUser = normalizeUser(res.data.user);
      setUser(loggedInUser);
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Registration alone doesn't establish a session (the API only returns
  // the created user, no tokens) - so a successful signup is immediately
  // followed by a real login with the same credentials, giving the
  // "register -> already signed in" flow users expect.
  const register = useCallback(
    async ({ fullName, email, mobile, password }) => {
      setError(null);
      try {
        await apiRequest("/auth/register", {
          method: "POST",
          body: { fullName, email: email || undefined, mobile: mobile || undefined, password, role: "customer", tenantId: null },
          skipAuthRefresh: true,
        });
        return await login({ identifier: email || mobile, password });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    if (accessToken && refreshToken) {
      try {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: { refreshToken },
          token: accessToken,
        });
      } catch {
        // best-effort - clear local session regardless
      }
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    persistSession(null);
  }, [accessToken, refreshToken]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      isReady: status === "ready",
      error,
      login,
      sendLoginOtp,
      loginWithOtp,
      loginWithGoogle,
      register,
      logout,
      clearError,
    }),
    [user, accessToken, status, error, login, sendLoginOtp, loginWithOtp, loginWithGoogle, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
