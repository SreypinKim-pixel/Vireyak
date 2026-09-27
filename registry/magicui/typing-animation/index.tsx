"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ElementType, CSSProperties } from "react";
import styles from "./typing-animation.module.css";

export interface TypingAnimationProps {
  children: string;
  className?: string;
  delay?: number;
  step?: number;
  cursor?: string | null;
  respectReducedMotion?: boolean;
  as?: ElementType;
  style?: CSSProperties;
  "aria-label"?: string;
}

export const TypingAnimation = ({
  children,
  className,
  delay = 0,
  step = 0.02,
  cursor = "|",
  respectReducedMotion = true,
  as: Tag = "span",
  style,
  "aria-label": ariaLabel,
}: TypingAnimationProps) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const tokens = useMemo(
    () =>
      Array.from(children.matchAll(/\S+|\s+/gu), (match) => ({
        text: match[0],
        characters: Array.from(match[0]),
        offset: Array.from(children.slice(0, match.index)).length,
      })),
    [children],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Start with the client-side entrance, not while server HTML is hidden.
    wrapper.dataset.typingReady = "true";
    return () => {
      delete wrapper.dataset.typingReady;
    };
  }, []);

  return (
    <Tag
      ref={wrapperRef}
      data-respect-reduced-motion={respectReducedMotion}
      className={`${styles.wrapper} ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
    >
      {tokens.map(({ text, characters, offset }, tokenIndex) =>
        /^\s+$/.test(text) ? (
          text
        ) : (
          <span key={tokenIndex} className={styles.word}>
            {characters.map((char, i) => (
              <span
                key={i}
                className={styles.char}
                style={{ animationDelay: `${delay + (offset + i) * step}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        ),
      )}
      {cursor && (
        <span
          className={styles.cursor}
          aria-hidden="true"
          style={{
            animationDelay: `${delay + Array.from(children).length * step}s`,
          }}
        >
          {cursor}
        </span>
      )}
    </Tag>
  );
};

export default TypingAnimation;
