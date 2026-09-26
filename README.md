# Vireyak

A Cambodian tourism booking website built with Next.js App Router, React,
Tailwind CSS, and Poppins imported from Google Fonts.

## Run locally

Use Node.js 22.13 or newer (Node.js 24 recommended).

```bash
cp -n .env.example .env
chmod 600 .env
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables are currently required.
Google Fonts requires browser network access; a sans-serif fallback is provided.
Travel photography is stored locally in `public/images/`.

```bash
npm run build
npm start
```

Production builds use `.next-production/`, separate from development's `.next/`,
so an open development server does not overwrite the production check output.

## Design

The Royal Twilight palette lives in `tailwind.config.ts`; semantic light/dark
mappings live in `app/globals.css`.

| Token                | Light     | Dark      |
| -------------------- | --------- | --------- |
| Surface              | `#FBF9F6` | `#0E0D15` |
| Primary brand        | `#182346` | `#3D5387` |
| Secondary brand      | `#3D5387` | `#182346` |
| Luxury accent        | `#D4AF37` | `#F3CD5F` |
| Primary text         | `#0E0D15` | `#FBF9F6` |
| Muted/border palette | `#7C83AD` | `#7C83AD` |

White light-mode cards and a dark card surface supplement the supplied tokens.
Body copy uses translucent primary text for readability. The theme follows the
system preference on first visit; the navbar toggle persists a manual choice.

`components/Brand.tsx` contains the text wordmark and accepts a `logoSrc` prop
for a future image. Navbar and footer are shared through `app/layout.tsx`.

## Structure and behavior

- `app/page.tsx`: destination-led landing page with stay/experience search.
- `app/stays/`: destination, capacity, type, budget, and saved-favorite filters;
  sorting; stay details; estimated trip subtotal.
- `app/attraction/`: experience discovery, filtering, and detail pages.
- `app/about/`: brand story, thoughtful travel guidance, and FAQs.
- `app/login/`, `app/register/`: styled account previews with native validation.
- `components/`: shared navigation, footer, icons, cards, search, filters, and forms.
- `data/travel.ts`: explicitly illustrative stays, prices, ratings, and experiences.
- `public/images/README.md`: photo sources and licensing links.
- Legacy `/products`, `/products/:id`, and `/table` URLs redirect to `/stays`.

Favorites and the theme preference use local storage; neither requires an account.
Search dates and guest counts carry through to the trip preview. Dates do not
check real inventory. Subtotals exclude taxes and fees.

## Preview boundaries

This is a functioning discovery UI, not a live reservation service. All property
names, prices, ratings, reviews, and amenities are sample content. Accommodation
photographs are inspiration imagery, not verified pictures of those properties.
No booking, payment, session, or account is created. Account forms display an
honest unavailable message rather than simulated authentication success, and do
not send or store credentials. Do not enter real passwords.

Connect verified inventory and a server-side booking/authentication service before
launching. The framework is updated to Next.js 16.3.5 with React 19, including the patched
PostCSS dependency. No dependency overrides are required. Keep dependency audits current before each deployment.
See `REVIEW.md` for the historical review and `SECURITY_CHECKS.md` for the
pre-push checks.

## Environment and commit safety

`.env` is ignored and has owner-only permissions. `.env.example` must contain
placeholders only. Never expose secrets via `NEXT_PUBLIC_`, client props,
`next.config.ts`'s `env` option, or anything in `public/`.

`.gitignore` protects Git staging; `.ignore` mirrors its rules for compatible
search tools. Keep them synchronized. They exclude environment variants,
credentials, private keys, logs, databases, backups, dependency directories,
generated build output, and browser-test artifacts. Keep `package-lock.json`
committed for reproducible installs.

Ignore rules cannot detect secrets embedded in source, prevent force-adds, or
remove existing history. Review staged diffs and enable secret scanning and push
protection on the hosting service before publishing. If a credential was ever
committed, rotate it and address the repository history.

## Verification

```bash
npm run format:check
npm run lint
npm run audit:security
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
```

The browser tests start a production server on port 3100 and cover responsive
navigation, theme persistence, local images, filtering/sorting, favorites,
search-to-trip date propagation, trip estimates, account preview feedback,
legacy redirects, and missing pages. Screenshots are written to `/tmp/`.
`npm run lint` runs ESLint with Next.js core web vitals rules and rejects warnings.
Dropdowns share `components/Dropdown.tsx`, built with Radix Select: keyboard
navigation, typeahead, Escape/outside-click dismissal, focus restoration,
viewport-aware positioning, and Royal Twilight light/dark menus.

All application code and browser tests use TypeScript (`.ts` / `.tsx`). Run
`npm run typecheck` for strict project-wide type checking. PostCSS uses
`postcss.config.json` because Next.js does not load TypeScript PostCSS configs.

## Registration and province API previews

Registration includes inline name/email validation, a 12-character minimum password,
password confirmation, and an optional attraction selector fetched from
`GET /api/attractions`. Loading, empty, and failed requests are handled, with retry.
Credentials and preferences are neither sent nor stored; a valid submission explains
that account creation is unavailable. Replace this preview submission with the real
registration API when its endpoint and contract are provided.

The local demo APIs return `{ data: [...], demo: true }` from the curated catalog.
`GET /api/provinces/{id}/attractions` also returns a `province` object, or a JSON
404 for unknown IDs. Demo province IDs are `siem-reap`, `preah-sihanouk`,
`phnom-penh`, and `kampot`; they are not official administrative codes.
`/provinces/{id}/attractions` uses the same catalog lookup and shows the custom
404 for unknown provinces. Invalid `/attraction/{id}` URLs also show that page,
with Back Home and Explore Attractions links. These local endpoints can be replaced
with backend adapters once a real API host and response schema are supplied.
