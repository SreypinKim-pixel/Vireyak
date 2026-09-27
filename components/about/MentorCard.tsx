import type { TeamMember } from "../../data/team";
import ProfileLinks from "./ProfileLinks";
import ProfilePhoto from "./ProfilePhoto";

/**
 * Highlighted mentor card, shown separately above the interactive team gallery.
 * Larger than a team panel, on a dark surface, with gold accents and a dedicated
 * portrait frame for the mentor's photo, so the mentor reads as the profile the
 * six team panels sit under. It deliberately has none of the gallery's
 * hover, expansion, or photo zoom behaviour.
 *
 * Expected shape (see data/team.ts): { id, name, role, bio, photo, links }
 */
export default function MentorCard({ mentor }: { mentor?: TeamMember | null }) {
  if (!mentor) return null;
  return (
    <article className="relative isolate overflow-hidden rounded-3xl border border-gold/30 bg-navy text-ivory shadow-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brightgold/60 to-transparent"
      />
      <div className="relative grid sm:grid-cols-[minmax(0,260px)_1fr] lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="relative h-full">
          <ProfilePhoto
            name={mentor.name}
            photo={mentor.photo}
            variant="portrait"
          />
        </div>
        <div className="p-7 sm:p-9 lg:p-11">
          <span className="inline-flex items-center gap-2 rounded-full border border-brightgold/30 bg-brightgold/15 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-brightgold">
            Mentor
          </span>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {mentor.name}
          </h3>
          <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-ivory/55">
            {mentor.role}
          </p>
          <p className="mt-5 max-w-2xl text-xs leading-7 text-ivory/70">
            {mentor.bio}
          </p>
          <ProfileLinks links={mentor.links} tone="dark" justify="start" />
        </div>
      </div>
    </article>
  );
}
