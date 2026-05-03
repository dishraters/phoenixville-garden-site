# Phoenixville Dream Garden

Static website for an 18 ft × 24 ft Phoenixville, PA garden plan.

## What it includes
- Planting layout for tomatoes, peppers, cucumbers, beans, greens, roots, squash, herbs, and pollinator flowers.
- Phoenixville-oriented season roadmap.
- Weekly garden growth tracker with browser-local saved entries, photo uploads, search, delete, and JSON export.

## Run locally

```bash
python3 -m http.server 8124 --directory father-in-law-garden
```

Then open `http://127.0.0.1:8124`.

## Notes
- Tracker data is stored in the browser’s local storage for the current device/browser.
- For real public sharing, deploy as a static site and replace local storage with a hosted database or Google Sheet sync.
