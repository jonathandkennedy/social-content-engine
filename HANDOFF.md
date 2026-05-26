# Content Engine — Handoff

> Read this first if you're picking up the project (new session, new agent, or
> future you). It captures the vision, what's built, how to run it, and what's next.

Last updated: 2026-05-25

---

## 1. What we're building

A **social content engine**: one place to **generate → edit → review/approve → publish**
social content (carousels, videos, static images) across platforms.

The defining feature is a **review/approval loop**: you send a link to a client, boss,
or partner; they leave feedback **per individual slide** and **for the whole carousel**,
and set Approve / Request changes. Their notes bundle into one block you paste back to
Claude Code to regenerate. After approval, organic content flows to a calendar to
schedule/post, and paid creative pushes into a Meta Ads campaign.

### Origin
Modeled on an Instagram reel by **Kyle Whitrow / nu-stimulus** (nustimulus.com). His
system = Claude Code generator skills + a static `preview.html` feedback page (notes
auto-saved to the browser, "Copy All Feedback" to bundle) + a separate calendar/publish
app. We're building our own version. The user also has a related PDF, "Content Dashboard
Guide," that walks through the Next.js + Supabase + Vercel + Instagram/YouTube API stack —
reuse it for the foundation.

### Core architecture idea
**Assets = data (JSON props) + a template.** A carousel is a template fed by JSON;
a video will be the same (Remotion). "Edit the whole carousel" = change shared props.
"Edit one slide" = change that slide's props. You edit *data*, never pixels. This is what
makes whole-carousel and per-slide editing trivial and keeps generation reproducible.

---

## 2. Current state (what works today)

| Piece | Status | Notes |
|---|---|---|
| Review / feedback page | ✅ Done | `preview.html` — standalone, browser-verified |
| Carousel data schema | ✅ Done | `data/carousels.json` |
| Preview generator | ✅ Done | `tools/generate-preview.mjs` (Node, no deps) |
| Carousel generator skill | ✅ Done | `skills/carousel-generator.md` |
| Next.js + Supabase app | ⛔ Not started | foundation for editor/calendar/publishing |
| Slide image rendering (PNG) | ⛔ Not started | Playwright screenshot of HTML slide templates |
| Editor UI | ⛔ Not started | whole-carousel + per-slide controls |
| Video creation | ⛔ Not started | Remotion |
| Calendar + publishing | ⛔ Not started | Meta Ads + organic (IG/YouTube) |

### The review page (`preview.html`) does:
- Carousels grouped by `section`, each slide a card (image or styled text placeholder).
- **Per-slide notes** + **whole-carousel note**.
- **Approve / Request changes** per carousel (card border turns green / amber).
- **Copy All Feedback** → bundles every note + status into one paste-ready block.
- **Auto-saves to the browser** (localStorage, key `carousel_feedback_v1`) — refresh-safe.
- No server, no login. Open the file or send it to a reviewer.

---

## 3. Repo & how to run

- **GitHub:** https://github.com/jonathandkennedy/social-content-engine (public)
- **Local:** `/Users/jonkennedy/retainer-reach/content-engine`
- Git identity is set **locally** to the GitHub no-reply email (real email stays private).

```bash
# Regenerate the review page after editing the data
node tools/generate-preview.mjs            # data/carousels.json -> preview.html
open preview.html                          # review in a browser (macOS)

# Generate from a different data file / output path
node tools/generate-preview.mjs data/other.json out.html
```

There are **no npm dependencies yet** — the generator is plain Node ESM. `ffmpeg`,
`whisper-cpp`, `gh`, and `agent-browser` are installed on this machine (used earlier
to analyze the source reel and to render-test the page).

---

## 4. File map

```
content-engine/
├─ preview.html                     # GENERATED — do not hand-edit
├─ data/
│  └─ carousels.json                # edit this, then re-run the generator
├─ templates/
│  └─ preview.template.html         # the page; data injected at /* __INJECTED_DATA__ */
├─ tools/
│  └─ generate-preview.mjs          # injects JSON -> template -> preview.html
├─ skills/
│  └─ carousel-generator.md         # Claude Code skill: brief -> JSON -> generate -> review
├─ README.md
├─ HANDOFF.md                       # this file
└─ .gitignore                       # excludes .env, node_modules, rendered slide PNGs
```

### Data schema (`data/carousels.json`)
```json
{
  "project": { "client": "string", "generatedAt": "YYYY-MM-DD" },
  "carousels": [
    {
      "id": "kebab-unique-id",          // stable! reviewer notes key off this
      "section": "GROUP HEADER",
      "name": "Human name",
      "slides": [
        { "heading": "Slide text", "kind": "Cover|Slide|CTA", "image": "slides/01.png (optional)" }
      ]
    }
  ]
}
```
`image` is optional — omit it and a styled text placeholder renders, so the review loop
works before any images exist. **Never reuse or renumber `id`s** (it detaches notes).

---

## 5. Decisions made

- **Build path:** full app (Next.js + Supabase + Vercel) is the target; we started with
  the file-based review page because it's the fastest path to the core review loop and the
  app will reuse the same data schema and template.
- **Visibility:** repo is **public** — never commit `.env`/secrets (`.gitignore` covers them).
- **Scope:** lives in `content-engine/`, separate from the unrelated `say-no-seo` WordPress
  theme in the parent folder.
- **User works light-coding** via Claude Code — write the code for them, keep steps simple,
  and verify things actually run (don't just hand over snippets).

---

## 6. Next steps (prioritized)

1. **Slide image rendering** — HTML/CSS slide templates (one component per `kind`) rendered
   to PNG via Playwright screenshot at 1080×1350. Write paths back into `carousels.json`
   `image` fields so the review page shows real slides. *Smallest next win; no app needed.*
2. **Scaffold Next.js + Supabase app** — follow the "Content Dashboard Guide" PDF for the
   stack. Tables: `projects`, `carousels`, `slides`, `feedback`, `approvals`, `schedule`.
   Serve the review page as a DB-backed route with shareable `/review/<token>` links so
   approvals persist server-side (not just localStorage).
3. **Editor UI** — whole-carousel controls (theme/palette, reorder, add/delete, regenerate
   all) + per-slide editing (inline text, swap/regenerate image, regenerate one slide).
4. **Video creation** — Remotion (video-as-React-props). Feed it with the user's existing
   `video-script-writer` skill output. v1 fallback: ffmpeg slideshow from carousel slides.
5. **Calendar + publishing** — approved organic → calendar → pick platform → edit Claude
   auto-caption → schedule/post (Instagram Graph API / YouTube Data API). Approved paid →
   Meta Marketing API to attach creative to an ad campaign.

---

## 7. Related assets the user already has (in ~/Downloads)

- `content-repurposer.md` — skill: one source → many platform formats. **Feeds ideas** into
  the carousel generator and video scripts.
- `video-script-writer.md` — skill: ready-to-film scripts with hooks, B-roll, timing.
  **Feeds** the video-creation step (#4).
- `Content Dashboard Guide — Free Guide.pdf` — step-by-step for the Next.js + Supabase +
  Vercel + Instagram/YouTube API + cron stack. **Use for the foundation** (#2) and the
  analytics side.

These three pair with `skills/carousel-generator.md` to form the generator layer:
repurpose → (carousel | video) → review → publish.
