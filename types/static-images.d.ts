// Type declarations for the image files bundled into `components/about/image/`.
//
// Next.js ships declarations for the lower-case extensions only (`*.png`,
// `*.jpg`, ...) in `next/image-types/global`. The team portraits keep the
// extensions they were captured with, including upper-case `.PNG` and `.JPG`
// ones, so `tsc` needs the matching declarations before those imports resolve.
// The shape mirrors Next.js: every image import yields a `StaticImageData`.
declare module "*.PNG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.JPG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.JPEG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}
