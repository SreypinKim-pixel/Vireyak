# Code and security review — 2026-09-16

> Historical review of the original storefront, before the Vireyak tourism
> redesign. The product/table UI has since been replaced, account forms no longer
> simulate success, and browser tests have been added. See README.md for the
> current structure. Next.js/React and nested PostCSS have since been updated,
> and ESLint configured. See SECURITY_CHECKS.md for the current pre-push checks.

Scope: application source, package manifest/lockfile, configuration, and local
file structure. No Git repository exists in this folder or its parents, so
tracked files, remotes, and commit history could not be inspected. Source
inspection found no apparent hardcoded credentials; this is not a guarantee
that all secrets have been detected. Generated dependencies/build output were
excluded from source review.

## Findings (highest priority first)

1. **High — vulnerable framework dependency.** `package.json` pins Next.js
   14.2.5. The App Router is affected by documented denial-of-service issues.
   Upgrade to a currently supported, patched release and validate the migration
   before deploying. The May 2026 advisory includes all 14.x versions, so a
   patch within 14.x is not enough for that advisory. Dependency migration was
   not performed as part of this review/environment setup.
   Sources: [Next.js December 2025 advisory](https://nextjs.org/blog/security-update-2025-12-11),
   [Vercel May 2026 release](https://vercel.com/changelog/next-js-may-2026-security-release).
2. **High if treated as production — authentication is simulated.**
   `app/login/page.js` and `app/register/page.js` report success after a delay
   for any input passing client validation. There is no authentication backend,
   session, persistence, or authorization. These are demo forms only. The README
   now explicitly documents this instead of implying that one API call is enough.
3. **Medium — linting is not provisioned.** `npm run lint` invokes `next lint`,
   but there is no ESLint configuration, `eslint`, or `eslint-config-next`
   dependency. Configure linting for the target framework version during the
   upgrade. There is also no automated test suite or CI configuration.
4. **Medium — sorting is mouse-only.** `app/table/TableClient.js` attaches click
   handlers directly to table headers. Use native buttons inside the headers,
   add `aria-sort`, and give the search input an accessible label. Placeholder
   text alone is not a persistent label.
5. **Low — storefront functionality is incomplete.** The product detail
   page's Add to Cart button has no handler; Notify Me is disabled when out
   of stock. These controls do not implement shopping behavior.
6. **Low — mobile layout needs work.** The navbar does not wrap or collapse,
   product details use a fixed two-column grid, and the table has no horizontal
   scrolling wrapper. These can overflow or become cramped on narrow screens.
7. **Low — images bypass the configured optimizer.** Product pages and Home
   use raw `img` elements without intrinsic dimensions. `images.remotePatterns`
   only affects `next/image`, so it does not restrict these browser requests.
8. **Low — root error fallback depends on unavailable styling.**
   `app/global-error.js` replaces the root layout but uses CSS class names whose
   stylesheet is imported by that layout. Provide self-contained fallback styles
   and an HTML language attribute.

## Structure assessment

The existing `app/`, `components/`, and `data/` split is appropriate for this
small demo. Routing, dynamic product lookup/404 handling, and the separation of
server pages from interactive client components are reasonable. No directory
reorganization is necessary. The README lists `public/`, but it does not
currently exist; create it only when adding public assets, never for secrets.

## Changes made

- Added an ignored `.env` with owner-only permissions and a placeholder-only
  `.env.example`. No unused credentials or fictional service settings were added.
- Added `.gitignore` and matching `.ignore` rules for common sensitive files
  and generated artifacts. Package manifests, lockfiles, and source stay visible.
- Corrected environment setup and authentication/security guidance in README.

Ignore rules are a preventive layer, not an absolute commit barrier. Content
scanning and server-side push protection are still needed to catch secrets
embedded in otherwise legitimate source files.

## Validation

- `CI=1 NEXT_TELEMETRY_DISABLED=1 npm run build` passed and generated all 15
  static pages. A successful build does not resolve the dependency advisories
  or establish that ESLint is configured.
- Tested the ignore rules using Git in an isolated temporary repository:
  26 sensitive/generated paths were ignored and 12 source/template paths
  remained visible, including `package-lock.json` and the root `.env.example`.
- Verified that `.ignore` matches `.gitignore` and `.env` permissions are `0600`.
- Scanned 19 source/configuration files, including the lockfile, for common
  credential patterns without printing values; no matches were found. This
  heuristic check cannot detect every secret and does not scan Git history.
