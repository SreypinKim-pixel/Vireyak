import type { DestinationPhoto } from "@/lib/destination-images";

export default function PhotoCredits({
  photos,
}: {
  photos: (DestinationPhoto | null)[];
}) {
  const unique = [
    ...new Map(
      photos
        .filter((photo) => photo !== null)
        .map((photo) => [photo.source, photo]),
    ).values(),
  ];
  if (!unique.length) return null;
  return (
    <details className="mt-6 text-xs leading-6 text-ink/65">
      <summary className="w-fit cursor-pointer rounded py-2 font-medium focus-visible:outline-offset-4">
        Photo credits
      </summary>
      <ul className="mt-2 space-y-1">
        {unique.map((photo) => (
          <li key={photo.source}>
            <a
              href={photo.source}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {photo.alt}
            </a>
            {" — "}
            {photo.credit}
            {photo.licenseUrl && (
              <>
                {" "}
                ·{" "}
                <a
                  href={photo.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {photo.license}
                </a>
              </>
            )}
            {" · Cropped to fit"}
          </li>
        ))}
      </ul>
    </details>
  );
}
