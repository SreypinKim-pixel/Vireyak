"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, KeyboardEvent } from "react";
import type { TeamMember } from "../../data/team";
import TeamGalleryCard from "./TeamGalleryCard";

/** The accordion is drawn with clipped layers, without resizing the layout. */
export default function TeamGallery({ members }: { members: TeamMember[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const activate = (index: number | null) => {
    clearTimeout(leaveTimer.current);
    setActiveIndex(index);
  };
  const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(leaveTimer.current);
    const { clientX: x, clientY: y } = event;
    // Ignore layout-generated boundary events and tiny pointer jitter. Only
    // intentional movement can switch the member while panels slide underneath.
    if (
      pointer.current &&
      Math.hypot(x - pointer.current.x, y - pointer.current.y) < 6
    )
      return;
    pointer.current = { x, y };
    const card = (event.target as Element).closest("[data-team-index]");
    if (card && event.currentTarget.contains(card))
      activate(Number((card as HTMLElement).dataset.teamIndex));
  };
  const handleKey = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Escape") activate(null);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(activeIndex === index ? null : index);
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const cards = event.currentTarget.parentElement!.children;
      const next =
        (index + (event.key === "ArrowRight" ? 1 : -1) + cards.length) %
        cards.length;
      (cards[next] as HTMLElement).focus();
    }
  };

  if (!Array.isArray(members) || members.length === 0) return null;
  return (
    <div
      data-slot="team-gallery"
      className="mt-6 overflow-x-auto pb-2"
      onPointerEnter={handlePointer}
      onPointerMove={handlePointer}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        pointer.current = null;
        leaveTimer.current = setTimeout(() => setActiveIndex(null), 100);
      }}
    >
      <div
        className="team-gallery-row relative h-[380px] min-w-[640px] overflow-hidden sm:h-[440px] lg:h-[520px] lg:min-w-0"
        style={
          {
            "--team-count": members.length,
            "--team-total": members.length + 2.4,
          } as CSSProperties
        }
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            activate(null);
        }}
      >
        {members.map((member, index) => (
          <TeamGalleryCard
            key={member.id}
            member={member}
            index={index}
            count={members.length}
            activeIndex={activeIndex}
            onFocus={activate}
            onKeyDown={handleKey}
            onPointerUp={(event) => {
              if (event.pointerType !== "mouse") activate(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
