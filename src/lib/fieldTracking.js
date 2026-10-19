// Module 47 field partners: the 10-minute location track at a property.
//
//   In the PropertySerch Field app (Android / iOS, built with Capacitor) the
//   phone keeps reporting with the screen locked or another app open: a
//   foreground-service notification ("Recording your visit") stays up while it
//   runs, and the OS hands every new fix to the watcher below.
//   In a browser the page can only report while it is open and the screen on.
//
// The track belongs to the app, not to one screen: moving to another page
// keeps it running. It stops when the track is complete, when the task leaves
// the "in progress" state, or when the partner stops it. Positions go to the
// server as they come - it measures presence by when it receives them, so
// nothing is queued up and back-dated.
import { Capacitor, registerPlugin } from "@capacitor/core";
import { apiRequest } from "../api/client";

const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");
const SEND_EVERY_MS = 30000;

export const isNativeApp = () => Capacitor.isNativePlatform();
export const platformName = () => Capacitor.getPlatform(); // 'android' | 'ios' | 'web'

const state = { taskId: null, token: null, progress: null, error: null, running: false, listeners: new Set() };
let buffer = [];
let lastSent = 0;
let sending = false;
let stopSource = null;
let timer = null;
let wakeLock = null;

const emit = () => state.listeners.forEach((fn) => fn({ taskId: state.taskId, progress: state.progress, error: state.error, running: state.running, native: isNativeApp() }));
export function subscribe(fn) {
  state.listeners.add(fn);
  fn({ taskId: state.taskId, progress: state.progress, error: state.error, running: state.running, native: isNativeApp() });
  return () => state.listeners.delete(fn);
}

async function send(force = false) {
  if (sending || !state.taskId) return;
  if (!force && Date.now() - lastSent < SEND_EVERY_MS) return;
  const points = buffer.splice(0, 30);
  if (!points.length) return;
  sending = true;
  lastSent = Date.now();
  try {
    const r = await apiRequest(`/wfh/assignments/${state.taskId}/track`, { method: "POST", token: state.token, body: { points } });
    state.progress = r.data;
    state.error = null;
    if (r.data?.ok) await stop(); // complete - save the battery
  } catch (err) {
    state.error = err.message;
    // The task is no longer in progress (submitted, cancelled, expired): nothing more to record.
    if (err.status === 400 || err.status === 403 || err.status === 404) await stop();
  } finally {
    sending = false;
    emit();
  }
}

const push = ({ latitude, longitude, accuracy, time, simulated }) => {
  buffer.push({ latitude, longitude, accuracy, at: new Date(time || Date.now()).toISOString(), mocked: !!simulated, source: isNativeApp() ? platformName() : "web" });
  if (buffer.length > 120) buffer = buffer.slice(-120);
  send();
};

async function startNative() {
  const id = await BackgroundGeolocation.addWatcher(
    {
      // With a background message Android runs a foreground service, so fixes keep coming with the screen off.
      backgroundTitle: "Recording your visit",
      backgroundMessage: "PropertySerch is recording your time at the property for this task.",
      requestPermissions: true,
      stale: false,
      distanceFilter: 0,
    },
    (location, error) => {
      if (error) {
        if (error.code === "NOT_AUTHORIZED") {
          state.error = "Allow location access for PropertySerch Field (Settings → Location) and start again.";
          emit();
          if (window.confirm("Location access is off. Open settings to allow it?")) BackgroundGeolocation.openSettings();
        } else {
          state.error = error.message || "Location unavailable";
          emit();
        }
        return;
      }
      if (location) push(location);
    }
  );
  return () => BackgroundGeolocation.removeWatcher({ id });
}

function startWeb() {
  if (!navigator.geolocation) throw new Error("This device cannot share its location");
  const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
  const onFix = (p) => push({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy, time: p.timestamp });
  const fail = () => {
    state.error = "Allow location access and keep location switched on";
    emit();
  };
  const watch = navigator.geolocation.watchPosition(onFix, fail, options);
  navigator.wakeLock?.request("screen").then((l) => { wakeLock = l; }).catch(() => {});
  return () => {
    navigator.geolocation.clearWatch(watch);
    wakeLock?.release?.().catch(() => {});
    wakeLock = null;
  };
}

export async function start(taskId, token) {
  if (state.running && state.taskId === taskId) return;
  await stop();
  Object.assign(state, { taskId, token, progress: null, error: null, running: true });
  buffer = [];
  lastSent = 0;
  emit();
  try {
    stopSource = isNativeApp() ? await startNative() : startWeb();
  } catch (err) {
    state.error = err.message;
    state.running = false;
    emit();
    return;
  }
  // A phone standing still may not report on its own: flush what we have every 30 s
  // (in the app the fixes themselves also trigger sends, so a paused timer does not matter).
  timer = setInterval(() => {
    if (!buffer.length && !isNativeApp()) navigator.geolocation?.getCurrentPosition((p) => push({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy, time: p.timestamp }), () => {}, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    send();
  }, SEND_EVERY_MS);
}

export async function stop() {
  clearInterval(timer);
  timer = null;
  const s = stopSource;
  stopSource = null;
  if (s) await Promise.resolve(s()).catch(() => {});
  if (state.running) {
    state.running = false;
    emit();
  }
}

// Keep the token current if the session refreshes while a track runs.
export const setToken = (token) => {
  state.token = token;
};
