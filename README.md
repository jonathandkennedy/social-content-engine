# Content Engine

A social content engine: generate, edit, review/approve, and publish content
(carousels, videos, static images) across platforms.

New here? Read **[HANDOFF.md](HANDOFF.md)** for the full picture.

## Status

- ✅ **Review page** (`preview.html`) — standalone, shareable feedback page.
  Per-slide and whole-carousel notes, Approve / Request changes, "Copy All
  Feedback", auto-saves to the browser. Open it directly or send it to a
  reviewer — no server or login needed.
- ✅ **Carousel generator** — `tools/generate-preview.mjs` + the
  `carousel-generator` skill turn `data/carousels.json` into the review page.

## Quick start

```bash
# Edit data/carousels.json, then regenerate the review page:
node tools/generate-preview.mjs
open preview.html
```

`preview.html` is **generated** — don't hand-edit it. Edit `data/carousels.json`
(or use the `carousel-generator` skill) and re-run the generator. Data is injected
into `templates/preview.template.html` at the `/* __INJECTED_DATA__ */` token.

## Roadmap

1. Foundation — Next.js + Supabase + Vercel
2. ✅ Carousel generator (JSON → review page) · next: render slides to PNG
3. ✅ Review / feedback page
4. Editor UI — whole-carousel + per-slide editing that regenerates
5. Video creation — Remotion
6. Calendar + publishing — approval status → schedule → Meta Ads / organic
