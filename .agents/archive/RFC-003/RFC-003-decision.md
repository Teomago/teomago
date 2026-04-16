# RFC-003-decision — Media Upgrades + Hero Identity + Skills Panel
**Phase:** 3 — Execution Plan
**Date:** 2026-04-16
**RFC:** `.agents/specs/RFC-003-media-identity-skills.md`
**Audit:** `.agents/audits/RFC-003-audit.md`
**Status:** PENDING TEO APPROVAL → then Gemini executes Phase 4

---

## Scope Summary

Four new/updated files for schema, one new hook, one new global (SiteSettings), one new global (Skills), one updated component (HeroSection), one new component (SkillsPanel), one updated page (page.tsx), one updated config (payload.config.ts). All changes are additive — no destructive schema changes.

**New dependencies:** `pnpm add thumbhash`

---

## TDD Order (strict Red → Green)

All tests live in `tests/int/`. Write the test → verify RED → implement → verify GREEN before proceeding to the next step. Never write production code before its test.

---

## Step 1 — Install dependencies

```bash
pnpm add thumbhash
```

Verify:

```bash
node -e "import('thumbhash').then(m => console.log(Object.keys(m)))"
# should print array including 'rgbaToThumbHash'
```

---

## Step 2 — Write ThumbHash hook tests (RED first)

Create `tests/int/thumbhash.int.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { generateThumbhash } from '@/collections/hooks/generateThumbhash'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import sharp from 'sharp'

describe('generateThumbhash hook', () => {
  it('generates a base64 thumbhash string for a valid image buffer', async () => {
    // Create a minimal 10x10 red PNG buffer via sharp
    const buffer = await sharp({
      create: { width: 10, height: 10, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } },
    })
      .png()
      .toBuffer()

    const result = await generateThumbhash({
      data: {},
      req: { file: { data: buffer, mimetype: 'image/png' } } as any,
      operation: 'create',
      originalDoc: undefined,
      context: {},
    } as any)

    expect(typeof result.thumbhash).toBe('string')
    expect(result.thumbhash.length).toBeGreaterThan(0)
    // valid base64
    expect(() => Buffer.from(result.thumbhash, 'base64')).not.toThrow()
  })

  it('returns data unchanged when no file is present', async () => {
    const data = { alt: 'test' }
    const result = await generateThumbhash({
      data,
      req: {} as any,
      operation: 'update',
      originalDoc: undefined,
      context: {},
    } as any)

    expect(result).toEqual(data)
    expect(result.thumbhash).toBeUndefined()
  })

  it('returns data unchanged when sharp fails (non-fatal)', async () => {
    const data = { alt: 'corrupt' }
    const result = await generateThumbhash({
      data,
      req: { file: { data: Buffer.from('not-an-image'), mimetype: 'image/jpeg' } } as any,
      operation: 'create',
      originalDoc: undefined,
      context: {},
    } as any)

    // hook must not throw — thumbhash may be undefined or missing
    expect(result.alt).toBe('corrupt')
  })
})
```

Run: `pnpm test` → expect RED (file not found).

---

## Step 3 — Implement `generateThumbhash` hook

Create `src/collections/hooks/generateThumbhash.ts`:

