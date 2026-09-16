import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      ".next-production/**",
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  {
    // These are local, pre-sized inspiration images, not remote image endpoints.
    rules: { "@next/next/no-img-element": "off" },
  },
  {
    files: ["app/global-error.js"],
    // The root failure fallback deliberately works without the client router.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
];
export default config;
