"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
import Icon from "../Icon";

// Deterministic tones: the same name always renders the same placeholder, on
// the server and in the browser, so there is no hydration mismatch.
const TONES = [
  { surface: "bg-gradient-to-br from-navy to-indigo", text: "text-ivory" },
  { surface: "bg-gradient-to-br from-indigo to-slate", text: "text-ivory" },
  { surface: "bg-gradient-to-br from-gold to-brightgold", text: "text-navy" },
  { surface: "bg-gradient-to-br from-slate to-navy", text: "text-ivory" },
];

// Image areas. Each variant carries its own position so a card face is never
// mixed with the in-flow `relative` frames, and each keeps one fixed frame size
// so cards in the same row never end up with mismatched photo heights.
// - cover: square tile, e.g. a card with the details underneath.
// - portrait: the mentor column, which fills its grid cell height from `sm` up.
// - fill: the whole card face, for the interactive gallery where the caption is
//   layered over the photo.
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

/**
 * Photo area for a team member or mentor.
 *
 * `photo` accepts either a static import — as data/team.ts does, e.g.
 * `import pinPhoto from "./image/Pin-Leader.JPG"` — or a plain path string for
 * a file in `public/`, for example `photo: "/images/team/member-1.jpg"`. Both
 * fill the frame with `object-cover` anchored to the top edge, so a portrait
 * shot with the face in the upper half keeps the head inside the frame.
 *
 * Until a photo is set — or if it fails to load — an initials placeholder is
 * shown instead, so the card never breaks and never shows a broken image.
 *
 * `variant` picks the frame: "cover" for a square tile, "portrait" for the
 * mentor column, and "fill" for the interactive gallery, where the photo is the
 * card face and the caption sits on top of it. All three crop with
 * `object-cover` anchored to the top edge.
 *
 * Gallery portraits stay at a fixed size while their parent layer is clipped
 * and translated to create the accordion expansion.
 */
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
      {/* Always rendered underneath, so it doubles as a placeholder while a real
          photo is still loading, and as the fallback if that photo fails. */}
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