```ts
import type { CollectionBeforeChangeHook } from 'payload'
import sharp from 'sharp'
import { rgbaToThumbHash } from 'thumbhash'

export const generateThumbhash: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!req.file?.data) return data
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

Run: `pnpm test` → expect GREEN on all 3 thumbhash tests.

---

## Step 4 — Update `src/collections/Media.ts`

Replace the full file content with:

```ts
import type { CollectionConfig } from 'payload'
import { generateThumbhash } from './hooks/generateThumbhash'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'Images and media files.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [generateThumbhash],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional caption displayed below the image.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      localized: true,
      admin: {
        description: 'Photo credit, e.g. "Photo by Unsplash".',
      },
    },
    {
      name: 'thumbhash',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Base64 ThumbHash for blur placeholder. Auto-generated on upload.',
      },
    },
  ],
  upload: {
    adminFolders: true,
    formatOptions: { format: 'webp', options: { quality: 85 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    disableLocalStorage: true,
  },
}
```

---

## Step 5 — Write Hero fallback test (RED first)

Add to `tests/int/schema.int.spec.ts` (after existing tests):

```ts
describe('HeroSection — properName fallback', () => {
  it('renders DEFAULT_PROPER_NAME when hero.properName is missing', () => {
    // This is a component unit test — run separately via:
    // pnpm vitest run tests/unit/HeroSection.unit.spec.tsx
  })
})
```

Create `tests/unit/HeroSection.unit.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/homepage/HeroSection'
import { NextIntlClientProvider } from 'next-intl'
import { describe, it, expect } from 'vitest'

const messages = {
  hero: { character: 'Character Sheet', playerLabel: 'Player', coreStats: 'Core Stats', bioLabel: 'Bio' },
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="es" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

describe('HeroSection — properName fallback', () => {
  it('renders DEFAULT_PROPER_NAME subtitle when hero has no properName', () => {
    render(
      <Wrapper>
        <HeroSection hero={{ name: 'teomago' }} defaultAvatar="/avatar.jpg" />
      </Wrapper>
    )
    expect(screen.getByText('Mateo Ibagón')).toBeTruthy()
  })

  it('renders hero.properName when provided', () => {
    render(
      <Wrapper>
        <HeroSection hero={{ name: 'teomago', properName: 'Test Name' }} defaultAvatar="/avatar.jpg" />
      </Wrapper>
    )
    expect(screen.getByText('Test Name')).toBeTruthy()
  })
})
```

Update `vitest.config.mts` to include unit tests:

```ts
test: {
  environment: 'jsdom',
  setupFiles: ['./vitest.setup.ts'],
  include: ['tests/int/**/*.int.spec.ts', 'tests/unit/**/*.unit.spec.tsx'],
},
```

Run: `pnpm test` → expect RED (HeroSection component missing properName).

---

## Step 6 — Update `src/globals/Hero.ts`

Add `properName` field and update `name` field defaults:

```ts
import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero — Character Sheet',
  admin: {
    group: 'Content',
    description: 'The landing page character sheet.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'teomago',
      admin: { description: 'Handle / nickname — displayed as the large H1.' },
    },
    {
      name: 'properName',
      type: 'text',
      localized: false,
      defaultValue: 'Mateo Ibagón',
      admin: { description: 'Full legal name — displayed as monospace subtitle below the handle.' },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Full-Stack Developer · Musician · Arts Educator',
      admin: { description: 'Your headline role.' },
    },
    {
      name: 'bio',
      type: 'richText',
      required: true,
      localized: true,
      admin: { description: 'Your bio. Displayed in the Hero section.' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Profile photo. Falls back to the default mockup image.' },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Core Stats (RPG)',
      admin: {
        description: 'Max 6 stats. Displayed as RPG progress bars in the Hero.',
        initCollapsed: false,
      },
      maxRows: 6,
      fields: [
        {
          name: 'statName',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'e.g. TypeScript, Jazz Piano' },
        },
        {
          name: 'value',
          type: 'number',
          required: true,
          min: 1,
          max: 99,
          defaultValue: 75,
          admin: { description: '1–99 RPG stat value.' },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { placeholder: 'GitHub' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { placeholder: 'https://github.com/...' },
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'Link',
          options: [
            { label: 'GitHub', value: 'Github' },
            { label: 'LinkedIn', value: 'Linkedin' },
            { label: 'Twitter / X', value: 'Twitter' },
            { label: 'Instagram', value: 'Instagram' },
            { label: 'YouTube', value: 'Youtube' },
            { label: 'Mail', value: 'Mail' },
            { label: 'External Link', value: 'ExternalLink' },
            { label: 'Link', value: 'Link' },
          ],
        },
      ],
    },
  ],
}
```

---

## Step 7 — Update `src/components/homepage/HeroSection.tsx`

Change the two `DEFAULT_NAME` / `DEFAULT_PROPER_NAME` constants and add the subtitle rendering below the H1. Only modify the constants block and the subtitle JSX — leave all other code intact:

**Constants block (replace):**
```ts
const DEFAULT_NAME = 'teomago'
const DEFAULT_PROPER_NAME = 'Mateo Ibagón'
```

**In the JSX, after the `<motion.h1>` block (the name), insert:**
```tsx
{/* Proper name subtitle */}
<motion.p
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="font-mono text-sm tracking-[0.15em] text-muted uppercase"
>
  {hero?.properName || DEFAULT_PROPER_NAME}
</motion.p>
```

Run: `pnpm test` → expect GREEN on HeroSection unit tests.

---

## Step 8 — Create `src/globals/SiteSettings.ts`

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Config',
    description: 'Stable SEO and branding settings. Decoupled from content that can change over time.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Teomago',
      admin: { description: 'Site name used in SEO titles (e.g. "Teomago — Portfolio").' },
    },
    {
      name: 'siteTagline',
      type: 'text',
      localized: true,
      defaultValue: 'Full-Stack Developer · Musician · Arts Educator',
      admin: { description: 'Default meta description when page-specific description is unavailable.' },
    },
  ],
}
```

---

## Step 9 — Write Skills global test (RED first)

Add to `tests/int/schema.int.spec.ts`:

```ts
describe('Skills global', () => {
  it('returns groups array in es locale', async () => {
    const skills = await payload.findGlobal({ slug: 'skills', locale: 'es' })
    expect(Array.isArray(skills.groups)).toBe(true)
  })

  it('returns groups array in en locale', async () => {
    const skills = await payload.findGlobal({ slug: 'skills', locale: 'en' })
    expect(Array.isArray(skills.groups)).toBe(true)
  })
})

describe('SiteSettings global', () => {
  it('returns a non-empty siteName', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    expect(typeof settings.siteName).toBe('string')
    expect(settings.siteName.length).toBeGreaterThan(0)
  })
})
```

Run: `pnpm test` → expect RED (globals not registered yet).

---

## Step 10 — Create `src/globals/Skills.ts`

```ts
import type { GlobalConfig } from 'payload'

export const Skills: GlobalConfig = {
  slug: 'skills',
  label: 'Skills',
  admin: {
    group: 'Content',
    description: 'Structured skills inventory displayed in the Skills Panel alongside Campaigns.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'groups',
      type: 'array',
      label: 'Skill Groups',
      fields: [
        {
          name: 'groupName',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'e.g. Development, Music, Education' },
        },
        {
          name: 'categories',
          type: 'array',
          fields: [
            {
              name: 'categoryName',
              type: 'text',
              required: true,
              localized: true,
              admin: { placeholder: 'e.g. Frontend, Backend, Jazz' },
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'itemName',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: { placeholder: 'e.g. TypeScript, Jazz Piano' },
                },
                {
                  name: 'level',
                  type: 'number',
                  min: 1,
                  max: 99,
                  admin: { description: '1–99 optional skill level.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

---

## Step 11 — Update `src/payload.config.ts`

Add imports and register new globals; update seoPlugin:

```ts
// New imports
import { Skills } from './globals/Skills'
import { SiteSettings } from './globals/SiteSettings'

// Update globals array:
globals: [Hero, Skills, SiteSettings],

// Replace seoPlugin config:
seoPlugin({
  collections: ['quests'],
  globals: ['hero'],
  uploadsCollection: 'media',
  tabbedUI: true,
  generateTitle: async ({ doc, req }) => {
    try {
      const settings = await req.payload.findGlobal({ slug: 'site-settings' })
      const siteName = settings?.siteName ?? 'Teomago'
      const suffix = (doc as any)?.title ?? (doc as any)?.name ?? ''
      return suffix ? `${siteName} — ${suffix}` : siteName
    } catch {
      return 'Teomago'
    }
  },
  generateDescription: async ({ doc, req }) => {
    try {
      const settings = await req.payload.findGlobal({
        slug: 'site-settings',
        locale: (req as any).locale ?? 'es',
      })
      return (doc as any)?.role ?? settings?.siteTagline ?? ''
    } catch {
      return ''
    }
  },
  generateURL: ({ doc, collectionSlug }) =>
    collectionSlug === 'quests'
      ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/quests/${(doc as any)?.slug}`
      : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
}),
```

Run: `pnpm test` → expect GREEN on Skills and SiteSettings global tests.

---

## Step 12 — Regenerate Payload types

```bash
pnpm payload generate:types
```

Verify `src/payload-types.ts` includes `Skills`, `SiteSettings`, and the updated `Hero` (with `properName`) and `Media` (with `caption`, `credit`, `thumbhash`) types.

---

## Step 13 — Run migrations

```bash
pnpm payload migrate:create --name rfc-003-media-hero-skills
pnpm payload migrate
```

Expected migration changes:
- `media` table: add `caption` (text, nullable), `credit` (text, nullable), `thumbhash` (text, nullable)
- `hero` table: add `proper_name` (text, nullable)
- new `skills` global table
- new `site_settings` global table

---

## Step 14 — Create `src/components/homepage/SkillsPanel.tsx`

```tsx
'use client'
import { motion } from 'framer-motion'
import type { Skills } from '@/payload-types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 10, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
}

export function SkillsPanel({ skills }: { skills: Skills }) {
  const groups = skills?.groups ?? []

  return (
    <section className="py-24 border-b border-border bg-void-dark/50">
      <div className="container mx-auto px-6">
        {/* Section header: Void Forge Aesthetic */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs text-cyan animate-pulse">◈</span>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted">
            SYSTEM_SKILLS_v2.1
          </span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-10"
        >
          {groups.map((group, gi) => (
            <div key={gi} className="space-y-4">
              <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-green border-l-2 border-green pl-3">
                {group.groupName}
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {(group.categories ?? []).map((cat, ci) => (
                  <div key={ci} className="space-y-3">
                    <p className="font-mono text-[9px] tracking-widest uppercase text-muted/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted/40 rotate-45" />
                      {cat.categoryName}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {(cat.items ?? []).map((item, ii) => (
                        <motion.span
                          key={ii}
                          variants={itemVariants}
                          whileHover={{ y: -1, borderColor: 'var(--color-cyan)', boxShadow: 'var(--shadow-glow-cyan)' }}
                          className="inline-flex items-center gap-2 px-3 py-1.5
                                     font-mono text-[10px] text-foreground/80
                                     bg-surface-elevated border border-border rounded-sharp
                                     hover:text-cyan transition-all duration-200 cursor-default"
                        >
                          <span className="w-1 h-1 bg-cyan/50" />
                          {item.itemName}
                          {item.level != null && (
                            <span className="text-[9px] text-cyan/40 tabular-nums">[{item.level}]</span>
                          )}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

---

## Step 15 — Update `src/app/[locale]/(frontend)/page.tsx`

Add `SkillsPanel` import and `Skills` data fetch; wrap `CampaignsSection` + `SkillsPanel` in the 60/40 grid:

```tsx
// Add import
import { SkillsPanel } from '@/components/homepage/SkillsPanel'

// In generateMetadata — update to use SiteSettings:
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayload({ config })
  const [hero, settings] = await Promise.all([
    payload.findGlobal({ slug: 'hero', locale: locale as 'en' | 'es' }),
    payload.findGlobal({ slug: 'site-settings', locale: locale as 'en' | 'es' }),
  ])
  return {
    title: `${settings?.siteName ?? 'Teomago'} — ${hero?.properName ?? 'Portfolio'}`,
    description: hero?.role ?? settings?.siteTagline ?? '',
  }
}

// In HomePage — add skillsResult to Promise.all:
const [hero, statsResult, questsResult, campaignsResult, skillsResult] = await Promise.all([
  payload.findGlobal({ slug: 'hero', locale: locale as 'en' | 'es' }),
  payload.find({ collection: 'stats', sort: '-level', limit: 24, locale: locale as 'en' | 'es' }),
  payload.find({
    collection: 'quests',
    sort: 'sortOrder',
    limit: 20,
    locale: locale as 'en' | 'es',
    where: { _status: { equals: 'published' } },
  }),
  payload.find({ collection: 'campaigns', sort: '-startDate', limit: 10, locale: locale as 'en' | 'es' }),
  payload.findGlobal({ slug: 'skills', locale: locale as 'en' | 'es' }),
])

// Replace standalone <CampaignsSection /> with the 60/40 grid:
<div className="grid grid-cols-1 lg:grid-cols-10 gap-0 lg:gap-8">
  <div className="lg:col-span-6">
    <CampaignsSection campaigns={campaignsResult.docs} />
  </div>
  <div className="lg:col-span-4">
    <SkillsPanel skills={skillsResult} />
  </div>
</div>
```

---

## Step 16 — Final verification

```bash
# All tests pass
pnpm test

# TypeScript strict check
pnpm tsc --noEmit

# Dev server smoke test
pnpm dev
# Visit http://localhost:3000/es — verify:
# [ ] "teomago" appears as H1
# [ ] "Mateo Ibagón" appears as monospace subtitle below H1
# [ ] Skills panel renders alongside Campaigns in 60/40 grid
# [ ] Payload admin > Media shows caption/credit fields and folder support
# [ ] Payload admin > Site Settings global exists under Config group
# [ ] Payload admin > Skills global exists under Content group
# [ ] pnpm build passes
pnpm build
```

---

## Commit messages (one per logical change)

```
feat: add generateThumbhash hook with base64 serialization and guard clause
feat: update Media collection — WebP conversion, adminFolders, caption/credit/thumbhash fields
feat: update Hero global — add properName field, change name default to 'teomago'
feat: add SiteSettings global for stable SEO branding
feat: add Skills global with groups/categories/items schema
feat: update payload.config — register Skills+SiteSettings, decouple SEO from Hero
chore: regenerate payload-types after RFC-003 schema changes
feat: update HeroSection — render properName as monospace subtitle
feat: add SkillsPanel client component with framer-motion stagger
feat: update homepage — add Skills fetch and 60/40 Campaigns+Skills grid
```

---

## Success Criteria

| Criterion | Verifiable by |
|-----------|--------------|
| All Vitest tests GREEN | `pnpm test` |
| TypeScript strict — no errors | `pnpm tsc --noEmit` |
| ThumbHash generated on image upload | manual: upload image, inspect `thumbhash` field in DB |
| Media stored as WebP | manual: upload JPEG, verify R2 stores `.webp` |
| Admin folders enabled in Media | manual: check Media admin panel |
| H1 shows "teomago", subtitle shows "Mateo Ibagón" | browser |
| SiteSettings global editable in admin | Payload admin > Config > Site Settings |
| Skills panel renders at 60/40 beside Campaigns | browser (lg breakpoint) |
| `pnpm build` passes | automated |
