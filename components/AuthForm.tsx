"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInDemo, registerLocalAccount } from "../lib/demoSession";
import {
  loginSchema,
  registrationSchema,
  attractionOptionsSchema,
} from "@/lib/validation/auth";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
import { Apple } from "./auth/Apple";
import { Google } from "./auth/Google";
export default function AuthForm({ register = false }) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
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
  const [providerMessage, setProviderMessage] = useState("");
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
        const result = attractionOptionsSchema.safeParse(body);
        if (!result.success) throw new Error("Invalid attractions response");
        setAttractions(result.data.data);
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
    if (submitState === "loading" || submitState === "success") return;
    setMessage("");
    const data = new FormData(e.currentTarget);
    const result = (register ? registrationSchema : loginSchema).safeParse({
      name: data.get("name") ?? "",
      email: data.get("email") ?? "",
      password: data.get("password") ?? "",
      confirmPassword: data.get("confirmPassword") ?? "",
    });
    const next: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        next[field] ??= issue.message;
      }
      setErrors(next);
      setSubmitState("error");
      setMessage(
        `${register ? "Sign-up" : "Login"} failed. Please fix the highlighted fields and try again.`,
      );
      const invalidField = e.currentTarget.elements.namedItem(
        Object.keys(next)[0],
      );
      if (invalidField instanceof HTMLElement) invalidField.focus();
      return;
    }
    setErrors({});
    const form = e.currentTarget;
    const { email, password } = result.data;
    const remember = data.get("remember") === "on";
    setSubmitState("loading");
    setMessage(
      register
        ? "Setting up your demo profile…"
        : "Starting your demo session…",
    );

    setShowPassword(false);
    submitTimer.current = setTimeout(async () => {
      try {
        if (register) {
          await registerLocalAccount(email, password);
        } else if (!(await signInDemo(email, password, remember))) {
          setSubmitState("error");
          setMessage("Login failed. Incorrect email or password.");
          return;
        }
      } catch (error) {
        setSubmitState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to save your account. Enable browser storage and try again.",
        );
        return;
      }
      form.reset();
      setSubmitState("success");
      setMessage(
        register
          ? "Sign-up successful! Please log in to continue."
          : "Login successful! Taking you to the homepage…",
      );
      setAttraction("");
      setProvince("");
      redirectTimer.current = setTimeout(
        () => router.push(register ? "/login" : "/"),
        1000,
      );
    }, 700);
  }
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-gold/10 via-transparent to-indigo/10 px-4 py-6 sm:px-8 sm:py-8">
      <div className="grid w-full max-w-[1040px] overflow-hidden rounded-3xl border border-slate/60 dark:border-slate/15 bg-panel shadow-soft sm:min-h-[820px] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative isolate hidden min-h-[640px] flex-col justify-end bg-navy p-10 text-white lg:flex">
          <img
            src="/images/l&s.png"
            alt="Cambodian dancer in blue and gold beside Angkor Wat and travel illustrations"
            width="1122"
            height="1402"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
          <p className="text-xs uppercase tracking-[0.2em] text-brightgold">
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
          <p className="mt-8 flex items-center gap-2 text-xs text-white/70">
            <Icon name="pin" size={14} /> Angkor Wat, Siem Reap
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-xl flex-col justify-center px-6 py-7 sm:px-10 sm:py-8">
          <Link
            href="/"
            className="mb-5 w-fit text-xs font-medium text-ink/60 transition-colors hover:text-gold"
          >
            ← Back to Vireyak
          </Link>
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
              ? "Create a local account, then log in with the same email and password. Accounts are saved only in this browser; use a sample password."
              : "Log in with your registered account or the demo account on this browser."}
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
                  minLength={register ? 12 : undefined}
                  maxLength={128}
                  placeholder={
                    register ? "12+ characters" : "Enter your password"
                  }
                  className="field pr-16"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 text-xs font-medium text-indigo dark:text-brightgold"
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
                <div className="block">
                  <label htmlFor="province-interest" className="field-label">
                    Province of interest (optional)
                  </label>
                  <Dropdown
                    id="province-interest"
                    label="Province of interest (optional)"
                    name="province"
                    disabled={loadState !== "ready" || !provinces.length}
                    value={province}
                    onChange={(value) => {
                      setProvince(value);
                      setAttraction("");
                    }}
                    describedBy="attraction-help"
                    options={[
                      {
                        value: "",
                        label:
                          loadState === "loading"
                            ? "Loading provinces…"
                            : "All provinces",
                      },
                      ...provinces.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                  />
                </div>
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
                <span className="text-xs font-medium text-ink/70">
                  Remember me
                </span>
              </label>
            )}
            <button
              type="submit"
              disabled={submitState === "loading" || submitState === "success"}
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
                role={submitState === "loading" ? "status" : "alert"}
                aria-atomic="true"
                className={`rounded-lg border p-4 text-sm leading-6 ${submitState === "success" ? "border-green-600/40 bg-green-600/10 text-green-800 dark:text-green-200" : submitState === "error" ? "border-red-600/40 bg-red-600/10 text-red-800 dark:text-red-200" : "border-slate/60 dark:border-slate/20"}`}
              >
                {message}
              </p>
            )}
          </form>
          {!register && (
            <div className="mt-5">
              <div className="mb-4 flex items-center gap-3 text-xs text-ink/50">
                <span className="h-px flex-1 bg-border" />
                <span>Or continue with</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { name: "Google", Logo: Google },
                  { name: "Apple", Logo: Apple },
                ].map(({ name, Logo }) => (
                  <button
                    key={name}
                    type="button"
                    className="button-outline w-full gap-2.5"
                    disabled={
                      submitState === "loading" || submitState === "success"
                    }
                    aria-describedby="provider-help"
                    onClick={() =>
                      setProviderMessage(
                        `${name} sign-in is not connected yet. Use the demo login or continue as a guest.`,
                      )
                    }
                  >
                    <Logo
                      className="h-5 w-5 shrink-0"
                      aria-hidden="true"
                      focusable="false"
                    />
                    Continue with {name}
                  </button>
                ))}
              </div>
              <p
                id="provider-help"
                role="status"
                className="mt-3 text-center text-xs leading-5 text-ink/60"
              >
                {providerMessage || "Google and Apple sign-in are coming soon."}
              </p>
            </div>
          )}
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
