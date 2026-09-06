// OAuth 2.0 Client ID from Google Cloud Console (APIs & Services >
// Credentials). Not a secret - Google Identity Services issues a signed ID
// token straight to the browser, verified server-side against this same id
// (see backendapi's GOOGLE_CLIENT_ID env var). Leave blank to hide the
// Google button entirely until this is filled in.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;