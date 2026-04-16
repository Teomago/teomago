# RFC-002-audit — Core Schema & "Dark-Grim" RPG Design
**Auditor:** Claude (Phase 2)
**Date:** 2026-04-15
**RFC:** `.agents/specs/RFC-002-core-schema-and-design.md`
**Status:** REQUIRES CHANGES BEFORE EXECUTION

---

## Context Note — RFC-001 Correction

RFC-001 decision file (Step 8) specified Tailwind v3 init commands (`tailwindcss init -p`). The actual installed version is **Tailwind v4.2.2**. This is not a blocker for RFC-002 — it's a correction to note:

- v4 does NOT use `tailwind.config.ts` for most configuration.
- v4 theme customization uses `@theme` blocks inside CSS (`globals.css`).
- v4 PostCSS plugin is `@tailwindcss/postcss`, not `autoprefixer`. Confirmed working in FJPP (sister project).
- The latest `shadcn@latest` supports Tailwind v4. Confirmed working in FJPP.

RFC-001 decision file Step 8 should be updated to reflect v4 before archiving.

---

## Context Note — Profile & Project Research (Added 2026-04-15)

Auditor reviewed `.agents/context/Teomago Profile/Instructions.md` and the two live project codebases (`/github/FJPP`, `/github/eterhub`). Key findings that affect RFC-002:

