"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const image = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  useEffect(() => {
    if (image.current?.complete) {
      setStatus(image.current.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  return (
    <div
      className="absolute inset-0 bg-[#182346]"
      aria-busy={status === "loading"}
    >
      {status === "loading" && (
        <div
          data-testid="hero-image-skeleton"
          role={alt ? "status" : undefined}
          className="absolute inset-0 bg-gradient-to-br from-slate/30 via-indigo/50 to-navy motion-safe:animate-pulse"
        >
          {alt && <span className="sr-only">Loading {alt} image</span>}
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-28 space-y-3"
          >
            <div className="h-3 w-1/3 rounded-full bg-white/10" />
            <div className="h-7 w-2/3 rounded-lg bg-white/10" />
          </div>
        </div>
      )}
      <img
        ref={image}
        src={src}
        alt={alt}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`h-full w-full object-cover transition-[opacity,transform] duration-700 motion-reduce:transition-none ${status === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
      />
      {status === "error" && alt && (
        <span
          role="status"
          className="absolute inset-0 flex items-center justify-center px-6 text-sm text-white/60"
        >
          Photo unavailable
        </span>
      )}
    </div>
  );
}
