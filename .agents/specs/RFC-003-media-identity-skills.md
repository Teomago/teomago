# RFC-003: Media Upgrades + Hero Identity + Skills Panel

**Status:** Approved (Phase 2 Audit Resolved — ready for Phase 3)
**Author:** Gemini (Designer)
**Auditor:** Claude (Phase 2) — 2026-04-16
**Scope:** Three independent features shipped together for portfolio character-sheet completeness.

---

## 1. Architectural Blueprint: Media Upgrades

### Goal
Auto-convert to WebP, enable admin folders, and implement perceptual blur-placeholders (ThumbHash).

### File Impact Map
- `src/collections/Media.ts`: Update upload config (`formatOptions`, `adminFolders`), add fields for `caption`, `credit`, and `thumbhash`.
- `src/collections/hooks/generateThumbhash.ts`: (New) Sharp-based perceptual hash generator.

### Interface Definitions

**Upload Config Changes (Media.ts):**
```ts
upload: {
  adminFolders: true,
  formatOptions: { format: 'webp', options: { quality: 85 } },
  // existing imageSizes, adminThumbnail, mimeTypes, disableLocalStorage unchanged
}
```

**Hook Signature (`generateThumbhash.ts`):**
```ts
import type { CollectionBeforeChangeHook } from 'payload'
import sharp from 'sharp'
import { rgbaToThumbHash } from 'thumbhash'

export const generateThumbhash: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!req.file?.data) return data  // guard: skip metadata-only updates
  try {
    const { data: pixels, info } = await sharp(req.file.data)
      .resize(100, 100, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const hash = rgbaToThumbHash(info.width, info.height, new Uint8Array(pixels))
    data.thumbhash = Buffer.from(hash).toString('base64')
  } catch {
    // non-fatal: leave thumbhash empty rather than block the upload
  }
  return data
}
```

**Field Changes:**
- `caption`: localized `textarea`
- `credit`: `type: 'text'`, `localized: true` (single credit string, e.g. "Photo by Unsplash")
- `thumbhash`: `type: 'text'`, `admin.hidden: true` — stores base64-encoded ThumbHash string

> **Serialization note:** ThumbHash is stored as a base64 `text` field (not `json`) because `rgbaToThumbHash` returns a `Uint8Array` which serializes incorrectly as JSON. Base64 is smaller and directly consumable by the `thumbhash` JS lib on the client.

---

## 2. Architectural Blueprint: Hero Identity

### Goal
Display "teomago" as H1 and "Mateo Ibagón" as a monospace subtitle.

### File Impact Map
- `src/globals/Hero.ts`: Add `properName` field; update `name` field label and `defaultValue` to `'teomago'`.
- `src/components/homepage/HeroSection.tsx`: Render `properName` as monospace subtitle below the H1.
- `src/globals/SiteSettings.ts`: (New) Stable SEO global — `siteName` + `siteTagline` fields.
- `src/payload.config.ts`: Register `SiteSettings` global; update `seoPlugin` to use `SiteSettings` instead of Hero fields.

### Interface Definitions

**New `properName` field (Hero.ts):**
```ts
{
  name: 'properName',
  type: 'text',
  localized: false,
  defaultValue: 'Mateo Ibagón',
  admin: { description: 'Full legal name — displayed as subtitle below the handle.' },
}
```

**Updated `name` field (Hero.ts):**
```ts
{
  name: 'name',
  type: 'text',
  required: true,
  defaultValue: 'teomago',   // changed from 'Mateo Ibagón'
  admin: { description: 'Handle / nickname — displayed as the large H1.' },
}
```

**SiteSettings global (`src/globals/SiteSettings.ts`):**
```ts
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Config' },
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Teomago' },
    {
      name: 'siteTagline',
      type: 'text',
      localized: true,
      defaultValue: 'Full-Stack Developer · Musician · Arts Educator',
    },
  ],
}
```

