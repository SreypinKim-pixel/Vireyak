"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { TeamMember } from "../../data/team";
import TeamGalleryCard, { ACTIVE_GROW } from "./TeamGalleryCard";

/**
 * Interactive team gallery: one horizontal row of cards where the card under the
 * pointer expands and the rest shrink to narrow panels.
 *
 * The row is plain flex and the cards keep a fixed height, so the pointer only
 * changes how much of the row's width each card asks for: every card sits at
 * `flex-grow: 1` and the active one at `flex-grow: ACTIVE_GROW`. That single
 * number is what the browser interpolates (see `.team-gallery-card` in
 * app/globals.css), so the active card opens and its neighbours compress in the
 * same layout pass, at the same speed — never one after the other, and never as
 * a jump to a new width. A transition always continues from the value on screen,
 * so a pointer that crosses several cards hands the space over smoothly however
 * fast it moves. The cards divide the width the row already has instead of
 * overflowing it.
 *
 * The width an open card settles on also decides the width of the caption inside
 * every card: `.team-gallery-caption` is laid out at `--team-gallery-panel-width`
 * (solved below from the row's own geometry, and re-solved whenever the row is
 * resized) instead of at the card's current width. That is what keeps the
 * member's name, role and bio from re-wrapping while the card's width is still
 * animating — the card reveals the copy it already has instead of re-flowing it
 * frame by frame, which is what made the text step vertically mid-transition.
 *
 * Mouse, touch, and keyboard all drive the same `activeIndex` state, and the row
 * holds at most one active card: the pointer only changes it by crossing a card
 * boundary, so moving around inside a card — or over its caption — leaves the
 * state, and the animation, alone. Crossing to another card sets the new card
 * directly: the state never passes through "nothing is active", which would
 * collapse the row before opening the next card.
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
  const rowRef = useRef<HTMLDivElement | null>(null);
  // Width of an open card, in pixels: the width every caption is laid out at.
  const [panelWidth, setPanelWidth] = useState(0);

  // An open card's width follows from the row's own geometry — the space the row
  // has, less the gaps and the borders a card cannot shrink past, divided by the
  // grow factors — so it is solved here instead of hard-coded per breakpoint, and
  // re-solved for every resize of the row.
  useEffect(() => {
    const row = rowRef.current;
    const first = row?.firstElementChild;
    if (!row || !(first instanceof HTMLElement)) return;

    const measure = () => {
      const count = row.childElementCount;
      const rowStyle = getComputedStyle(row);
      const cardStyle = getComputedStyle(first);
      const px = (value: string) => {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
      };
      const border =
        px(cardStyle.borderLeftWidth) + px(cardStyle.borderRightWidth);
      const padding = px(cardStyle.paddingLeft) + px(cardStyle.paddingRight);
      const gap = px(rowStyle.columnGap || rowStyle.gap);
      // A card can never shrink past its own border and padding, so that much of
      // the row is not part of the space the grow factors divide between them.
      const free =
        row.clientWidth - gap * (count - 1) - (border + padding) * count;
      if (count === 0 || free <= 0) return;
      // The active card keeps ACTIVE_GROW shares of the free space, and its
      // caption fills that share plus the card's padding, because a percentage
      // width inside the card resolves against its padding box.
      const open = (free * ACTIVE_GROW) / (ACTIVE_GROW + count - 1) + padding;
      setPanelWidth(Math.round(open * 100) / 100);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [members.length]);

  if (!Array.isArray(members) || members.length === 0) return null;

  // The captions are laid out at that width only while a card is open: a row at
  // rest has no open card, so every caption wraps inside its own narrow panel
  // exactly as it always has. Switching the variable on and off is what keeps the
  // two looks apart — an open card is never laid out at a panel width.
  const panelStyle =
    activeIndex !== null && panelWidth > 0
      ? ({
          "--team-gallery-panel-width": `${panelWidth}px`,
        } as CSSProperties)
      : undefined;

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
        ref={rowRef}
        className="flex h-[380px] min-w-[640px] gap-3 sm:h-[440px] lg:h-[520px] lg:min-w-0 lg:gap-4"
        style={panelStyle}
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
