"use client";

import { useState } from "react";

export default function DestinationImage({
  src,
  alt,
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  alt: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
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
    <img {...props} src={src} alt={alt} onError={() => setFailedSrc(src)} />
  );
}