**Updated `seoPlugin` config (payload.config.ts):**
```ts
generateTitle: async ({ doc, collectionSlug, globalSlug, req }) => {
  const settings = await req.payload.findGlobal({ slug: 'site-settings' })
  const siteName = settings?.siteName ?? 'Teomago'
  const suffix = (doc as any)?.title ?? (doc as any)?.name ?? ''
  return suffix ? `${siteName} — ${suffix}` : siteName
},
generateDescription: async ({ doc, req }) => {
  const settings = await req.payload.findGlobal({ slug: 'site-settings', locale: req.locale as 'es' | 'en' })
  return (doc as any)?.role ?? settings?.siteTagline ?? ''
},
```

**HeroSection UI — subtitle rendering:**
```tsx
// Below the H1 (name / handle)
{hero?.properName && (
  <motion.p
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="font-mono text-sm tracking-[0.15em] text-muted uppercase"
  >
    {hero.properName}
  </motion.p>
)}
```

**Default fallback constants (HeroSection.tsx):**
```ts
const DEFAULT_NAME = 'teomago'          // handle shown in H1
const DEFAULT_PROPER_NAME = 'Mateo Ibagón'  // subtitle
```

---

## 3. Architectural Blueprint: Skills Global & Panel

### Goal
A structured, localized Skills inventory rendered in a 60/40 grid alongside Campaigns.

### File Impact Map
- `src/globals/Skills.ts`: (New) Localized global for skills groups → categories → items.
- `src/payload.config.ts`: Register `Skills` global.
- `src/components/homepage/SkillsPanel.tsx`: (New) `'use client'` component with framer-motion animations.
- `src/app/[locale]/(frontend)/page.tsx`: Add `Skills` data fetch; wrap `CampaignsSection` + `SkillsPanel` in a `lg:grid-cols-10` container.

### Interface Definitions

**Skills global slug:** `'skills'`

**Field schema (`src/globals/Skills.ts`):**
```ts
export const Skills: GlobalConfig = {
  slug: 'skills',
  label: 'Skills',
  admin: { group: 'Content' },
  access: { read: () => true },
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        { name: 'groupName', type: 'text', localized: true, required: true },
        {
          name: 'categories',
          type: 'array',
          fields: [
            { name: 'categoryName', type: 'text', localized: true, required: true },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'itemName', type: 'text', localized: true, required: true },
                { name: 'level', type: 'number', min: 1, max: 99 },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Component:** `'use client'` — matches the animated aesthetic of all other homepage sections.
```ts
export function SkillsPanel({ skills }: { skills: Skills }) { ... }
// Skills type auto-generated by `pnpm payload generate:types`
```

**Page layout change (page.tsx):**
```tsx
// Replace the standalone <CampaignsSection ... /> with:
<div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
  <div className="lg:col-span-6">
    <CampaignsSection campaigns={campaignsResult.docs} />
  </div>
  <div className="lg:col-span-4">
    <SkillsPanel skills={skillsResult} />
  </div>
</div>
```

**Data fetch addition (page.tsx):**
```ts
const [hero, statsResult, questsResult, campaignsResult, skillsResult] = await Promise.all([
  // ... existing fetches ...
  payload.findGlobal({ slug: 'skills', locale: locale as 'en' | 'es' }),
])
```

---

## 4. TDD Strategy

- **Media Hook:** Unit test: pass a mock PNG buffer to `generateThumbhash`; assert `data.thumbhash` is a non-empty base64 string. Guard test: call with `req.file = undefined`; assert hook returns `data` unchanged without throwing.
- **Hero Section:** RTL test: render `<HeroSection hero={undefined} defaultAvatar="..." />`; assert fallback `DEFAULT_PROPER_NAME` renders in the subtitle element.
- **Skills Global:** Integration test (Vitest + real DB via `DATABASE_URI`): `payload.findGlobal({ slug: 'skills', locale: 'es' })`; assert `groups` is an array. Repeat for `locale: 'en'`.
- **SiteSettings Global:** Integration test: `payload.findGlobal({ slug: 'site-settings' })`; assert `siteName` is a non-empty string.

---

## 5. Metadata for Execution Plan (Phase 3)

**Dependencies:**
```
pnpm add thumbhash
```
(Sharp already installed at 0.34.5 — no new install needed.)

**After each schema change, regenerate types:**
```
pnpm payload generate:types
```

**Migrations required:**
- `media`: 3 new columns (`caption`, `credit`, `thumbhash`)
- `hero`: 1 new column (`properName`)
- `skills`: new global table
- `site_settings`: new global table
