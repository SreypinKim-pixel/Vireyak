// Demo-only, client-side sign-in marker. The account pages are previews, so no
// credentials are ever stored or transmitted. This module only persists a
// lightweight "signed in" marker in browser storage so the navbar can indicate
// that the demo login succeeded. It uses session storage by default and is kept
// in persistent local storage as well only when "Remember me" is checked. It is
// cleared by Log out.
const STORAGE_KEY = "vireyak-demo-user";

const listeners = new Set();

function emit() {
  for (const listener of listeners) listener();
}

function readSession() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function readPersistent() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getDemoUser() {
  if (typeof window === "undefined") return null;
  // The most recent session wins within this tab; fall back to a remembered
  // persistent sign-in that survived a browser restart.
  return readSession() || readPersistent();
}

export function signInDemo(email, remember = false) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, email);
    if (remember) window.localStorage.setItem(STORAGE_KEY, email);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
  emit();
}

export function signOutDemo() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
  emit();
}

export function subscribeDemoUser(onChange) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

if (typeof window !== "undefined") {
  // Sync a remembered demo session started or ended in another tab.
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) emit();
  });
}
