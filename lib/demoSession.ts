export const DEMO_EMAIL = "demo@example.com";
export const DEMO_PASSWORD = "DemoPassword@123";
export function matchesDemoAccount(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
  );
}
const STORAGE_KEY = "vireyak-demo-user";

const listeners = new Set<() => void>();

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

  return readSession() || readPersistent();
}

export function signInDemo(email: string, password: string, remember = false) {
  if (!matchesDemoAccount(email, password)) return false;
  email = DEMO_EMAIL;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, email);
    if (remember) window.localStorage.setItem(STORAGE_KEY, email);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return false;
  }
  emit();
  return true;
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

export function subscribeDemoUser(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) emit();
  });
}
