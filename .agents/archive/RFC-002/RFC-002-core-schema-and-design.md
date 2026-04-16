# RFC-002 — Core Schema & "Dark-Grim" RPG Design

## Objective
Define the data structure (Payload collections) and visual design for the Teomago portfolio, blending a "Tech Gamer Musician" aesthetic with RPG-style narrative gamification (Option A).

## Scope
- Creation of Payload collections: `Quests` (Projects), `Stats` (Skills), `Campaigns` (Experience).
- Setup of a `Hero` Global for the landing page profile.
- UI/UX implementation using Tailwind v4, shadcn/ui, and a custom "Dark-Grim" theme.

## 1. Schema Design (Payload Collections)

All collections will support localization (ES/EN).

### A. Globals: `Hero`
- **Fields:**
    - `name` (text)
    - `role` (text)
    - `bio` (richText)
    - `avatar` (upload: media)
    - `stats` (array: `statName`, `value` 1-99)
    - `socialLinks` (array: `label`, `url`, `icon`)

### B. Collection: `Quests` (Projects)
- **Slug:** `quests`
- **Fields:**
    - `title` (text)
    - `slug` (text)
    - `category` (select: `Tech`, `Music`, `Art`, `Coffee`)
    - `description` (richText)
    - `coverImage` (upload: media)
    - `stack` (array: `techName`)
    - `link` (url)
    - `status` (select: `Completed`, `In Progress`, `Side Quest`)

### C. Collection: `Stats` (Skills)
- **Slug:** `stats`
- **Fields:**
    - `name` (text)
    - `level` (number: 1-99)
    - `category` (select: `Frontend`, `Backend`, `Music`, `Audio Engineering`)
    - `icon` (select: `lucide-react` icons)

### D. Collection: `Campaigns` (Experience)
- **Slug:** `campaigns`
- **Fields:**
    - `company` (text)
    - `role` (text)
    - `startDate` (date)
    - `endDate` (date, optional)
    - `description` (richText)
    - `questRewards` (array: `achievementName`)

## 2. Visual Design (The "Dark-Grim" Aesthetic)

### Theme: "The Void Forge"
- **Colors:** OLED Black background (#000000), Slate Grey text, Neon Cyan/Green accents.
- **Glassmorphism:** Use translucent shadcn cards with a subtle border glow.
- **Typography:** Bold, clean (Vercel/Inter) with mono-spaced accents for stats.

### Component Map:
- **Hero Section:** "Character Sheet" layout. Left: Avatar + Base Stats. Right: Bio + High-level attributes.
- **Stats Section:** Progress bars (like RPG stats) with hover effects showing "Skill Level."
- **Quests Section:** Grid of cards. Each card looks like a quest log entry.
- **Campaigns Section:** Vertical timeline with a "Campaign Map" feel.

## 3. Implementation Plan

- **Step 1:** Implement Payload schemas with localization enabled.
- **Step 2:** Seed initial content from Teo's CV and Instructions.
- **Step 3:** Build frontend layout `[locale]/page.tsx` with core sections.
- **Step 4:** Style components with Tailwind v4 and framer-motion (for "grim" transitions).

## Success Criteria
- [ ] Users can toggle between ES and EN.
- [ ] Portfolio displays Projects as "Quests" and Skills as "Stats."
- [ ] CMS allows editing all content without code changes.
- [ ] Design matches the Dark-Grim / Spotify / Warp vibe.
