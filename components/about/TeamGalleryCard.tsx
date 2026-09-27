import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { TeamMember } from "../../data/team";
import ProfileLinks from "./ProfileLinks";
import ProfilePhoto from "./ProfilePhoto";

/**
 * One card in the interactive team gallery.
 *
 * The photo is the card face and the caption is layered over it. A narrow panel
 * keeps the member's full name readable by running it down the card, while the
 * active card switches to a horizontal caption with room for the role and the
 * bio. Only the horizontal caption holds the <h3>, so each member is announced
 * once, with their full name, and the About page tests keep reading the same six
 * headings in the same order.
 *
 * States and motion are kept apart: the classes below carry only the two settled
 * states, and the `.team-gallery-*` classes in app/globals.css animate between
 * them, all with one duration and one curve. The six cards are one flex row, so
 * they open and close in the same layout pass instead of one after the other.
 *
 * The panel has a fixed height, the caption is layered over the photo, and the
 * bio unfolds inside that caption, so nothing a card shows can change the card's
 * own height: the movement stays horizontal. `data-active` feeds the photo zoom
 * from the gallery's active card — the same state as the layout — rather than
 * from CSS `:hover`, so the whole row has a single source of truth.
 *
 * Expected shape (see data/team.ts): { id, name, role, bio, photo, links }
 */
type TeamGalleryCardProps = {
  member: TeamMember;
  index: number;
  active: boolean;
  collapsed: boolean;
  onPointerEnter: (
    event: ReactPointerEvent<HTMLElement>,
    index: number,
  ) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>, index: number) => void;
  onFocus: (index: number) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>, index: number) => void;
};

export default function TeamGalleryCard({
  member,
  index,
  active,
  collapsed,
  onPointerEnter,
  onPointerUp,
  onFocus,
  onKeyDown,
}: TeamGalleryCardProps) {
  return (
    <article
      tabIndex={0}
      aria-label={`${member.name} — ${member.role}`}
      data-active={active ? "true" : "false"}
      onPointerEnter={(event) => onPointerEnter(event, index)}
      onPointerUp={(event) => onPointerUp(event, index)}
      onFocus={() => onFocus(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
      className={`team-gallery-card relative isolate min-w-0 basis-0 cursor-pointer overflow-hidden rounded-2xl border bg-navy outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        active
          ? "flex-[3.4_1_0%] border-brightgold/45 shadow-[0_24px_60px_-24px_rgba(14,13,21,0.5)]"
          : "flex-[1_1_0%] border-slate/20"
      } ${collapsed ? "opacity-90 saturate-[0.85]" : ""}`}
    >
      {/* The photo fills the panel and stays anchored to the top edge, so a face
          in the upper half of the shot stays visible at every card width. */}
      <ProfilePhoto name={member.name} photo={member.photo} variant="fill" />

      {/* Dark gradient so the caption stays readable over any photo. */}
      <span
        aria-hidden="true"
        className={`team-gallery-fade pointer-events-none absolute inset-0 block bg-gradient-to-t from-midnight/90 via-midnight/35 to-midnight/5 ${
          active ? "opacity-100" : "opacity-90"
        }`}
      />

      {/* Full details. The bio unfolds while the card is active, so the text
          grows with the card instead of popping in. */}
      <div
        className={`team-gallery-fade absolute inset-x-0 bottom-0 p-4 sm:p-5 ${
          collapsed
            ? "pointer-events-none translate-y-3 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <h3
          className={`team-gallery-name font-semibold tracking-tight text-ivory ${
            active ? "text-lg sm:text-xl" : "text-[13px] leading-5"
          }`}
        >
          {member.name}
        </h3>
        <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brightgold sm:text-[10px]">
          {member.role}
        </p>
        {/* `grid-rows-[0fr]` <=> `grid-rows-[1fr]` unfolds the bio to its own
            height, so the text tracks the card all the way open instead of
            being revealed early by a `max-height` taller than the text. */}
        <div
          className={`team-gallery-reveal grid ${
            active
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-[11px] leading-5 text-ivory/75 sm:leading-6">
              {member.bio}
            </p>
            <ProfileLinks links={member.links} tone="dark" justify="start" />
          </div>
        </div>
      </div>

      {/* Narrow panels keep the full name readable by running it down the card.
          Decorative: the <h3> above already carries the name. */}
      <div
        aria-hidden="true"
        className={`team-gallery-fade absolute inset-0 flex items-end justify-center p-3 ${
          collapsed
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <span className="max-h-full overflow-hidden text-[11px] font-medium tracking-wide text-ivory/90 [writing-mode:vertical-rl] rotate-180">
          {member.name}
        </span>
      </div>
    </article>
  );
}
