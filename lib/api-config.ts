// Server-side API settings. Keep the public API default for demo deployments.
export const CAMTRIP_API_BASE_URL = (
  process.env.CAMTRIP_API_BASE_URL?.trim() || "https://cam-trip.cheat.casa"
).replace(/\/+$/, "");

export const API_BASE_URL = (
  process.env.API_BASE_URL?.trim() || `${CAMTRIP_API_BASE_URL}/api`
).replace(/\/+$/, "");
