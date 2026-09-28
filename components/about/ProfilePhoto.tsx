"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
import Icon from "../Icon";

const TONES = [
  { surface: "bg-gradient-to-br from-navy to-indigo", text: "text-ivory" },
  { surface: "bg-gradient-to-br from-indigo to-slate", text: "text-ivory" },
  { surface: "bg-gradient-to-br from-gold to-brightgold", text: "text-navy" },
  { surface: "bg-gradient-to-br from-slate to-navy", text: "text-ivory" },
];

const VARIANTS: Record<"cover" | "portrait" | "fill", string> = {
  cover: "relative aspect-square w-full",
  portrait:
    "relative aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-[300px] lg:min-h-[360px]",
  fill: "absolute inset-0",
};

function initialsOf(name: string) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function toneFor(name: string) {
  const value = String(name || "");
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 4096;
  }
  return hash % TONES.length;
}

function photoSourceOf(photo: StaticImageData | string | null) {
  if (typeof photo === "string" && photo.length > 0) {
    return { src: photo, width: 800, height: 800 };
  }
  if (photo && typeof photo === "object" && typeof photo.src === "string") {
    return {
      src: photo.src,
      width: Number.isFinite(photo.width) ? photo.width : 800,
      height: Number.isFinite(photo.height) ? photo.height : 800,
    };
  }
  return null;
}

export default function ProfilePhoto({
  name,
  photo = null,
  variant = "cover",
}: {
  name: string;
  photo?: StaticImageData | string | null;
  variant?: "cover" | "portrait" | "fill";
}) {
  const [failed, setFailed] = useState(false);
  const tone = TONES[toneFor(name)];
  const image = photoSourceOf(photo);
  const showPhoto = image !== null && !failed;
  const isGalleryFace = variant === "fill";

  return (
    <span
      data-slot="profile-photo"
      className={`block overflow-hidden ${VARIANTS[variant] || VARIANTS.cover} ${tone.surface} ${tone.text}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center"
      >
        <Icon
          name="users"
          size={118}
          className="pointer-events-none absolute -bottom-6 -right-4 opacity-[0.12]"
        />
        <span className="relative text-4xl font-semibold tracking-tight">
          {initialsOf(name)}
        </span>
      </span>
      {showPhoto ? (
        <img
          src={image.src}
          alt=""
          aria-hidden="true"
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-top ${
            isGalleryFace
              ? "team-gallery-photo"
              : "transition duration-500 ease-out motion-reduce:transition-none motion-safe:group-hover:scale-105"
          }`}
        />
      ) : null}
    </span>
  );
}
