---
name: carousel-generator
description: "Turns a topic, source content, or repurposed ideas into a structured set of social carousels, writes them to data/carousels.json, regenerates the shareable preview.html review page, and opens it for feedback. Use when the user wants to create or update carousels for the content engine and collect approvals/revision notes."
allowed-tools: Read Write Bash Glob
metadata:
  author: content-engine
  version: "1.0"
---

# Carousel Generator

Produces carousels for the content engine and wires them into the review/feedback
page (`preview.html`). Pairs with `content-repurposer` (which supplies the ideas)
and feeds the review loop the user shares with clients.

## When to Use This Skill

- The user wants to create one or more carousels from a topic, brief, blog post,
  transcript, or the output of `content-repurposer`.
- The user wants to add/edit carousels in an existing project and re-generate the
  review page.

**DO NOT** use this for video scripts (`video-script`) or for raw repurposing of a
single source into many formats (`content-repurpose`). This skill consumes ideas
and produces carousel *structure*.

## The Data Contract

Everything is data. A carousel is a template fed by JSON — editing the JSON and
re-running the generator is the only way slides change. The schema written to
`data/carousels.json`:

```json
{
  "project": { "client": "string", "generatedAt": "YYYY-MM-DD" },
  "carousels": [
    {
      "id": "kebab-unique-id",
      "section": "GROUP HEADER (e.g. FUNNEL — LANDING PAGES)",
      "name": "Human carousel name",
      "slides": [
        { "heading": "Slide text", "kind": "Cover | Slide | CTA", "image": "slides/01.png (optional)" }
      ]
    }
  ]
}
```

Rules:
- `id` is unique and stable — reviewer notes are keyed to it, so do not renumber.
- First slide is usually `kind: "Cover"`, last is usually `kind: "CTA"`.
- `image` is optional. Omit it and the page renders a styled text placeholder, so
  the review loop works before any slide images are rendered.
- Group related carousels under the same `section` so they stack in the page.

## Phase 1: Brief

Gather (ask for anything missing):

1. **Client / project** — whose content is this?
2. **Source** — topic, brief, or a file path / pasted content to draw from.
3. **How many carousels** and roughly what each should cover.
4. **Slides per carousel** (default 4–6) and **funnel intent** (awareness, nurture, CTA).

Present the plan (sections + carousel names + slide counts) and **wait for confirmation**.

## Phase 2: Write the Carousel Structure

For each carousel:
- Write a scroll-stopping **Cover** line (the hook).
- 2–4 **body slides**, one idea each, short and punchy (these are slides, not paragraphs).
- A **CTA** slide (follow / comment keyword / link).
- Keep slide headings under ~12 words; they render large.

Assemble the full object and **write it to `data/carousels.json`** (merge with existing
carousels if updating — preserve existing `id`s).

## Phase 3: Generate & Review

Run the generator, then open the page:

```bash
node tools/generate-preview.mjs
open preview.html        # macOS; use the OS opener or a browser otherwise
```

Tell the user:
- The page is at `preview.html` — open it or send the file to a reviewer.
- They (or their client) add per-slide / whole-carousel notes, set Approve / Request
  changes, then hit **Copy All Feedback**.
- Paste that feedback back here and re-run this skill to revise — only the JSON changes.

## Recovery

- **Source too thin**: ask for more context before inventing slides — do not pad.
- **Broken generate**: the generator validates ids/slides and prints the exact problem;
  fix `data/carousels.json` and re-run.
- **User pasted feedback**: parse each `## Section / Name` block, apply slide/carousel
  notes to that `id`, regenerate.

## Anti-Patterns

- **DO NOT** hand-edit `preview.html` — it is generated; edit the JSON.
- **DO NOT** renumber or reuse `id`s — it detaches existing reviewer notes.
- **DO NOT** write paragraph-length slide headings — slides are punchy, one idea each.
