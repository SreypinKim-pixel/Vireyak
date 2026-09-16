"use client";
import Link from "next/link";
import Icon from "../components/Icon";
export default function Error({ reset }) {
  return (
    <div className="status-page">
      <Icon name="sun" size={42} className="text-gold" />
      <span className="eyebrow">Just a moment</span>
      <h1>A little pause in the journey.</h1>
      <p>
        Something didn&apos;t load as expected. Let&apos;s give it another try.
      </p>
      <div className="flex gap-3">
        <button className="button-primary" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="button-outline">
          Go home
        </Link>
      </div>
    </div>
  );
}
