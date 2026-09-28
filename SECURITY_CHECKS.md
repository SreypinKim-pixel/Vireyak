# Pre-push checks — 2026-09-26

- All application code and browser tests use TypeScript with strict project-wide checking.
- Type checking, ESLint (zero warnings), formatting, and production build passed.
- All 7 Playwright browser tests passed, covering navigation, themes, mobile layout, calendars, search, booking previews, filtering, favorites, and dropdown keyboard interaction.
- `npm audit --audit-level=low` reported zero known vulnerabilities.
- `.env`, credentials, dependencies, build output, and test artifacts are excluded from Git. Only the placeholder `.env.example` is included; no ignored files are tracked.
- The local `.env` has owner-only permissions (`0600`).
- Gitleaks 8.30.1 found no secrets in the working snapshot or the 3 commits in `Pin` history. The staged snapshot is also scanned before committing.
- Repository visibility is unchanged, as requested. Ignore rules protect local files from normal staging; they do not make repository content private.

Booking and authentication remain previews. Theme and favorites are stored locally in the browser. The site still uses external resources and links (Google Fonts, avatar images, maps, and travel links), and server-side destination API requests.

Secret scanning and passing tests reduce risk but cannot guarantee that every secret or runtime error has been detected.
