"use client";

import { useState } from "react";
import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { TeamMember } from "../../data/team";
import TeamGalleryCard from "./TeamGalleryCard";

/**
 * Interactive team gallery: one horizontal row of cards where the card under the
 * pointer expands and the rest shrink to narrow panels.
 *
 * The row is plain flex and the cards keep a fixed height, so the pointer only
 * changes how much of the row's width each card asks for: every card sits at
 * `flex: 1 1 0%` and the active one at `flex: 3.4 1 0%`. That single number is
 * what the browser interpolates (see `.team-gallery-card` in app/globals.css), so
 * the active card opens and its neighbours compress in the same layout pass, at
 * the same speed — never one after the other, and never as a jump to a new
 * width. It also keeps the row inside the page: the cards divide the width they
 * already have instead of overflowing it.
 *
 * Mouse, touch, and keyboard all drive the same `activeIndex` state, and the row
 * holds at most one active card: the pointer only changes it by crossing a card
 * boundary, so moving around inside a card — or over its caption — leaves the
 * state, and the animation, alone.
 * - mouse: hovering a card activates it; leaving the gallery restores equal widths
 * - touch/pen: tapping a card activates it; tapping elsewhere restores equal widths
 * - keyboard: a card activates when focused, Enter/Space toggles it, Escape
 *   clears it, and the left/right arrows move between cards
 *
 * On small screens the row keeps a usable minimum width and scrolls inside the
 * gallery (`overflow-x-auto`), so the page itself never scrolls sideways.
 */
export default function TeamGallery({
  members = [],
}: {
  members?: TeamMember[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!Array.isArray(members) || members.length === 0) return null;

  const handlePointerEnter = (
    event: ReactPointerEvent<HTMLElement>,
    index: number,
  ) => {
    // Only a real mouse drives the hover expansion; touch and pen select on tap,
    // so a tap cannot activate a card and immediately collapse it again.
    if (event.pointerType === "mouse") setActiveIndex(index);
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLElement>,
    index: number,
  ) => {
    if (event.pointerType !== "mouse") setActiveIndex(index);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setActiveIndex(null);
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    // React's onBlur is the bubbling focusout, so this fires for the whole row:
    // clear only once focus has moved outside the gallery.
    if (!event.currentTarget.contains(event.relatedTarget))
      setActiveIndex(null);
  };

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex((current) => (current === index ? null : index));
      return;
    }
    if (event.key === "Escape") {
      setActiveIndex(null);
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    // The cards are the direct children of the row, so the DOM is enough to find
    // the neighbour without keeping a ref for every card.
    const cards = event.currentTarget.parentElement?.children;
    if (!cards || cards.length === 0) return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + step + cards.length) % cards.length;
    const nextCard = cards[next];
    if (nextCard instanceof HTMLElement) nextCard.focus();
  };

  return (
    <div
      data-slot="team-gallery"
      className="mt-6 overflow-x-auto pb-2 lg:overflow-visible"
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="flex h-[380px] min-w-[640px] gap-3 sm:h-[440px] lg:h-[520px] lg:min-w-0 lg:gap-4"
        onBlur={handleBlur}
      >
        {members.map((member, index) => (
          <TeamGalleryCard
            key={member.id}
            member={member}
            index={index}
            active={activeIndex === index}
            collapsed={activeIndex !== null && activeIndex !== index}
            onPointerEnter={handlePointerEnter}
            onPointerUp={handlePointerUp}
            onFocus={setActiveIndex}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </div>
  );
}
