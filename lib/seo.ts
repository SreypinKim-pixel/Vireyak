import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.SITE_URL || "https://vireyak-rust.vercel.app",
).origin;
export const siteDescription =
  "Explore Cambodia with Vireyak. Discover temples, provincial highlights, and places to stay, from Siem Reap and Phnom Penh to the coast.";

export function pageMetadata({
  title,
  description,
  path,
  image = "/images/thumbnail.png",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const socialTitle = `${title} | Vireyak`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Vireyak",
      title: socialTitle,
      description,
      url: path,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
