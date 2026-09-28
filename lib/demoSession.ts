export const DEMO_EMAIL = "demo@example.com";
export const DEMO_PASSWORD = "DemoPassword@123";
export function matchesDemoAccount(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
  );
}
const STORAGE_KEY = "vireyak-demo-user";
const ACCOUNTS_KEY = "vireyak-local-accounts";
type LocalAccount = { email: string; salt: string; hash: string };

function readAccounts(): LocalAccount[] {
  const accounts: unknown = JSON.parse(
    localStorage.getItem(ACCOUNTS_KEY) || "[]",
  );
  if (
    !Array.isArray(accounts) ||
    accounts.some(
      (account) =>
        !account ||
        typeof account.email !== "string" ||
        !/^[a-f0-9]{32}$/.test(account.salt) ||
        !/^[a-f0-9]{64}$/.test(account.hash),
    )
  )
    throw new Error("Saved accounts could not be read.");
  return accounts;
}

async function passwordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 600000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function registerLocalAccount(email: string, password: string) {
  email = email.trim().toLowerCase();
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password.trim() ||
    password.length < 12 ||
    password.length > 128
  ) {
    throw new Error("Enter a valid email and a password of 12–128 characters.");
  }
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const hash = await passwordHash(password, salt);
  const accounts = readAccounts();
  if (
    email === DEMO_EMAIL ||
    accounts.some((account) => account.email === email)
  ) {
    throw new Error(
      "An account with this email already exists. Please log in.",
    );
  }
  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify([...accounts, { email, salt, hash }]),
  );
}

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

export async function signInDemo(
  email: string,
  password: string,
  remember = false,
) {
  email = email.trim().toLowerCase();
  if (!matchesDemoAccount(email, password)) {
    const account = readAccounts().find((entry) => entry.email === email);
    if (
      !account ||
      (await passwordHash(password, account.salt)) !== account.hash
    )
      return false;
  }
  try {
    window.sessionStorage.setItem(STORAGE_KEY, email);
    if (remember) window.localStorage.setItem(STORAGE_KEY, email);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    throw new Error(
      "Login failed. Your browser could not save the session. Enable site storage and try again.",
    );
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
