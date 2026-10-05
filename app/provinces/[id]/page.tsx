import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProvinceDetails, regions } from "@/lib/cam-trip";
import { getProvincePhoto, getAttractionPhoto } from "@/lib/destination-images";
import PhotoCredits from "@/components/home/PhotoCredits";
import DestinationImage from "@/components/home/DestinationImage";

export default async function ProvincePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProvinceDetails(id);
  if (!result) notFound();
  const { province, attractions, total, attractionsUnavailable } = result;
  const name = province.nameEn || province.nameKh;
  const provincePhoto = getProvincePhoto(name, province.imageUrl);
  const location = regions[province.region] || "Cambodia";
  return (
    <main className="shell py-10 sm:py-16">
      <Link
        href="/#featured-destinations-title"
        className="text-sm text-ink/60 hover:underline"
      >
        ← Featured destinations
      </Link>
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate/60 dark:border-slate/20 bg-panel">
        <DestinationImage
          src={provincePhoto?.src}
          fallbackSrc={provincePhoto?.backupSrc}
          title={provincePhoto?.alt}
          alt={name}
          width={1400}
          height={700}
          className="aspect-[2/1] w-full object-cover"
          fetchPriority="high"
        />
        <div className="p-6 sm:p-9">
          <p className="eyebrow">Province · {location}</p>
          <h1 className="section-title mt-3">{name}</h1>
          {province.nameKh && province.nameKh !== name && (
            <p lang="km" className="text-khmer mt-2 text-lg text-ink/60">
              {province.nameKh}
            </p>
          )}
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/70">
            {attractions.length
              ? `${name} highlights include ${attractions
                  .slice(0, 3)
                  .map((item) => item.nameEn || item.nameKh)
                  .join(", ")}.`
              : `${name} is in ${location}.`}
          </p>
          {total != null && (
            <p className="mt-4 text-sm font-semibold">{total} attractions</p>
          )}
        </div>
      </div>
      <section className="mt-12" aria-labelledby="province-attractions">
        <h2 id="province-attractions" className="section-title text-2xl">
          Explore {name}
        </h2>
        {attractionsUnavailable ? (
          <p role="status" className="mt-5 text-sm text-ink/60">
            Attractions are temporarily unavailable. Please try again later.
          </p>
        ) : attractions.length === 0 ? (
          <p className="mt-5 text-sm text-ink/60">
            More places to explore in {name} are coming soon.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {attractions.map((item) => {
              const title = item.nameEn || item.nameKh;
              const photo = getAttractionPhoto(title, name, item.imageUrls);
              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate/60 dark:border-slate/20 bg-panel"
                >
                  <DestinationImage
                    src={photo?.src}
                    fallbackSrc={photo?.backupSrc}
                    alt={photo?.alt || title}
                    width={600}
                    height={400}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="eyebrow">
                      {(item.category || "Attraction").replaceAll("_", " ")}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink/65">
                      {item.descriptionEn ||
                        item.descriptionKh ||
                        `${title}, ${name}, Cambodia.`}
                    </p>
                    {item.openingHours && (
                      <p className="mt-3 text-xs text-ink/60">
                        Hours: {item.openingHours}
                      </p>
                    )}
                    <a
                      className="mt-4 inline-flex text-sm font-semibold text-indigo dark:text-brightgold hover:underline"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title}, ${name}, Cambodia`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on map ↗
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {total != null &&
          total > attractions.length &&
          attractions.length > 0 && (
            <p className="mt-5 text-sm text-ink/60">
              Showing {attractions.length} of {total} attractions.
            </p>
          )}
      </section>
      <PhotoCredits
        photos={[
          provincePhoto,
          ...attractions.map((item) =>
            getAttractionPhoto(
              item.nameEn || item.nameKh,
              name,
              item.imageUrls,
            ),
          ),
        ]}
      />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProvinceDetails(id);
  if (!result) notFound();
  const name = result.province.nameEn || result.province.nameKh;
  return pageMetadata({
    title: `${name} Attractions & Travel Guide`,
    description: `Discover ${name}, Cambodia. Explore provincial highlights and attractions with Vireyak.`,
    path: `/provinces/${encodeURIComponent(id)}`,
    image: getProvincePhoto(name, result.province.imageUrl)?.src,
  });
}
