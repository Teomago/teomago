# Design: Media Upgrades + Hero Identity + Skills Panel

**Date:** 2026-04-16  
**Status:** Approved — ready for implementation planning  
**Scope:** Three independent features shipped together in one implementation plan.

---

## 1. Media Collection Upgrades

### Goals
- Auto-convert every uploaded image to WebP
- Enable folder organisation in the Payload admin
- Add caption, credit, and thumbhash blur-placeholder support

### Changes to `src/collections/Media.ts`

| What | How |
|------|-----|
| Folder browser | `folders: true` at collection root |
| WebP conversion | `upload.formatOptions: { format: 'webp', options: { quality: 80 } }` |
| Responsive sizes | Add `small` (900w), `medium` (1400w), `large` (1920w) width-only sizes alongside existing `thumbnail`, `card`, `og` |
| `caption` field | `textarea`, localized, optional |
| `credit` field | `text`, `hasMany: true`, localized, optional |
| `thumbhash` field | `json`, hidden from admin (`admin.hidden: true`), auto-populated by hook |

### New hook: `src/collections/hooks/generateThumbhash.ts`
- `CollectionBeforeChangeHook` on `media`
- Runs on `create` and `update` (when a new file is present)
- Uses `sharp` (already installed) to resize the image to ≤100px preserving aspect ratio
- Uses `thumbhash` package to generate a perceptual hash stored as a JSON array
- Graceful: never fails the upload if hash generation errors

### New dependency
```
pnpm add thumbhash
```

### DB migrations
Three new columns on the `media` table: `caption`, `credit`, `thumbhash`.  
Run `pnpm payload migrate:create` after implementing, then `pnpm payload migrate` in production.

---

## 2. Hero Identity Fields

### Goal
Display "teomago" as the primary identity (H1) with "Mateo Ibagón" as a subtitle beneath it.

### Changes to `src/globals/Hero.ts`

| Field | Change |
|-------|--------|
| `name` (existing) | Keep slug. Relabel to `"Nickname / Title"`. Change `defaultValue` to `'teomago'`. Update description. |
| `properName` (new) | `text`, required, not localized, `defaultValue: 'Mateo Ibagón'`, labeled `"Proper Name"`. |

No rename = no column rename migration. One migration for the new `proper_name` column.

### Changes to `src/components/homepage/HeroSection.tsx`

- `DEFAULT_NAME` → `'teomago'`
- Add `DEFAULT_PROPER_NAME = 'Mateo Ibagón'`
- Read `properName` from `hero?.properName || DEFAULT_PROPER_NAME`
- Add subtitle element below the `<h1>`:
  - RPG monospace aesthetic: muted colour, small tracking, same visual language as the `playerLabel` line
  - Example: `font-mono text-sm tracking-[0.15em] text-muted`

### SEO impact
`payload.config.ts` SEO plugin uses `doc.name` to generate titles — this now picks up "teomago", which is intentional.

---

## 3. Skills Global + Panel

### Goal
Display a structured CV skills panel to the right of the Campaigns section, editable from the Payload admin.

### New global: `src/globals/Skills.ts`

```
slug: 'skills'
admin.group: 'Content'

fields:
  groups (array, required)
    title       text, localized, required   — e.g. "Herramientas y Tecnologías"
    subCategories (array, required)
      title     text, localized, required   — e.g. "Frontend & UI"
      items (array)
        label   text, localized             — e.g. "TypeScript"
```

Registered in `payload.config.ts` alongside `Hero`.

### Seed data (pre-filled defaults in component fallback)

```
Herramientas y Tecnologías / Tools & Technologies
  Frontend & UI: HTML5, CSS3, SCSS, JavaScript, TypeScript, ReactJS, NextJS, Figma
  Backend & DB:  Java (Spring Boot, Hibernate), NodeJS, PostgreSQL, Payload CMS
  DevOps & IDEs: Docker, Gradle, Git, IntelliJ IDEA, Visual Studio, DBeaver

Software de Audio y Equipos / Audio Software & Equipment
  DAWs:          Pro Tools, Ableton Live, Logic Pro, Reaper
  Live Equipment: Behringer X32 consoles (Compact, Full, MIDAS), Line Array systems, Shure microphones

Habilidades Clave / Core Skills
  Tech & Management: Full-stack Web Dev, Architecture & Encryption, Project Management,
                     Team Leadership, Government Negotiation, BPO
  Music & Culture:   Educational Project Design, Composition (Jazz/Classical), Arrangements,
                     Direction & Sound Engineering, Multi-instrumentalist, Voice (Baritone)
```

### New component: `src/components/homepage/SkillsPanel.tsx`
- Server-compatible (no `'use client'` — data comes from parent)
- Renders groups as sections with a monospace group title
- Subcategory titles as small muted labels
- Items as chips: same `border border-border rounded-sharp` aesthetic as social buttons, smaller padding
- Falls back to hardcoded seed data if CMS returns nothing

### Layout change
The area that currently renders `CampaignsSection` becomes a two-column grid:
- Left (≈60%): campaigns list (unchanged)
- Right (≈40%): `SkillsPanel`
- On mobile: stacks vertically, skills panel below campaigns

### Data fetch
The page server component fetches `skills` global in parallel with `hero`. No new API routes needed — uses existing `getPayload` pattern.

---

## Implementation Order

1. Install `thumbhash` package
2. Media collection + hook + migration
3. Hero global + HeroSection component
4. Skills global + registration in payload.config
5. SkillsPanel component + layout integration
6. Page data fetch wired up
7. Generate and run migrations
