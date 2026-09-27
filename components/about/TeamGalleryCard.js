import ProfileLinks from "./ProfileLinks";
import ProfilePhoto from "./ProfilePhoto";

/** Fixed-size layers slide and clip; no width, font-size, or flex animation. */
export default function TeamGalleryCard({
  member,
  index,
  count,
  activeIndex,
  onFocus,
  onKeyDown,
  onPointerUp,
}) {
  const active = activeIndex === index;
  const collapsed = activeIndex !== null && !active;
  const total = count + 2.4;
  const fraction =
    activeIndex === null ? 1 / count : (active ? 3.4 : 1) / total;
  const preceding =
    activeIndex === null
      ? index / count
      : (index + (activeIndex < index ? 2.4 : 0)) / total;
  return (
    <article
      tabIndex={0}
      aria-label={`${member.name} — ${member.role}`}
      data-active={active ? "true" : "false"}
      data-team-index={index}
      style={{
        "--team-fraction": fraction,
        "--team-preceding": preceding,
        "--team-index": index,
      }}
      onFocus={() => onFocus(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
      onPointerUp={onPointerUp}
      className="team-gallery-card absolute inset-y-0 left-0 isolate cursor-pointer overflow-hidden bg-navy outline-none"
    >
      <div className="team-gallery-image pointer-events-none absolute inset-y-0 left-0">
        <ProfilePhoto name={member.name} photo={member.photo} variant="fill" />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/35 to-midnight/5"
      />
      <div
        className={`team-gallery-details team-gallery-fade absolute inset-x-0 bottom-0 p-4 sm:p-5 ${active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <h3 className="text-lg font-semibold tracking-tight text-ivory sm:text-xl">
          {member.name}
        </h3>
        <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brightgold sm:text-[10px]">
          {member.role}
        </p>
        <p className="mt-3 text-[11px] leading-5 text-ivory/75 sm:leading-6">
          {member.bio}
        </p>
        <div inert={!active}>
          <ProfileLinks links={member.links} tone="dark" justify="start" />
        </div>
      </div>
      <div
        aria-hidden="true"
        className={`team-gallery-idle team-gallery-fade pointer-events-none absolute bottom-0 left-0 p-4 sm:p-5 ${activeIndex === null ? "opacity-100" : "opacity-0"}`}
      >
        <p className="truncate text-[13px] font-semibold leading-5 text-ivory">
          {member.name}
        </p>
        <p className="mt-1.5 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-brightgold">
          {member.role}
        </p>
      </div>
      <div
        aria-hidden="true"
        className={`team-gallery-spine team-gallery-fade pointer-events-none absolute inset-y-0 left-0 flex items-end justify-center p-3 ${collapsed ? "opacity-100" : "opacity-0"}`}
      >
        <span className="max-h-full overflow-hidden text-[11px] font-medium tracking-wide text-ivory/90 [writing-mode:vertical-rl] rotate-180">
          {member.name}
        </span>
      </div>
    </article>
  );
}
