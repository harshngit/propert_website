import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { portal } from "../api/portal";
import { useAuth } from "../context/AuthContext";

// Saved properties, shared by every heart on the site and the dashboard's
// Favourites tab. Stored on the account (POST / DELETE /properties/:id/
// favorite), so they follow the user across devices. Guests are sent to
// login first. One module-level store so all hearts update together.

let ids = new Set();
let loadedFor = null;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const snapshot = () => ids;

const isUuid = (value) => /^[0-9a-f-]{36}$/i.test(String(value || ""));

export function useFavourites() {
  const { accessToken, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const current = useSyncExternalStore(subscribe, snapshot);
  const canSave = isAuthenticated && user?.role === "customer";

  useEffect(() => {
    if (!canSave) {
      if (loadedFor) {
        loadedFor = null;
        ids = new Set();
        emit();
      }
      return;
    }
    if (loadedFor === user.id) return;
    loadedFor = user.id;
    portal
      .favourites(accessToken)
      .then((data) => {
        ids = new Set(data.ids || []);
        emit();
      })
      .catch(() => {
        loadedFor = null;
      });
  }, [canSave, user?.id, accessToken]);

  // Returns true when toggled, false when the user was sent to log in or the
  // listing can't be saved (sample data without a real id).
  const toggle = useCallback(
    async (propertyId) => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: location } });
        return false;
      }
      if (!canSave || !isUuid(propertyId)) return false;
      const wasSaved = ids.has(propertyId);
      ids = new Set(ids);
      if (wasSaved) ids.delete(propertyId);
      else ids.add(propertyId);
      emit();
      try {
        if (wasSaved) await portal.removeFavourite(accessToken, propertyId);
        else await portal.addFavourite(accessToken, propertyId);
        return true;
      } catch {
        ids = new Set(ids);
        if (wasSaved) ids.add(propertyId);
        else ids.delete(propertyId);
        emit();
        return false;
      }
    },
    [isAuthenticated, canSave, accessToken, navigate, location],
  );

  return { favouriteIds: current, isFavourite: (id) => current.has(id), toggleFavourite: toggle, canSave };
}
