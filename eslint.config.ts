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
    rules: { "@next/next/no-img-element": "off" },
  },
  {
    files: ["app/global-error.tsx"],

    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
];
export default config;
