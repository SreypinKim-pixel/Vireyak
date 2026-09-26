"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "./Icon";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ register = false }) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function clearError(field) {
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  }

  function validate(form) {
    const email = (form.get("email") || "").trim();
    const password = form.get("password") || "";
    const next = {};
    if (!email) next.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email))
      next.email = "Enter a valid email address.";
    if (!password || !password.trim()) next.password = "Password is required.";
    else if (register && password.length < 12)
      next.password = "Password must be at least 12 characters.";
    if (register && !(form.get("name") || "").trim())
      next.name = "Full name is required.";
    return next;
  }

  function submit(e) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    setSubmitting(true);
    const nextErrors = validate(new FormData(form));
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || nextErrors.name) {
      setMessage("Please fix the highlighted fields and try again.");
    } else {
      setMessage(
        register
          ? "Account creation is not available yet. You can still explore all stays and experiences without an account."
          : "Your login information is valid. Authentication service is not connected yet.",
      );
      form.reset();
    }
    setSubmitting(false);
  }
  return (
    <div className="shell py-10 sm:py-16">
      <div className="mx-auto grid max-w-[1000px] overflow-hidden rounded-2xl border border-slate/20 bg-panel shadow-soft lg:grid-cols-2">
        <div className="relative isolate hidden min-h-[640px] flex-col justify-end bg-navy p-10 text-white lg:flex">
          <img
            src="/images/angkor.jpg"
            alt="The peaceful grounds of Angkor Wat"
            width="700"
            height="1000"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/30 to-navy/10" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-brightgold">
            Your next chapter
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
            A world of wonder.
            <br />A little closer.
          </h1>
          <p className="mt-5 text-xs leading-7 text-white/70">
            Find the places you&apos;ll talk about for years.
            <br />
            Make your next journey a Vireyak journey.
          </p>
          <p className="mt-8 flex items-center gap-2 text-[10px] text-white/70">
            <Icon name="pin" size={14} /> Angkor Wat, Siem Reap
          </p>
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="eyebrow mb-3">
            {register ? "Begin something beautiful" : "Good to see you again"}
          </p>
          <h2 className="section-title">
            {register ? "Your journey starts here." : "Welcome back."}
          </h2>
          <p className="mb-6 mt-3 text-xs leading-6 text-ink/60">
            {register
              ? "Make room for a little more adventure."
              : "Your next Cambodian escape is waiting."}
          </p>
          <p className="mb-6 rounded-lg bg-gold/10 px-4 py-3 text-[10px] leading-5 text-ink/65">
            Account preview only. Sign-in and registration are not connected
            yet. Please don&apos;t enter a real password.
          </p>
          <form onSubmit={submit} noValidate className="space-y-4">
            {register && (
              <label className="block">
                <span className="field-label">Full name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Your name"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={() => clearError("name")}
                  className={`field${errors.name ? " field-invalid" : ""}`}
                />
                {errors.name && (
                  <span id="name-error" className="field-error">
                    {errors.name}
                  </span>
                )}
              </label>
            )}
            <label className="block">
              <span className="field-label">Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={() => clearError("email")}
                className={`field${errors.email ? " field-invalid" : ""}`}
              />
              {errors.email && (
                <span id="email-error" className="field-error">
                  {errors.email}
                </span>
              )}
            </label>
            <label className="block">
              <span className="field-label">Password</span>
              <span className="relative block">
                <input
                  name="password"
                  aria-label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  required
                  minLength={register ? 12 : 1}
                  maxLength={128}
                  placeholder={
                    register
                      ? "At least 12 characters (demo only)"
                      : "Enter a demo password"
                  }
                  aria-invalid={errors.password ? "true" : undefined}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  onChange={() => clearError("password")}
                  className={`field pr-16${errors.password ? " field-invalid" : ""}`}
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
              {errors.password && (
                <span id="password-error" className="field-error">
                  {errors.password}
                </span>
              )}
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="button-primary w-full"
            >
              {register ? "Create account" : "Log in"}
              <Icon name="arrow" size={16} />
            </button>
            {message && (
              <p
                role="status"
                className="rounded-lg border border-slate/20 p-4 text-xs leading-6"
              >
                {message}
              </p>
            )}
          </form>
          <p className="mt-6 text-center text-[11px] text-ink/60">
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
            className="mt-6 text-center text-[11px] text-ink/50 underline underline-offset-4"
          >
            Keep exploring as a guest
          </Link>
        </div>
      </div>
    </div>
  );
}
