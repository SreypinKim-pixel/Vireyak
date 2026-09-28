"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInDemo } from "../lib/demoSession";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
export default function AuthForm({ register = false }) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const submitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(
    () => () => {
      clearTimeout(submitTimer.current);
      clearTimeout(redirectTimer.current);
    },
    [],
  );
  const [message, setMessage] = useState("");
  const [province, setProvince] = useState("");
  const [attraction, setAttraction] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attractions, setAttractions] = useState<
    { id: string; name: string; province?: { id: string; name: string } }[]
  >([]);
  const [loadState, setLoadState] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!register) return;
    const controller = new AbortController();
    fetch("/api/attractions", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load attractions");
        const body = await response.json();
        if (
          !body ||
          !Array.isArray(body.data) ||
          body.data.some(
            (
              item: {
                id?: unknown;
                name?: unknown;
                province?: { id?: unknown; name?: unknown } | null;
              } | null,
            ) =>
              !item ||
              typeof item.id !== "string" ||
              typeof item.name !== "string" ||
              (item.province !== undefined &&
                (!item.province ||
                  typeof item.province.id !== "string" ||
                  typeof item.province.name !== "string")),
          )
        )
          throw new Error("Invalid attractions response");
        setAttractions(body.data);
        setLoadState("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadState("error");
      });
    return () => controller.abort();
  }, [register, attempt]);
  const provinces = Array.from(
    new Map(
      attractions.flatMap((item) =>
        item.province ? [[item.province.id, item.province] as const] : [],
      ),
    ).values(),
  );
  const visibleAttractions = attractions.filter(
    (item) => !province || item.province?.id === province,
  );
  function fieldError(name: string) {
    return errors[name] ? (
      <span
        id={`${name}-error`}
        className="mt-1 block text-xs text-red-700 dark:text-red-300"
      >
        {errors[name]}
      </span>
    ) : null;
  }
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState !== "idle") return;
    setMessage("");
    const data = new FormData(e.currentTarget);
    {
      const values = new FormData(e.currentTarget);
      const next: Record<string, string> = {};
      if (register && !String(values.get("name") ?? "").trim())
        next.name = "Enter your full name.";
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          String(values.get("email") ?? "").trim(),
        )
      )
        next.email = "Enter a valid email address.";
      if (!String(values.get("email") ?? "").trim())
        next.email = "Email is required.";
      if (!String(values.get("password") ?? "").trim())
        next.password = "Password is required.";
      else if (register && String(values.get("password") ?? "").length < 12)
        next.password = "Use at least 12 characters.";
      if (
        !register &&
        String(values.get("password") ?? "").trim() &&
        (String(values.get("password")).length < 8 ||
          !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(
            String(values.get("password")),
          ))
      )
        next.password =
          "Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number.";
      if (
        register &&
        (!values.get("confirmPassword") ||
          values.get("confirmPassword") !==
            String(values.get("password") ?? ""))
      )
        next.confirmPassword = "Your passwords must match.";
      setErrors(next);
      if (Object.keys(next).length) {
        setMessage("Please fix the highlighted fields and try again.");
        const invalidField = e.currentTarget.elements.namedItem(
          Object.keys(next)[0],
        );
        if (invalidField instanceof HTMLElement) invalidField.focus();
        return;
      }
    }
    const form = e.currentTarget;
    const email = String(data.get("email") || "").trim();
    const remember = data.get("remember") === "on";
    setSubmitState("loading");
    setMessage(
      register
        ? "Setting up your demo profile…"
        : "Starting your demo session…",
    );
    // Simulate the preview flow without transmitting or retaining passwords.
    form.reset();
    setShowPassword(false);
    submitTimer.current = setTimeout(() => {
      signInDemo(email, remember);
      setSubmitState("success");
      setMessage(
        register
          ? "Demo sign-up successful! Taking you to the homepage…"
          : "Demo login successful! Taking you to the homepage…",
      );
      setAttraction("");
      setProvince("");
      redirectTimer.current = setTimeout(() => router.push("/"), 1000);
    }, 700);
  }
  return (
    <div
      className={
        register
          ? "flex min-h-dvh items-center justify-center bg-gradient-to-br from-gold/10 via-transparent to-indigo/10 px-4 py-6 sm:px-8 sm:py-8"
          : "shell py-10 sm:py-16"
      }
    >
      <div
        className={
          register
            ? "grid w-full max-w-[1040px] overflow-hidden rounded-3xl border border-slate/60 dark:border-slate/15 bg-panel shadow-soft lg:grid-cols-[0.85fr_1.15fr]"
            : "mx-auto grid max-w-[1000px] overflow-hidden rounded-2xl border border-slate/60 dark:border-slate/20 bg-panel shadow-soft lg:grid-cols-2"
        }
      >
        <div className="relative isolate hidden min-h-[640px] flex-col justify-end bg-navy p-10 text-white lg:flex">
          <img
            src="/images/l&s.png"
            alt="Cambodian dancer in blue and gold beside Angkor Wat and travel illustrations"
            width="1122"
            height="1402"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-brightgold">
            Your next chapter
          </p>
          <p className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
            A world of wonder.
            <br />A little closer.
          </p>
          <p className="mt-5 text-xs leading-7 text-white/70">
            Find the places you&apos;ll talk about for years.
            <br />
            Make your next journey a Vireyak journey.
          </p>
          <p className="mt-8 flex items-center gap-2 text-[10px] text-white/70">
            <Icon name="pin" size={14} /> Angkor Wat, Siem Reap
          </p>
        </div>
        <div
          className={
            register
              ? "mx-auto flex w-full max-w-xl flex-col justify-center px-6 py-7 sm:px-10 sm:py-8"
              : "flex flex-col justify-center p-6 sm:p-10"
          }
        >
          {register && (
            <Link
              href="/"
              className="mb-5 w-fit text-xs font-medium text-ink/60 transition-colors hover:text-gold"
            >
              ← Back to Vireyak
            </Link>
          )}
          <p className="eyebrow mb-3">
            {register ? "Begin something beautiful" : "Good to see you again"}
          </p>
          <h1 className="section-title">
            {register ? "Your journey starts here." : "Welcome back."}
          </h1>
          <p
            className={
              register
                ? "mb-4 mt-2 text-sm leading-6 text-ink/60"
                : "mb-6 mt-3 text-xs leading-6 text-ink/60"
            }
          >
            {register
              ? "Try sign-up with demo details. This creates a local demo session, not a real account. Passwords are never saved."
              : "Try login with demo details. This starts a local demo session; passwords are not verified or saved."}
          </p>
          <form
            onSubmit={submit}
            aria-busy={submitState === "loading"}
            noValidate
            className={
              register
                ? "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 [&>*]:col-span-full"
                : "space-y-4"
            }
          >
            {register && (
              <label className="block">
                <span className="field-label">Full name</span>
                <input
                  name="name"
                  onChange={() =>
                    setErrors((previous) => ({ ...previous, name: "" }))
                  }
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Your name"
                  className="field"
                />
                {fieldError("name")}
              </label>
            )}
            <label className="block">
              <span className="field-label">Email address</span>
              <input
                name="email"
                onChange={() =>
                  setErrors((previous) => ({ ...previous, email: "" }))
                }
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                className="field"
              />
              {fieldError("email")}
            </label>
            <label
              className={register ? "block min-w-0 sm:!col-span-1" : "block"}
            >
              <span className="field-label">Password</span>
              <span className="relative block">
                <input
                  name="password"
                  onChange={() =>
                    setErrors((previous) => ({
                      ...previous,
                      password: "",
                      confirmPassword: "",
                    }))
                  }
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  required
                  minLength={register ? 12 : 8}
                  maxLength={128}
                  placeholder={
                    register ? "12+ characters" : "Enter a demo password"
                  }
                  className="field pr-16"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 text-[10px] font-medium text-indigo dark:text-brightgold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              {fieldError("password")}
            </label>
            {register && (
              <>
                <label className="block min-w-0 sm:!col-span-1">
                  <span className="field-label">Confirm password</span>
                  <input
                    name="confirmPassword"
                    onChange={() =>
                      setErrors((previous) => ({
                        ...previous,
                        confirmPassword: "",
                      }))
                    }
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    maxLength={128}
                    className="field"
                    placeholder="Repeat password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirmPassword-error"
                        : undefined
                    }
                  />
                  {fieldError("confirmPassword")}
                </label>
                {provinces.length > 0 && (
                  <div className="block">
                    <label htmlFor="province-interest" className="field-label">
                      Province of interest (optional)
                    </label>
                    <Dropdown
                      id="province-interest"
                      label="Province of interest (optional)"
                      name="province"
                      value={province}
                      onChange={(value) => {
                        setProvince(value);
                        setAttraction("");
                      }}
                      describedBy="attraction-help"
                      options={[
                        { value: "", label: "All provinces" },
                        ...provinces.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                      ]}
                    />
                  </div>
                )}
                <div className="block">
                  <label htmlFor="attraction-interest" className="field-label">
                    Attraction of interest (optional)
                  </label>
                  <Dropdown
                    id="attraction-interest"
                    label="Attraction of interest (optional)"
                    name="attraction"
                    value={attraction}
                    onChange={setAttraction}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loadState !== "ready" || !attractions.length}
                    describedBy="attraction-help"
                    options={[
                      {
                        value: "",
                        label:
                          loadState === "loading"
                            ? "Loading attractions…"
                            : "Choose an attraction",
                      },
                      ...visibleAttractions.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                  />
                </div>
                <p
                  id="attraction-help"
                  className="text-xs text-ink/65"
                  role="status"
                >
                  {loadState === "error"
                    ? "Attractions could not be loaded. You can continue without selecting one."
                    : loadState === "ready" && !attractions.length
                      ? "No attractions are available yet. You can continue without selecting one."
                      : "Optional preview preference; not saved."}
                </p>
                {loadState === "error" && (
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => {
                      setLoadState("loading");
                      setAttempt(attempt + 1);
                    }}
                  >
                    Retry attractions
                  </button>
                )}
              </>
            )}
            {!register && (
              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  name="remember"
                  aria-label="Remember me"
                  className="h-4 w-4 accent-indigo dark:accent-brightgold"
                />
                <span className="text-[11px] font-medium text-ink/70">
                  Remember me
                </span>
              </label>
            )}
            <button
              type="submit"
              disabled={submitState !== "idle"}
              className="button-primary w-full disabled:cursor-wait disabled:opacity-75"
            >
              {submitState === "loading"
                ? register
                  ? "Signing up…"
                  : "Logging in…"
                : submitState === "success"
                  ? "Success!"
                  : register
                    ? "Create account"
                    : "Log in"}
              {submitState === "loading" ? (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin"
                />
              ) : (
                <Icon
                  name={submitState === "success" ? "check" : "arrow"}
                  size={16}
                />
              )}
            </button>
            {message && (
              <p
                role="status"
                className="rounded-lg border border-slate/60 dark:border-slate/20 p-4 text-xs leading-6"
              >
                {message}
              </p>
            )}
          </form>
          <p className="mt-5 text-center text-xs text-ink/60">
            {register ? "Already have an account?" : "New to Vireyak?"}{" "}
            <Link
              href={register ? "/login" : "/register"}
              className="font-semibold text-indigo dark:text-brightgold"
            >
              {register ? "Log in" : "Sign up"}
            </Link>
          </p>
          <Link
            href="/stays"
            className="mt-3 text-center text-xs text-ink/60 underline underline-offset-4"
          >
            Keep exploring as a guest
          </Link>
        </div>
      </div>
    </div>
  );
}
