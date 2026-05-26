# Content Engine

A social content engine: generate, edit, review/approve, and publish content
(carousels, videos, static images) across platforms.

## Status

- ✅ **Review page** (`preview.html`) — standalone, shareable feedback page.
  Per-slide and whole-carousel notes, Approve / Request changes, "Copy All
  Feedback", auto-saves to the browser. Open it directly or send it to a
  reviewer — no server or login needed.

## Roadmap

1. Foundation — Next.js + Supabase + Vercel
2. Carousel generator skill — outputs carousel JSON + rendered slides
3. ✅ Review / feedback page
4. Editor UI — whole-carousel + per-slide editing that regenerates
5. Video creation — Remotion
6. Calendar + publishing — approval status → schedule → Meta Ads / organic

## preview.html

Carousel data is embedded in the file (the `CAROUSELS` array). The carousel
generator will regenerate the file with real slide data and images injected.
