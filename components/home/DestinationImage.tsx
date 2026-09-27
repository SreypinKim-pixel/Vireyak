"use client";

import { useState } from "react";

export default function DestinationImage({
  src,
  alt,
  fallbackSrc,
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const imageSrc = [src, fallbackSrc].find(
    (candidate) => candidate && !failedSources.includes(candidate),
  );

  if (!imageSrc) {
    return (
      <div
        role="img"
        aria-label={`${alt} — image unavailable`}
        className={`flex items-center justify-center bg-surface p-6 text-center text-sm text-ink/60 ${props.className || ""}`}
        style={{ aspectRatio: `${props.width || 4} / ${props.height || 3}` }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => setFailedSources((failed) => [...failed, imageSrc])}
    />
  );
}