### Confirmed technical patterns (from FJPP & HeionHub)
- `@payloadcms/storage-s3` is the correct package for R2 (not `storage-r2`). Requires `forcePathStyle: true` in config.
- `sharp` must be explicitly imported and passed to `buildConfig({ sharp })`.
- `framer-motion` import: `from 'framer-motion'` (not `motion/react`). FJPP uses this pattern in production.
- Tailwind v4 + `@tailwindcss/postcss` + shadcn confirmed working together in FJPP.
- `defaultValue` on Payload fields is the established content-fallback pattern (confirmed in FJPP's `HomePage.ts`).
- next-intl routing structure confirmed from HeionHub — `defaultLocale` must be `'es'` for teomago (HeionHub uses `'en'`).

### Teo's content strategy (explicit requirement from Instructions.md)
- **No lorem ipsum.** Every visible field must have a real `defaultValue` with pre-filled content.
- **Image fallback:** if no media uploaded → show default mockup URL (`https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24`).
- This pattern must be implemented both at the Payload field level (`defaultValue`) and in the Next.js component level (fallback render logic).

### Page narrative & section order
Single homepage only. Sections in this exact order:
1. Hero — who Teo is
2. Programming work (Quests)
3. Music & Arts (Stats + thesis Quest)
4. Coffee / Lighthouse (Campaigns or dedicated section)

### Project display order (Quests)
Priority: fjpp.vercel.app → heionhub.com → Master's thesis → Canadian College SPC → others

### Important personal context
- Teo graduates Master in Arts Education, Universidad Nacional — **April 22, 2026**
- The RPG "character sheet" metaphor is NOT arbitrary — it mirrors Teo's actual Master's thesis, which used RPG framing as a pedagogical methodology (thesis title: *Realidad, Memoria y Creencia: Semillas resonantes*)
- Music work is at Vineyard Bogotá church (spiritual + community significance, not just professional)
- Lighthouse Coffee / Tercer Puerto SAS is an active dream but not currently operating

---

## Summary

RFC-002 is creatively well-defined and the RPG aesthetic is clear. However, it has **3 blocking issues** and several structural gaps that would leave the Executor with ambiguities that require improvisation — which violates the pipeline rules. The recommended fix is to keep everything within RFC-002 but split execution into **3 phases** (schema → seed+layout → animation/polish).

---

## Recommended Execution Phases

Split the Implementation Plan into three ordered phases within this RFC:

| Phase | Name | Scope |
|-------|------|-------|
| **2A** | Schema | Media collection, Hero Global, Quests, Stats, Campaigns — all with explicit localization fields |
| **2B** | Frontend Skeleton | next-intl completion, `[locale]/layout.tsx`, homepage sections with static/seed data, Void Forge theme tokens |
| **2C** | Polish | framer-motion animations, responsive layout, ES/EN toggle UI, final success criteria check |

Each phase is a complete, independently reviewable deliverable.

---

## Findings

### CRITICAL — Blocking (must resolve before Phase 3)

#### C-04: Fallback content strategy not specified (new — from profile review)
**Standard violated:** Planning (missing explicit requirement)
**Detail:** Teo's `Instructions.md` explicitly states: pre-fill every field with real content as `defaultValue`, not lorem ipsum. If no image is uploaded, show the mockup URL. If no text is set in the CMS, show the pre-filled text. This is a **two-layer fallback**:
1. **Payload layer:** every field must declare a `defaultValue` with real content.
2. **Next.js layer:** component renders fallback if Payload returns null/empty.

This pattern is already established in FJPP (`HomePage.ts` uses `defaultValue` on every field, `Hero.tsx` uses `|| 'fallback'` in JSX). RFC-002 makes no mention of it.

**Action required:** Add a "Content Defaults" section to the RFC specifying:
- Default text for each Hero field (bio, role, stats).
- The mockup image URL as the default for all upload fields: `https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24`
- Component-level fallback pattern mirroring FJPP's Hero.tsx approach.

---

#### C-01: `Media` upload collection is missing from the schema
**Standard violated:** Planning (incomplete spec)
**Detail:** `Hero.avatar` and `Quests.coverImage` both declare `upload: media`, but no `Media` collection is defined anywhere in the RFC. Payload requires an explicit `Media` collection to handle file uploads. Without it, the `upload` fields will throw a configuration error at server start.

**Action required:** Add a `Media` collection to Section 1 with at minimum:
- `alt` (text, required)
- Upload handler pointing to R2 (already configured in RFC-001)

---

#### C-02: Localization scope per field is unspecified
**Standard violated:** Planning (ambiguity → forces Executor to improvise)
**Detail:** The RFC states "All collections will support localization (ES/EN)" but Payload localization is applied at the **field level**, not the collection level. Each field must explicitly declare `localized: true` or not. Getting this wrong causes data model corruption that requires a full migration to fix.

Required decisions per field:

| Collection | Field | Localize? | Reasoning |
|---|---|---|---|
| Hero | `name` | NO | Proper name, language-agnostic |
| Hero | `role` | YES | Job title differs per language |
| Hero | `bio` | YES | Rich text, language-specific |
| Hero | `avatar` | NO | Media, language-agnostic |
| Hero | `stats` → `statName` | YES | Display label |
| Hero | `stats` → `value` | NO | Number |
| Hero | `socialLinks` | NO | URLs are universal |
| Quests | `title` | YES | |
| Quests | `slug` | **NO** | URL segment — must not be localized |
| Quests | `category` | NO | Select value used for filtering |
| Quests | `description` | YES | |
| Quests | `coverImage` | NO | |
| Quests | `stack` → `techName` | NO | Tech names are universal |
| Quests | `link` | NO | |
| Quests | `status` | NO | Enum value |
| Stats | `name` | YES | Display label |
| Stats | `level` | NO | Number |
| Stats | `category` | NO | Enum |
| Stats | `icon` | NO | Icon name string |
| Campaigns | `company` | NO | Proper name |
| Campaigns | `role` | YES | Job title |
| Campaigns | `startDate` / `endDate` | NO | Dates |
| Campaigns | `description` | YES | |
| Campaigns | `questRewards` → `achievementName` | YES | |

**Action required:** Add the localization column to each field definition in the RFC.

---

#### C-03: `Stats.icon` field type is an anti-pattern
**Standard violated:** Planning (unimplementable as specified)
**Detail:** `icon (select: lucide-react icons)` would require a Payload select with 1,000+ hardcoded options. This is not implementable as a `select` field. Options:

1. **`text` field** — store the icon name as a string (e.g., `"Code"`, `"Music"`). Validate against a curated allow-list via a custom Payload validator.
2. **`select` with curated subset** — define 15-20 relevant icons in the RFC that cover the portfolio's actual skill categories.

**Action required:** Choose one approach and list the allowed icon names explicitly.

---

### HIGH — Should fix before execution

#### H-01: No `isCurrent` indicator on `Campaigns`
**Detail:** `endDate` is optional but the schema has no explicit way to represent "I currently work here." If `endDate` is null, is that "current" or "not specified"? This ambiguity breaks the frontend timeline logic.

**Recommendation:** Add `isCurrent (checkbox, default: false)`. When true, the frontend shows "Present" and `endDate` is hidden/disabled via a Payload `condition`.

---

#### H-02: `Quests.slug` needs auto-generation specified
**Detail:** Slug fields in Payload require explicit configuration to auto-generate from another field and enforce uniqueness. Without this, the Executor will either leave slug as a manual text field (UX problem) or invent their own implementation (violates pipeline rules).

**Action required:** Specify: `slug` auto-generated from `title` using Payload's slug field pattern. Add `unique: true` constraint.

---

#### H-03: No TDD strategy
**Standard violated:** TDD
**Detail:** RFC-002 has no test section. The following tests are feasible and required per pipeline standards:

**Phase 2A tests (schema):**
- Can create a `Hero` global document with all required fields via Payload Local API.
- Can create a `Quest` document with all required fields.
- Can create a `Stats` document.
- Can create a `Campaign` document.
- Slug uniqueness constraint rejects duplicate slugs.

**Phase 2B tests (frontend):**
- `GET /es` returns HTTP 200.
- `GET /en` returns HTTP 200.
- `GET /` redirects to `/es` (default locale).
- Hero section renders with mocked data (component test).

**Action required:** Add a "Test Strategy" section to the RFC with the above cases.

---

#### H-04: Seed data strategy is a placeholder
**Detail:** Step 2 says "Seed initial content from Teo's CV and Instructions" with no further specification. The Executor cannot act on this without:
- A source document (the actual CV).
- A decision on whether seeding is done via Payload Local API script, REST API, or manual CMS entry.

**Recommendation:** Teo provides CV content as a structured data file (JSON or MD) in `.agents/context/`. The Executor seeds via a `pnpm seed` script using Payload Local API. This belongs in Phase 2B.

---

#### H-05: framer-motion import resolved — use `from 'framer-motion'`
**Detail:** FJPP uses `import { motion } from 'framer-motion'` in production. Use the same package and import path. No version ambiguity — align with FJPP's `package.json` version.

**Action required:** Specify in RFC: `pnpm add framer-motion`, import `from 'framer-motion'`. Reference FJPP's Hero.tsx for animation patterns (fade-in + translateY, `easeOut`, staggered delays).

---

#### H-06: `Quests` missing `sortOrder` field — project display order is specified (new — from profile review)
**Detail:** Teo specified an explicit display order for projects: fjpp → heionhub → thesis → Canadian College → others. Without a `sortOrder` field, the Executor has no way to implement this ordering in the CMS.

**Action required:** Add `sortOrder (number)` field to `Quests` collection. Default values: fjpp=1, heionhub=2, thesis=3, Canadian College=4.

---

#### H-07: `Quests.category` missing "Education/Research" for thesis (new — from profile review)
**Detail:** Teo's Master's thesis (*Realidad, Memoria y Creencia: Semillas resonantes*) is a key Quest but doesn't fit any existing category (`Tech`, `Music`, `Art`, `Coffee`). The thesis spans arts education and RPG methodology.

**Action required:** Add `Education` to the category select options.

---

#### H-08: `sharp` missing from listed dependencies (new — from FJPP review)
**Detail:** FJPP's `payload.config.ts` explicitly imports and passes `sharp` to `buildConfig`. Payload requires `sharp` for image processing (resizing, focal point). It's not listed in RFC-002 dependencies.

**Action required:** Add `sharp` to the dependency list. Add `import sharp from 'sharp'` and `sharp,` to `buildConfig()`.

---

#### H-09: `forcePathStyle: true` missing from R2/s3Storage config (new — from FJPP review)
**Detail:** FJPP's s3Storage config includes `forcePathStyle: true`. Without this, Cloudflare R2 requests fail with path-style URL errors. This was not flagged in RFC-001 (it should have been).

**Action required:** Add `forcePathStyle: true` to `s3Storage` config in both RFC-002 and as a correction to RFC-001 decision file Step 6.

---

### MEDIUM

#### M-01: "Void Forge" theme tokens not defined
**Detail:** The RFC describes the palette conceptually but the Executor needs exact values for Tailwind v4 `@theme` blocks. Without explicit tokens, the Executor will invent values.

**Minimum required tokens to specify:**
```css
/* Suggested — Teo to confirm or adjust */
--color-void: #000000;          /* OLED background */
--color-surface: #0d0d0d;       /* Card background */
--color-border: #1a1a1a;        /* Subtle borders */
--color-muted: #6b7280;         /* Slate grey text */
--color-foreground: #f0f0f0;    /* Primary text */
--color-accent-cyan: #00f5ff;   /* Neon cyan */
--color-accent-green: #39ff14;  /* Neon green */
--color-glow-cyan: rgba(0,245,255,0.15);  /* Glassmorphism glow */
```

**Action required:** Either confirm these tokens or provide corrected values. They go into `app/globals.css` under a `@theme` block.

---

#### M-02: `Stats.category` select values should be slugs
**Detail:** Select values `"Frontend"`, `"Backend"`, `"Music"`, `"Audio Engineering"` use display strings as values. The space in `"Audio Engineering"` will cause filtering bugs. Values should be `audio-engineering` (slug), with a separate label for display.

**Recommendation:**
```typescript
{ label: 'Audio Engineering', value: 'audio-engineering' }
```

---

#### M-03: Responsive layout for Hero section unspecified
**Detail:** The Hero "Character Sheet" is a left/right split on desktop. There's no specification for mobile layout. Without this, the Executor will improvise breakpoints.

**Recommendation:** Specify: single column on mobile (`< md`), split on `md+`. Avatar stacks above bio on mobile.

---

#### M-04: SEO / meta tags not mentioned
**Detail:** As a portfolio, basic meta tags (`<title>`, `og:image`, `og:description`) are expected. RFC-002 doesn't mention them. Should be explicitly in or out of scope.

**Recommendation:** Add to scope as a minimal addition during Phase 2B: dynamic meta via Next.js `generateMetadata`, sourced from the `Hero` Global.

---

### LOW

#### L-01: framer-motion animation specs are vague
**Detail:** "Grim transitions" is not a verifiable spec. The Executor needs at minimum: which elements animate, what trigger (scroll/mount/hover), and what easing to use.

**Recommendation for Phase 2C spec:**
- Hero section: fade-in + translate-Y on mount, staggered
- Stat bars: animate width from 0 to value on viewport entry
- Quest cards: fade-in staggered on scroll
- Easing: `easeOut`, duration 0.4–0.6s

---

#### L-02: Success criterion #4 is not verifiable
**Detail:** "Design matches the Dark-Grim / Spotify / Warp vibe" cannot be checked by the QA agent mechanically. Replace with: "Homepage renders with Void Forge theme tokens applied (verified via browser screenshot)" or similar.

---

## Checklist Summary

| ID   | Severity | Phase | Description |
|------|----------|-------|-------------|
| C-01 | CRITICAL | 2A | `Media` collection missing |
| C-02 | CRITICAL | 2A | Localization scope per field unspecified |
| C-03 | CRITICAL | 2A | `Stats.icon` as full lucide select is unimplementable |
| C-04 | CRITICAL | 2B | Fallback content strategy (defaultValue + image mockup) not specified |
| H-01 | HIGH | 2A | `Campaigns.isCurrent` boolean missing |
| H-02 | HIGH | 2A | `Quests.slug` auto-generation not specified |
| H-03 | HIGH | ALL | No TDD strategy |
| H-04 | HIGH | 2B | Seed data is a placeholder |
| H-05 | HIGH | 2A | framer-motion: use `from 'framer-motion'`, align with FJPP |
| H-06 | HIGH | 2A | `Quests.sortOrder` field missing (display order is specified) |
| H-07 | HIGH | 2A | `Quests.category` missing `Education` for thesis |
| H-08 | HIGH | 2A | `sharp` missing from dependencies |
| H-09 | HIGH | 2A | `forcePathStyle: true` missing from s3Storage R2 config |
| M-01 | MEDIUM | 2B | Void Forge theme tokens not defined |
| M-02 | MEDIUM | 2A | `Stats.category` values need slugs |
| M-03 | MEDIUM | 2B | Hero responsive layout unspecified |
| M-04 | MEDIUM | 2B | SEO/meta tags not scoped |
| L-01 | LOW | 2C | framer-motion animation specs vague |
| L-02 | LOW | 2C | Success criterion #4 is not verifiable |

---

---

## Teo Review Round 1 — Resolutions (2026-04-15)

---

### C-04 — RESOLVED: Approved
Fallback content strategy confirmed. Every field gets `defaultValue` with real content. Image fallback URL: `https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24`. Pattern: Payload `defaultValue` + component-level `|| fallback` (mirroring FJPP `Hero.tsx`).

---

### C-01 — REVISED: Media is built into Payload but must be declared
**Research finding:** Payload provides rich upload capabilities via `upload: true` on any collection. Docs confirm: "A common pattern is to create a 'media' collection and enable upload on that collection." `create-payload-app` likely created a baseline `Media` collection. The definition is minimal (5 lines, confirmed from FJPP):

```ts
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text', required: true }],
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
```

**Resolution:** Verify if `create-payload-app` already created a `Media` collection. If yes, enhance with `imageSizes`. If not, create it. Not blocking — simple to add.

---

### C-02 — RESOLVED: Approved
Localization per-field table accepted. Executor applies `localized: true` only to the fields specified in the table.

---

### C-03 — RESOLVED: 200 curated Lucide icons as select options
Use a `select` field with 200 icon names. Organized by category for CMS usability. Full list:

```ts
// Stats.icon — select options (value = icon name, label = display name)
const LUCIDE_ICONS = [
  // Development
  { label: 'Code', value: 'Code' },
  { label: 'Terminal', value: 'Terminal' },
  { label: 'Database', value: 'Database' },
  { label: 'Server', value: 'Server' },
  { label: 'Cloud', value: 'Cloud' },
  { label: 'Cpu', value: 'Cpu' },
  { label: 'Binary', value: 'Binary' },
  { label: 'Braces', value: 'Braces' },
  { label: 'FileCode', value: 'FileCode' },
  { label: 'FileCode2', value: 'FileCode2' },
  { label: 'FileTerminal', value: 'FileTerminal' },
  { label: 'Layers', value: 'Layers' },
  { label: 'Package', value: 'Package' },
  { label: 'Puzzle', value: 'Puzzle' },
  { label: 'Settings', value: 'Settings' },
  { label: 'Settings2', value: 'Settings2' },
  { label: 'Wrench', value: 'Wrench' },
  { label: 'Bug', value: 'Bug' },
  { label: 'Globe', value: 'Globe' },
  { label: 'Globe2', value: 'Globe2' },
  { label: 'Network', value: 'Network' },
  { label: 'Wifi', value: 'Wifi' },
  { label: 'HardDrive', value: 'HardDrive' },
  { label: 'Monitor', value: 'Monitor' },
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Smartphone', value: 'Smartphone' },
  { label: 'Keyboard', value: 'Keyboard' },
  { label: 'GitBranch', value: 'GitBranch' },
  { label: 'GitCommit', value: 'GitCommit' },
  { label: 'GitFork', value: 'GitFork' },
  { label: 'GitMerge', value: 'GitMerge' },
  { label: 'GitPullRequest', value: 'GitPullRequest' },
  { label: 'Github', value: 'Github' },
  { label: 'Lock', value: 'Lock' },
  { label: 'Unlock', value: 'Unlock' },
  { label: 'Shield', value: 'Shield' },
  { label: 'ShieldCheck', value: 'ShieldCheck' },
  { label: 'Key', value: 'Key' },
  { label: 'Fingerprint', value: 'Fingerprint' },
  { label: 'Zap', value: 'Zap' },
  { label: 'Activity', value: 'Activity' },
  { label: 'BarChart', value: 'BarChart' },
  { label: 'BarChart2', value: 'BarChart2' },
  { label: 'BarChart3', value: 'BarChart3' },
  { label: 'PieChart', value: 'PieChart' },
  { label: 'LineChart', value: 'LineChart' },
  { label: 'TrendingUp', value: 'TrendingUp' },
  { label: 'TrendingDown', value: 'TrendingDown' },
  { label: 'RefreshCw', value: 'RefreshCw' },
  { label: 'RotateCw', value: 'RotateCw' },
  // Music & Audio
  { label: 'Music', value: 'Music' },
  { label: 'Music2', value: 'Music2' },
  { label: 'Music3', value: 'Music3' },
  { label: 'Music4', value: 'Music4' },
  { label: 'Headphones', value: 'Headphones' },
  { label: 'Mic', value: 'Mic' },
  { label: 'Mic2', value: 'Mic2' },
  { label: 'MicOff', value: 'MicOff' },
  { label: 'Radio', value: 'Radio' },
  { label: 'Volume', value: 'Volume' },
  { label: 'Volume1', value: 'Volume1' },
  { label: 'Volume2', value: 'Volume2' },
  { label: 'VolumeX', value: 'VolumeX' },
  { label: 'Guitar', value: 'Guitar' },
  { label: 'Piano', value: 'Piano' },
  { label: 'Drum', value: 'Drum' },
  { label: 'Disc', value: 'Disc' },
  { label: 'Disc2', value: 'Disc2' },
  { label: 'Disc3', value: 'Disc3' },
  { label: 'AudioWaveform', value: 'AudioWaveform' },
  { label: 'Waves', value: 'Waves' },
  { label: 'Play', value: 'Play' },
  { label: 'Pause', value: 'Pause' },
  { label: 'Square', value: 'Square' },
  { label: 'SkipBack', value: 'SkipBack' },
  { label: 'SkipForward', value: 'SkipForward' },
  { label: 'Rewind', value: 'Rewind' },
  { label: 'FastForward', value: 'FastForward' },
  { label: 'Repeat', value: 'Repeat' },
  { label: 'Shuffle', value: 'Shuffle' },
  { label: 'ListMusic', value: 'ListMusic' },
  { label: 'Speaker', value: 'Speaker' },
  { label: 'Equalizer', value: 'Sliders' },
  // Art & Design
  { label: 'Palette', value: 'Palette' },
  { label: 'Brush', value: 'Brush' },
  { label: 'Pen', value: 'Pen' },
  { label: 'PenTool', value: 'PenTool' },
  { label: 'Pencil', value: 'Pencil' },
  { label: 'Paintbrush', value: 'Paintbrush' },
  { label: 'Paintbrush2', value: 'Paintbrush2' },
  { label: 'Feather', value: 'Feather' },
  { label: 'Crop', value: 'Crop' },
  { label: 'Scissors', value: 'Scissors' },
  { label: 'Ruler', value: 'Ruler' },
  { label: 'DraftingCompass', value: 'DraftingCompass' },
  { label: 'Image', value: 'Image' },
  { label: 'ImagePlus', value: 'ImagePlus' },
  { label: 'Camera', value: 'Camera' },
  { label: 'Aperture', value: 'Aperture' },
  { label: 'Film', value: 'Film' },
  { label: 'Clapperboard', value: 'Clapperboard' },
  { label: 'Tv', value: 'Tv' },
  { label: 'MonitorPlay', value: 'MonitorPlay' },
  { label: 'Frame', value: 'Frame' },
  { label: 'Shapes', value: 'Shapes' },
  { label: 'Circle', value: 'Circle' },
  { label: 'Triangle', value: 'Triangle' },
  { label: 'Hexagon', value: 'Hexagon' },
  { label: 'Figma', value: 'Figma' },
  // Education & Research
  { label: 'Book', value: 'Book' },
  { label: 'BookOpen', value: 'BookOpen' },
  { label: 'BookCopy', value: 'BookCopy' },
  { label: 'BookMarked', value: 'BookMarked' },
  { label: 'GraduationCap', value: 'GraduationCap' },
  { label: 'School', value: 'School' },
  { label: 'Microscope', value: 'Microscope' },
  { label: 'FlaskConical', value: 'FlaskConical' },
  { label: 'TestTube', value: 'TestTube' },
  { label: 'Brain', value: 'Brain' },
  { label: 'Lightbulb', value: 'Lightbulb' },
  { label: 'LightbulbOff', value: 'LightbulbOff' },
  { label: 'Compass', value: 'Compass' },
  { label: 'Map', value: 'Map' },
  { label: 'Award', value: 'Award' },
  { label: 'Medal', value: 'Medal' },
  { label: 'Trophy', value: 'Trophy' },
  { label: 'Target', value: 'Target' },
  { label: 'Atom', value: 'Atom' },
  // Social & Communication
  { label: 'Twitter', value: 'Twitter' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Linkedin', value: 'Linkedin' },
  { label: 'Youtube', value: 'Youtube' },
  { label: 'Facebook', value: 'Facebook' },
  { label: 'Discord', value: 'Discord' },
  { label: 'Slack', value: 'Slack' },
  { label: 'Mail', value: 'Mail' },
  { label: 'MailOpen', value: 'MailOpen' },
  { label: 'MessageCircle', value: 'MessageCircle' },
  { label: 'MessageSquare', value: 'MessageSquare' },
  { label: 'Phone', value: 'Phone' },
  { label: 'PhoneCall', value: 'PhoneCall' },
  { label: 'Video', value: 'Video' },
  { label: 'VideoOff', value: 'VideoOff' },
  { label: 'Link', value: 'Link' },
  { label: 'Link2', value: 'Link2' },
  { label: 'ExternalLink', value: 'ExternalLink' },
  { label: 'Share', value: 'Share' },
  { label: 'Share2', value: 'Share2' },
  { label: 'Send', value: 'Send' },
  { label: 'Rss', value: 'Rss' },
  { label: 'AtSign', value: 'AtSign' },
  { label: 'Hash', value: 'Hash' },
  { label: 'User', value: 'User' },
  { label: 'Users', value: 'Users' },
  { label: 'UserPlus', value: 'UserPlus' },
  { label: 'UserCheck', value: 'UserCheck' },
  { label: 'Contact', value: 'Contact' },
  // RPG / Portfolio flavor
  { label: 'Sword', value: 'Sword' },
  { label: 'Shield (RPG)', value: 'ShieldAlert' },
  { label: 'Wand', value: 'Wand' },
  { label: 'Wand2', value: 'Wand2' },
  { label: 'Sparkles', value: 'Sparkles' },
  { label: 'Stars', value: 'Stars' },
  { label: 'Star', value: 'Star' },
  { label: 'Heart', value: 'Heart' },
  { label: 'Flame', value: 'Flame' },
  { label: 'Bolt', value: 'BoltIcon' },
  { label: 'Crown', value: 'Crown' },
  { label: 'Gem', value: 'Gem' },
  { label: 'Scroll', value: 'Scroll' },
  { label: 'Map (Quest)', value: 'MapPin' },
  { label: 'Compass (Navigation)', value: 'Navigation' },
  { label: 'Crosshair', value: 'Crosshair' },
  { label: 'Swords', value: 'Swords' },
  { label: 'Ghost', value: 'Ghost' },
  // General/UI
  { label: 'Home', value: 'Home' },
  { label: 'Layout', value: 'Layout' },
  { label: 'Grid', value: 'Grid' },
  { label: 'List', value: 'List' },
  { label: 'Columns', value: 'Columns' },
  { label: 'Sidebar', value: 'Sidebar' },
  { label: 'Menu', value: 'Menu' },
  { label: 'Search', value: 'Search' },
  { label: 'Filter', value: 'Filter' },
  { label: 'Download', value: 'Download' },
  { label: 'Upload', value: 'Upload' },
  { label: 'Calendar', value: 'Calendar' },
  { label: 'Clock', value: 'Clock' },
  { label: 'Timer', value: 'Timer' },
  { label: 'MapPin', value: 'MapPin' },
  { label: 'Bookmark', value: 'Bookmark' },
  { label: 'Tag', value: 'Tag' },
  { label: 'Tags', value: 'Tags' },
  { label: 'Flag', value: 'Flag' },
  { label: 'Bell', value: 'Bell' },
  { label: 'Coffee', value: 'Coffee' },
  { label: 'Briefcase', value: 'Briefcase' },
  { label: 'Building', value: 'Building' },
  { label: 'Building2', value: 'Building2' },
  { label: 'Store', value: 'Store' },
  { label: 'ShoppingBag', value: 'ShoppingBag' },
  { label: 'DollarSign', value: 'DollarSign' },
  { label: 'CreditCard', value: 'CreditCard' },
  { label: 'Infinity', value: 'Infinity' },
  { label: 'Plus', value: 'Plus' },
  { label: 'Minus', value: 'Minus' },
  { label: 'Check', value: 'Check' },
  { label: 'X', value: 'X' },
  { label: 'Info', value: 'Info' },
  { label: 'Help', value: 'HelpCircle' },
  { label: 'AlertTriangle', value: 'AlertTriangle' },
  { label: 'Eye', value: 'Eye' },
  { label: 'EyeOff', value: 'EyeOff' },
  { label: 'Sun', value: 'Sun' },
  { label: 'Moon', value: 'Moon' },
  { label: 'CloudRain', value: 'CloudRain' },
  { label: 'Wind', value: 'Wind' },
]
```

---

### H-01 — RESOLVED: Approved
Add `isCurrent (checkbox, default: false)` to Campaigns. When true, display "Present" on frontend and hide `endDate`. Payload `condition` hides `endDate` when `isCurrent` is checked.

---

### H-02 — RESOLVED: Custom slug field using `standard-slugify` (tuherenciafacil pattern)
**Research finding:** Payload 3.x has no built-in slug plugin. The established pattern (confirmed in tuherenciafacil) is a **custom slug field** using:
- `pnpm add standard-slugify` for the slugification logic
- A `beforeValidate` hook (`formatSlug`) that formats typed input
- A `beforeChange` hook (`generateSlug`) that auto-generates on create
- A custom UI component (`SlugField`) with a "lock/unlock" toggle

This is a ~4-file implementation reusable across collections. The Executor should port this from tuherenciafacil at:
- `src/payload/fields/slug/slug.ts`
- `src/payload/fields/slug/slugify.ts`
- `src/payload/fields/slug/hooks/generateSlug.ts`
- `src/payload/fields/slug/hooks/formatSlug.ts`
- `src/payload/fields/slug/ui.tsx`

Usage: `slug('title')` — auto-generates from `title`, unique, indexed, sidebar.

**Key behavior:** non-versioned collections generate slug on create and never auto-sync on update (correct for Quests — slug is a stable URL).

---

### H-03 — RESOLVED: Approved
TDD strategy confirmed. Tests added to Phase 2A (schema CRUD via Local API) and Phase 2B (route smoke tests).

---

### H-04 — RESOLVED: Approved
CV source files exist in `.agents/context/Teomago Profile/`. Seed script via Payload Local API (`pnpm seed`). Executor uses the CV + Instructions.md as the data source for all `defaultValue` content. Phase 2B.

---

### H-05 — RESOLVED: Approved
`import { motion } from 'framer-motion'` confirmed. Align with FJPP's version. Animation pattern: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}`.

---

### H-06 — ANSWERED: How to introduce new work/experience
**Answer:** The CMS-driven model means **no code changes are needed** to add new content. Each collection (Quests, Stats, Campaigns) is a Payload collection — adding new work is as simple as clicking "Add New" in the admin panel.

For **ordering**: the `sortOrder` field (number) gives full control. Convention: lower = earlier in display. To add a new Quest and have it appear first, set `sortOrder: 0` (or renumber others). To append a new Campaign, use the next available number.

**Extra design decision for scaling:** Add a `featured (checkbox)` field to `Quests`. Featured quests appear prominently; non-featured quests are shown in a secondary grid or collapsed section. This means as Teo's portfolio grows, he can promote/demote work without touching ordering.

---

### H-07 — RESOLVED: Approved
Add `Education` to `Quests.category` select. Updated categories: `Tech`, `Music`, `Art`, `Coffee`, `Education`.

---

### H-08 — REVISED: sharp is auto-configured by `create-payload-app`
**Research finding (from docs):** "for image resizing to work, `sharp` must be specified in your Payload Config. This is **configured by default if you created your Payload project with `create-payload-app`**."

**Resolution:** Verify that `sharp` is already present in `payload.config.ts` after `create-payload-app` scaffolding. If it is, no action needed. If it was removed or missing, add `import sharp from 'sharp'` and `sharp,` to `buildConfig()`. Tuherenciafacil confirms this pattern with `sharp` explicitly in the config.

---

### H-09 — REVISED: `forcePathStyle` recommended but not universally required
**Research finding from tuherenciafacil (Neon + R2):** tuherenciafacil's `payload.config.ts` does NOT include `forcePathStyle: true` in its s3Storage config. FJPP does. The difference: FJPP may use path-style R2 URLs; tuherenciafacil uses the default subdomain-style endpoint.

**Resolution:** Omit `forcePathStyle` initially. If uploads fail with path-style errors, add `forcePathStyle: true` as a debug step. The Executor should note this in a comment in the config.

**Neon config note (from tuherenciafacil):**
```ts
db: postgresAdapter({
  idType: 'uuid',    // tuherenciafacil uses uuid — consider for teomago
  pool: {
    connectionString: process.env.DATABASE_URI || '',
  },
  push: process.env.NODE_ENV === 'development',  // push schema in dev
}),
```

---

### M-01 — RESOLVED: Approved
Void Forge tokens confirmed. Executor adds to `app/globals.css` under `@theme`.

---

### M-02 — RESOLVED: Approved
`Stats.category` values use slug format: `frontend`, `backend`, `music`, `audio-engineering`.

---

### M-03 — RESOLVED: Responsive strategy confirmed
General responsive rules for all sections:
- **Hero:** `flex-col` on `< md`, `flex-row` (split) on `md+`. Avatar above bio on mobile.
- **Stats:** `grid-cols-1` on mobile, `grid-cols-2` on `sm`, `grid-cols-3` on `lg`.
- **Quests:** `grid-cols-1` on mobile, `grid-cols-2` on `md`, `grid-cols-3` on `xl`.
- **Campaigns:** Single column timeline on all breakpoints (timeline is inherently vertical).
- **Typography:** Scale with `text-4xl md:text-6xl lg:text-7xl` pattern (already in FJPP Hero.tsx).

---

### M-04 — RESOLVED: `@payloadcms/plugin-seo` confirmed
**Package:** `pnpm add @payloadcms/plugin-seo`

**Usage in `payload.config.ts`:**
```ts
import { seoPlugin } from '@payloadcms/plugin-seo'

plugins: [
  seoPlugin({
    globals: ['hero'],
    collections: ['quests'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => `Teomago — ${doc?.title ?? 'Portfolio'}`,
    generateDescription: ({ doc }) => doc?.description ?? '',
    generateURL: ({ doc, collectionSlug }) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL}/${collectionSlug}/${doc?.slug}`,
  }),
]
```

Adds `meta.title`, `meta.description`, `meta.image` to enabled collections/globals. Integrates with Next.js `generateMetadata`. Phase 2A.

---

### L-01 — RESOLVED + EXTRA MILE features
Animation spec approved. Additional "extra mile" features to add to the decision file:

| Feature | Implementation | Phase |
|---------|---------------|-------|
| Payload Live Preview | `livePreview` config in `buildConfig` + preview URL | 2A |
| Draft/Publish workflow | `versions: { drafts: true }` on Quests | 2A |
| `featured` flag on Quests | `featured (checkbox)` field | 2A |
| Open Graph image | Next.js `app/opengraph-image.tsx` using Hero data | 2B |
| `next/font` | Inter + JetBrains Mono (monospace for stats) | 2B |
| Smooth scroll | `scroll-behavior: smooth` in `globals.css` | 2B |
| Copy social link to clipboard | `navigator.clipboard.writeText` on social link click | 2C |
| Subtle noise texture overlay | CSS `noise.svg` background or Tailwind mask | 2C |
| Stat bar scroll animation | `useInView` from framer-motion + `animate` on viewport entry | 2C |
| Locale switcher UI | Toggle in header: ES / EN | 2B |

---

### L-02 — RESOLVED
Teo will verify "design matches Dark-Grim vibe" personally. No automated test for this criterion. QA phase passes when Teo confirms.

---

## Updated Checklist Summary

| ID   | Severity | Phase | Status | Description |
|------|----------|-------|--------|-------------|
| C-01 | CRITICAL | 2A | REVISED | Media collection — verify create-payload-app created it; enhance with imageSizes |
| C-02 | CRITICAL | 2A | RESOLVED | Localization per-field table confirmed |
| C-03 | CRITICAL | 2A | RESOLVED | 200 Lucide icons list provided above |
| C-04 | CRITICAL | 2B | RESOLVED | Fallback content: defaultValue + component fallback confirmed |
| H-01 | HIGH | 2A | RESOLVED | Campaigns.isCurrent checkbox confirmed |
| H-02 | HIGH | 2A | RESOLVED | Custom slug field — port from tuherenciafacil, use standard-slugify |
| H-03 | HIGH | ALL | RESOLVED | TDD strategy confirmed |
| H-04 | HIGH | 2B | RESOLVED | Seed from CV files via Payload Local API |
| H-05 | HIGH | 2B | RESOLVED | framer-motion from 'framer-motion', FJPP pattern |
| H-06 | HIGH | 2A | ANSWERED | New work via CMS admin. sortOrder field + featured checkbox |
| H-07 | HIGH | 2A | RESOLVED | 'Education' added to Quests.category |
| H-08 | HIGH | 2A | REVISED | sharp auto-configured by create-payload-app — verify before adding |
| H-09 | HIGH | 2A | REVISED | forcePathStyle optional — omit initially, add if R2 errors occur |
| M-01 | MEDIUM | 2B | RESOLVED | Void Forge tokens confirmed |
| M-02 | MEDIUM | 2A | RESOLVED | Slug-format select values confirmed |
| M-03 | MEDIUM | 2B | RESOLVED | Responsive breakpoints specified per section |
| M-04 | MEDIUM | 2A | RESOLVED | @payloadcms/plugin-seo confirmed, config above |
| L-01 | LOW | 2C | RESOLVED | Animation spec confirmed + 10 extra mile features listed |
| L-02 | LOW | 2C | RESOLVED | Teo verifies design quality personally |

**All findings resolved. Ready for Phase 3 — decision file.**
