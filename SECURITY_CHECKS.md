# Pre-push checks

- Next.js updated to 16.3.5 and React to 19.3.0; dependency installation reported zero known npm vulnerabilities.
- Production build passed after the framework upgrade.
- `.env`, dependencies, build output, and test artifacts are excluded from Git. Only the placeholder `.env.example` is included.
- The staged snapshot is scanned with Gitleaks before committing.

Outstanding validation: ESLint reports three `react-hooks/set-state-in-effect` errors in Navbar and TravelCard. The expanded dropdown browser suite has not yet been run against this final update. Publishing was requested before completing those follow-up checks. Booking and authentication remain previews.

Secret scanning is a preventive check, not a guarantee against every possible secret.
