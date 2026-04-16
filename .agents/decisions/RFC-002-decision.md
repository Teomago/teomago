# RFC-002-decision — Core Schema & "Dark-Grim" RPG Design
**Phase:** 3 — Decision
**Date:** 2026-04-15
**RFC:** `.agents/specs/RFC-002-core-schema-and-design.md`
**Audit:** `.agents/audits/RFC-002-audit.md`
**Status:** PENDING TEO APPROVAL

---

## Design Direction — "The Void Forge"

This portfolio is NOT a generic developer resume. It is a **living artifact** — a character sheet from a real RPG campaign, executed at a premium level. The design draws directly from Teo's Master's thesis concept: *la forja encendida* (the forge burning), where uncertainty becomes strength and identity is a resilient, evolving criterion.

### Typography System
| Role | Font | Usage |
|------|------|-------|
| Display / Name | `Unbounded` | Main name, section titles — bold, game-title weight |
| UI / Stats | `Chakra Petch` | Stat names, labels, category badges — HUD feel |
| Numbers / Code | `JetBrains Mono` | Stat levels (1–99), stack pills, dates |
| Body / Bio | `Crimson Pro` | Bio text, descriptions — editorial contrast against the tech |

All fonts via `next/font/google`. No CDN imports.

### Color Tokens (Void Forge Palette)
```css
/* app/globals.css — @theme block */
@theme {
  --color-void: #000000;           /* OLED background */
  --color-surface: #0a0a0a;        /* Cards, sections */
  --color-surface-elevated: #111111; /* Hover states, elevated elements */
  --color-border: #1f1f1f;         /* Subtle borders */
  --color-border-glow: #2a2a2a;    /* Card border on hover */
  --color-muted: #6b7280;          /* Secondary text */
  --color-foreground: #e8e8e8;     /* Primary text */
  --color-name: #ffffff;            /* Name / hero display */

  /* Accents */
  --color-cyan: #00d4ff;            /* Tech / programming */
  --color-green: #00ff88;           /* Music / arts */
  --color-amber: #ff8c00;           /* Coffee / forge / Lighthouse */
  --color-red: #ff3366;             /* Status: In Progress / Side Quest */

  /* Glows */
  --color-glow-cyan: rgba(0, 212, 255, 0.12);
  --color-glow-green: rgba(0, 255, 136, 0.10);
  --color-glow-amber: rgba(255, 140, 0, 0.10);

  /* Typography */
  --font-display: 'Unbounded', sans-serif;
  --font-ui: 'Chakra Petch', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Crimson Pro', serif;
}
```

### Memorable Design Details
- **Grain noise overlay** — subtle CSS `noise` texture across the entire page via a fixed pseudo-element
- **Stat bar animation** — bars animate width from 0% → level% on first viewport entry (framer-motion `useInView`)
- **Glow pulse** at the tip of each stat bar (`@keyframes pulse-glow`)
- **Section prefix** — all section headers use `◈` as a decorative glyph
- **Card hover** — asymmetric transform: `translate(-2px, -4px) rotate(-0.3deg)` with border glow
- **Avatar scanline** — CSS scanline overlay on the hero avatar
- **Category accent mapping:**
  - `Tech / Frontend / Backend` → cyan
  - `Music / Audio Engineering` → green
  - `Education / Art` → amber
  - `Coffee` → amber

---

## Execution Phases

### Phase 2A — Payload Schema
### Phase 2B — Frontend Skeleton + Theme
### Phase 2C — Animations, Polish & Extra Mile

---

## Phase 2A — Payload Schema

> Executor MUST complete Phase 2A fully before starting 2B. Do not combine phases.

---

### 2A-Step 1 — Install Phase 2A dependencies

```bash
pnpm add @payloadcms/plugin-seo standard-slugify
pnpm add -D @types/standard-slugify
```

---

### 2A-Step 2 — Verify or create the `Media` collection

`create-payload-app` likely generated a `Media` collection. Verify it exists at `src/collections/Media.ts`.

If it exists, **replace** its content with:

```ts
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'Images and media files.',
  },
  access: {
    read: () => true,
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
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    disableLocalStorage: true, // R2 handles storage
  },
}
```

---

### 2A-Step 3 — Create the slug field utility

Port the slug field from tuherenciafacil. Create these files exactly:

**`src/fields/slug/slugify.ts`:**
```ts
import format from 'standard-slugify'

export const slugify = (value: string): string => format(value)
export default slugify
```

**`src/fields/slug/hooks/formatSlug.ts`:**
```ts
import type { FieldHook } from 'payload'
import { slugify } from '../slugify'

export const formatSlug =
  (fieldToUse: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string' && value !== '/') {
      return slugify(value)
    }

    const fieldData = data?.[fieldToUse] || originalDoc?.[fieldToUse]
    if (operation === 'create' && !value && typeof fieldData === 'string') {
      return slugify(fieldData)
    }

    return value
  }
```

**`src/fields/slug/hooks/generateSlug.ts`:**
```ts
import type { FieldHook } from 'payload'
import { slugify } from '../slugify'

type GenerateSlugArgs = {
  fieldName: string
  fieldToUse: string
}

export const generateSlug =
  ({ fieldName, fieldToUse }: GenerateSlugArgs): FieldHook =>
  ({ value, data, originalDoc, operation }) => {
    // Auto-generate on create if the generate flag is true and slug is empty
    if (
      value === true &&
      operation === 'create' &&
      typeof (data?.[fieldToUse] ?? originalDoc?.[fieldToUse]) === 'string'
    ) {
      const source = (data?.[fieldToUse] ?? originalDoc?.[fieldToUse]) as string
      return slugify(source)
    }
    return value
  }
```

**`src/fields/slug/index.ts`:**
```ts
import type { RowField, TextField } from 'payload'
import { generateSlug } from './hooks/generateSlug'
import { formatSlug } from './hooks/formatSlug'

type SlugOptions = {
  name?: string
  index?: boolean
  required?: boolean
  unique?: boolean
}

export const slugField = (
  fieldToUse = 'title',
  options: SlugOptions = {},
): RowField => {
  const {
    name: fieldName = 'slug',
    index = true,
    required = true,
    unique = true,
  } = options

  return {
    type: 'row',
    admin: {
      position: 'sidebar',
    },
    fields: [
      {
        name: 'generateSlug',
        type: 'checkbox',
        admin: {
          hidden: true,
          disableBulkEdit: true,
          disableListColumn: true,
          disableListFilter: true,
        },
        defaultValue: true,
        hooks: {
          beforeChange: [generateSlug({ fieldName, fieldToUse })],
        },
      } satisfies TextField['hooks'] extends unknown ? any : never,
      {
        name: fieldName,
        type: 'text',
        label: 'Slug',
        admin: {
          width: '100%',
          description: 'Auto-generated from title. Do not change after publishing.',
        },
        hooks: {
          beforeValidate: [formatSlug(fieldToUse)],
        },
        index,
        required,
        unique,
      },
    ],
  }
}
```

---

### 2A-Step 4 — Create the `Hero` Global

```ts
// src/globals/Hero.ts
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
      defaultValue: 'Mateo Ibagón',
      admin: { description: 'Your full name.' },
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
      admin: {
        description: 'Your bio. Displayed in the Hero section.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo. Falls back to the default mockup image.',
      },
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

### 2A-Step 5 — Create the `Quests` collection

```ts
// src/collections/Quests.ts
import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

const LUCIDE_ICONS = [
  // Development
  { label: 'Code', value: 'Code' }, { label: 'Terminal', value: 'Terminal' },
  { label: 'Database', value: 'Database' }, { label: 'Server', value: 'Server' },
  { label: 'Cloud', value: 'Cloud' }, { label: 'Cpu', value: 'Cpu' },
  { label: 'Binary', value: 'Binary' }, { label: 'Braces', value: 'Braces' },
  { label: 'FileCode', value: 'FileCode' }, { label: 'FileCode2', value: 'FileCode2' },
  { label: 'FileTerminal', value: 'FileTerminal' }, { label: 'Layers', value: 'Layers' },
  { label: 'Package', value: 'Package' }, { label: 'Puzzle', value: 'Puzzle' },
  { label: 'Settings', value: 'Settings' }, { label: 'Settings2', value: 'Settings2' },
  { label: 'Wrench', value: 'Wrench' }, { label: 'Bug', value: 'Bug' },
  { label: 'Globe', value: 'Globe' }, { label: 'Globe2', value: 'Globe2' },
  { label: 'Network', value: 'Network' }, { label: 'Wifi', value: 'Wifi' },
  { label: 'HardDrive', value: 'HardDrive' }, { label: 'Monitor', value: 'Monitor' },
  { label: 'Laptop', value: 'Laptop' }, { label: 'Smartphone', value: 'Smartphone' },
  { label: 'Keyboard', value: 'Keyboard' }, { label: 'GitBranch', value: 'GitBranch' },
  { label: 'GitCommit', value: 'GitCommit' }, { label: 'GitFork', value: 'GitFork' },
  { label: 'GitMerge', value: 'GitMerge' }, { label: 'GitPullRequest', value: 'GitPullRequest' },
  { label: 'Github', value: 'Github' }, { label: 'Lock', value: 'Lock' },
  { label: 'Unlock', value: 'Unlock' }, { label: 'Shield', value: 'Shield' },
  { label: 'ShieldCheck', value: 'ShieldCheck' }, { label: 'Key', value: 'Key' },
  { label: 'Fingerprint', value: 'Fingerprint' }, { label: 'Zap', value: 'Zap' },
  { label: 'Activity', value: 'Activity' }, { label: 'BarChart', value: 'BarChart' },
  { label: 'BarChart2', value: 'BarChart2' }, { label: 'BarChart3', value: 'BarChart3' },
  { label: 'PieChart', value: 'PieChart' }, { label: 'LineChart', value: 'LineChart' },
  { label: 'TrendingUp', value: 'TrendingUp' }, { label: 'TrendingDown', value: 'TrendingDown' },
  { label: 'RefreshCw', value: 'RefreshCw' }, { label: 'RotateCw', value: 'RotateCw' },
  // Music & Audio
  { label: 'Music', value: 'Music' }, { label: 'Music2', value: 'Music2' },
  { label: 'Music3', value: 'Music3' }, { label: 'Music4', value: 'Music4' },
  { label: 'Headphones', value: 'Headphones' }, { label: 'Mic', value: 'Mic' },
  { label: 'Mic2', value: 'Mic2' }, { label: 'MicOff', value: 'MicOff' },
  { label: 'Radio', value: 'Radio' }, { label: 'Volume', value: 'Volume' },
  { label: 'Volume1', value: 'Volume1' }, { label: 'Volume2', value: 'Volume2' },
  { label: 'VolumeX', value: 'VolumeX' }, { label: 'Guitar', value: 'Guitar' },
  { label: 'Piano', value: 'Piano' }, { label: 'Drum', value: 'Drum' },
  { label: 'Disc', value: 'Disc' }, { label: 'Disc2', value: 'Disc2' },
  { label: 'Disc3', value: 'Disc3' }, { label: 'AudioWaveform', value: 'AudioWaveform' },
  { label: 'Waves', value: 'Waves' }, { label: 'Play', value: 'Play' },
  { label: 'Pause', value: 'Pause' }, { label: 'SkipBack', value: 'SkipBack' },
  { label: 'SkipForward', value: 'SkipForward' }, { label: 'Rewind', value: 'Rewind' },
  { label: 'FastForward', value: 'FastForward' }, { label: 'Repeat', value: 'Repeat' },
  { label: 'Shuffle', value: 'Shuffle' }, { label: 'ListMusic', value: 'ListMusic' },
  { label: 'Speaker', value: 'Speaker' }, { label: 'Sliders', value: 'Sliders' },
  // Art & Design
  { label: 'Palette', value: 'Palette' }, { label: 'Brush', value: 'Brush' },
  { label: 'Pen', value: 'Pen' }, { label: 'PenTool', value: 'PenTool' },
  { label: 'Pencil', value: 'Pencil' }, { label: 'Paintbrush', value: 'Paintbrush' },
  { label: 'Paintbrush2', value: 'Paintbrush2' }, { label: 'Feather', value: 'Feather' },
  { label: 'Crop', value: 'Crop' }, { label: 'Scissors', value: 'Scissors' },
  { label: 'Ruler', value: 'Ruler' }, { label: 'DraftingCompass', value: 'DraftingCompass' },
  { label: 'Image', value: 'Image' }, { label: 'ImagePlus', value: 'ImagePlus' },
  { label: 'Camera', value: 'Camera' }, { label: 'Aperture', value: 'Aperture' },
  { label: 'Film', value: 'Film' }, { label: 'Clapperboard', value: 'Clapperboard' },
  { label: 'Tv', value: 'Tv' }, { label: 'MonitorPlay', value: 'MonitorPlay' },
  { label: 'Frame', value: 'Frame' }, { label: 'Shapes', value: 'Shapes' },
  { label: 'Circle', value: 'Circle' }, { label: 'Triangle', value: 'Triangle' },
  { label: 'Hexagon', value: 'Hexagon' }, { label: 'Figma', value: 'Figma' },
  // Education & Research
  { label: 'Book', value: 'Book' }, { label: 'BookOpen', value: 'BookOpen' },
  { label: 'BookCopy', value: 'BookCopy' }, { label: 'BookMarked', value: 'BookMarked' },
  { label: 'GraduationCap', value: 'GraduationCap' }, { label: 'School', value: 'School' },
  { label: 'Microscope', value: 'Microscope' }, { label: 'FlaskConical', value: 'FlaskConical' },
  { label: 'TestTube', value: 'TestTube' }, { label: 'Brain', value: 'Brain' },
  { label: 'Lightbulb', value: 'Lightbulb' }, { label: 'LightbulbOff', value: 'LightbulbOff' },
  { label: 'Compass', value: 'Compass' }, { label: 'Map', value: 'Map' },
  { label: 'Award', value: 'Award' }, { label: 'Medal', value: 'Medal' },
  { label: 'Trophy', value: 'Trophy' }, { label: 'Target', value: 'Target' },
  { label: 'Atom', value: 'Atom' },
  // Social
  { label: 'Twitter', value: 'Twitter' }, { label: 'Instagram', value: 'Instagram' },
  { label: 'Linkedin', value: 'Linkedin' }, { label: 'Youtube', value: 'Youtube' },
  { label: 'Facebook', value: 'Facebook' }, { label: 'Discord', value: 'Discord' },
  { label: 'Slack', value: 'Slack' }, { label: 'Mail', value: 'Mail' },
  { label: 'MailOpen', value: 'MailOpen' }, { label: 'MessageCircle', value: 'MessageCircle' },
  { label: 'MessageSquare', value: 'MessageSquare' }, { label: 'Phone', value: 'Phone' },
  { label: 'PhoneCall', value: 'PhoneCall' }, { label: 'Video', value: 'Video' },
  { label: 'VideoOff', value: 'VideoOff' }, { label: 'Link', value: 'Link' },
  { label: 'Link2', value: 'Link2' }, { label: 'ExternalLink', value: 'ExternalLink' },
  { label: 'Share', value: 'Share' }, { label: 'Share2', value: 'Share2' },
  { label: 'Send', value: 'Send' }, { label: 'Rss', value: 'Rss' },
  { label: 'AtSign', value: 'AtSign' }, { label: 'Hash', value: 'Hash' },
  { label: 'User', value: 'User' }, { label: 'Users', value: 'Users' },
  { label: 'UserPlus', value: 'UserPlus' }, { label: 'UserCheck', value: 'UserCheck' },
  { label: 'Contact', value: 'Contact' },
  // RPG / Portfolio flavor
  { label: 'Sword', value: 'Sword' }, { label: 'ShieldAlert', value: 'ShieldAlert' },
  { label: 'Wand', value: 'Wand' }, { label: 'Wand2', value: 'Wand2' },
  { label: 'Sparkles', value: 'Sparkles' }, { label: 'Star', value: 'Star' },
  { label: 'Heart', value: 'Heart' }, { label: 'Flame', value: 'Flame' },
  { label: 'Crown', value: 'Crown' }, { label: 'Gem', value: 'Gem' },
  { label: 'Scroll', value: 'Scroll' }, { label: 'MapPin', value: 'MapPin' },
  { label: 'Navigation', value: 'Navigation' }, { label: 'Crosshair', value: 'Crosshair' },
  { label: 'Swords', value: 'Swords' }, { label: 'Ghost', value: 'Ghost' },
  // General/UI
  { label: 'Home', value: 'Home' }, { label: 'Layout', value: 'Layout' },
  { label: 'Grid', value: 'Grid' }, { label: 'List', value: 'List' },
  { label: 'Columns', value: 'Columns' }, { label: 'Sidebar', value: 'Sidebar' },
  { label: 'Menu', value: 'Menu' }, { label: 'Search', value: 'Search' },
  { label: 'Filter', value: 'Filter' }, { label: 'Download', value: 'Download' },
  { label: 'Upload', value: 'Upload' }, { label: 'Calendar', value: 'Calendar' },
  { label: 'Clock', value: 'Clock' }, { label: 'Timer', value: 'Timer' },
  { label: 'Bookmark', value: 'Bookmark' }, { label: 'Tag', value: 'Tag' },
  { label: 'Tags', value: 'Tags' }, { label: 'Flag', value: 'Flag' },
  { label: 'Bell', value: 'Bell' }, { label: 'Coffee', value: 'Coffee' },
  { label: 'Briefcase', value: 'Briefcase' }, { label: 'Building', value: 'Building' },
  { label: 'Building2', value: 'Building2' }, { label: 'Store', value: 'Store' },
  { label: 'DollarSign', value: 'DollarSign' }, { label: 'CreditCard', value: 'CreditCard' },
  { label: 'Infinity', value: 'Infinity' }, { label: 'Info', value: 'Info' },
  { label: 'HelpCircle', value: 'HelpCircle' }, { label: 'AlertTriangle', value: 'AlertTriangle' },
  { label: 'Eye', value: 'Eye' }, { label: 'EyeOff', value: 'EyeOff' },
  { label: 'Sun', value: 'Sun' }, { label: 'Moon', value: 'Moon' },
  { label: 'Wind', value: 'Wind' },
]

export const Quests: CollectionConfig = {
  slug: 'quests',
  labels: { singular: 'Quest', plural: 'Quests' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'status', 'sortOrder', 'updatedAt'],
    description: 'Projects displayed as RPG quests.',
    defaultSort: 'sortOrder',
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    slugField('title'),
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 99,
      admin: {
        position: 'sidebar',
        description: 'Lower = appears first. 1=fjpp, 2=heionhub, 3=thesis, 4=Canadian College.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured quests appear prominently in the grid.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Tech', value: 'tech' },
        { label: 'Music', value: 'music' },
        { label: 'Art', value: 'art' },
        { label: 'Coffee', value: 'coffee' },
        { label: 'Education', value: 'education' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [
        { label: '✓ Completed', value: 'completed' },
        { label: '⟳ In Progress', value: 'in-progress' },
        { label: '◎ Side Quest', value: 'side-quest' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Falls back to the default mockup image if not set.',
      },
    },
    {
      name: 'stack',
      type: 'array',
      label: 'Tech Stack',
      fields: [
        {
          name: 'techName',
          type: 'text',
          required: true,
          admin: { placeholder: 'e.g. Next.js, TypeScript' },
        },
        {
          name: 'icon',
          type: 'select',
          options: LUCIDE_ICONS,
          defaultValue: 'Code',
        },
      ],
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Live URL or GitHub link.',
        placeholder: 'https://...',
      },
    },
  ],
}
```

---

### 2A-Step 6 — Create the `Stats` collection

```ts
// src/collections/Stats.ts
import type { CollectionConfig } from 'payload'

export const Stats: CollectionConfig = {
  slug: 'stats',
  labels: { singular: 'Stat', plural: 'Stats' },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'category', 'level', 'updatedAt'],
    defaultSort: '-level',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      min: 1,
      max: 99,
      defaultValue: 75,
      admin: { description: '1–99. This is your RPG skill level.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Music', value: 'music' },
        { label: 'Audio Engineering', value: 'audio-engineering' },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'Code',
      admin: {
        description: 'Lucide icon displayed next to the stat.',
      },
      options: [
        // Development
        { label: 'Code', value: 'Code' }, { label: 'Terminal', value: 'Terminal' },
        { label: 'Database', value: 'Database' }, { label: 'Server', value: 'Server' },
        { label: 'Cloud', value: 'Cloud' }, { label: 'Cpu', value: 'Cpu' },
        { label: 'Binary', value: 'Binary' }, { label: 'Braces', value: 'Braces' },
        { label: 'FileCode', value: 'FileCode' }, { label: 'Layers', value: 'Layers' },
        { label: 'Package', value: 'Package' }, { label: 'Globe', value: 'Globe' },
        { label: 'GitBranch', value: 'GitBranch' }, { label: 'Shield', value: 'Shield' },
        { label: 'Zap', value: 'Zap' }, { label: 'Activity', value: 'Activity' },
        // Music
        { label: 'Music', value: 'Music' }, { label: 'Music2', value: 'Music2' },
        { label: 'Headphones', value: 'Headphones' }, { label: 'Mic', value: 'Mic' },
        { label: 'Guitar', value: 'Guitar' }, { label: 'Piano', value: 'Piano' },
        { label: 'Drum', value: 'Drum' }, { label: 'AudioWaveform', value: 'AudioWaveform' },
        { label: 'Waves', value: 'Waves' }, { label: 'Sliders', value: 'Sliders' },
        // Art / Education
        { label: 'Palette', value: 'Palette' }, { label: 'Brush', value: 'Brush' },
        { label: 'Pen', value: 'Pen' }, { label: 'PenTool', value: 'PenTool' },
        { label: 'Brain', value: 'Brain' }, { label: 'GraduationCap', value: 'GraduationCap' },
        { label: 'BookOpen', value: 'BookOpen' }, { label: 'Lightbulb', value: 'Lightbulb' },
        // General
        { label: 'Star', value: 'Star' }, { label: 'Sparkles', value: 'Sparkles' },
        { label: 'Gem', value: 'Gem' }, { label: 'Flame', value: 'Flame' },
        { label: 'Coffee', value: 'Coffee' }, { label: 'Feather', value: 'Feather' },
      ],
    },
  ],
}
```

---

### 2A-Step 7 — Create the `Campaigns` collection

```ts
// src/collections/Campaigns.ts
import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  labels: { singular: 'Campaign', plural: 'Campaigns' },
  admin: {
    useAsTitle: 'company',
    group: 'Content',
    defaultColumns: ['company', 'role', 'startDate', 'isCurrent', 'updatedAt'],
    defaultSort: '-startDate',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'isCurrent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if this is your current position. Hides end date.',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        condition: (data) => !data?.isCurrent,
        description: 'Leave empty if current.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'questRewards',
      type: 'array',
      label: 'Quest Rewards / Achievements',
      fields: [
        {
          name: 'achievementName',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'e.g. Launched SPC platform for 1500+ students' },
        },
      ],
    },
  ],
}
```

---

### 2A-Step 8 — Update `payload.config.ts` with all new collections, globals, and plugins

Add to the existing `payload.config.ts`:

```ts
// New imports to add:
import { Hero } from '@/globals/Hero'
import { Quests } from '@/collections/Quests'
import { Stats } from '@/collections/Stats'
import { Campaigns } from '@/collections/Campaigns'
import { seoPlugin } from '@payloadcms/plugin-seo'

// In buildConfig:
globals: [Hero],
collections: [
  // ... existing (Media, Users)
  Quests,
  Stats,
  Campaigns,
],
plugins: [
  // ... existing (s3Storage)
  seoPlugin({
    globals: ['hero'],
    collections: ['quests'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) =>
      `Teomago — ${(doc as any)?.title ?? (doc as any)?.name ?? 'Portfolio'}`,
    generateDescription: ({ doc }) =>
      (doc as any)?.role ?? '',
    generateURL: ({ doc, collectionSlug }) =>
      collectionSlug === 'quests'
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/quests/${(doc as any)?.slug}`
        : process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  }),
],
```

---

### 2A-Step 9 — Phase 2A tests (RED first, then GREEN)

```ts
// tests/integration/schema.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import payload from 'payload'
import config from '@/payload.config'

beforeAll(async () => {
  await payload.init({ config, local: true })
})

describe('Payload schema — Phase 2A', () => {
  it('creates a Quest document', async () => {
    const quest = await payload.create({
      collection: 'quests',
      data: {
        title: 'Test Quest',
        category: 'tech',
        status: 'completed',
        sortOrder: 1,
        description: { root: { children: [], type: 'root', version: 1 } },
      },
    })
    expect(quest.id).toBeDefined()
    expect(quest.slug).toBe('test-quest')
  })

  it('rejects duplicate Quest slugs', async () => {
    await payload.create({
      collection: 'quests',
      data: {
        title: 'Duplicate Quest',
        slug: 'duplicate-quest',
        category: 'tech',
        status: 'completed',
        sortOrder: 99,
        description: { root: { children: [], type: 'root', version: 1 } },
      },
    })
    await expect(
      payload.create({
        collection: 'quests',
        data: {
          title: 'Another Quest',
          slug: 'duplicate-quest',
          category: 'tech',
          status: 'completed',
          sortOrder: 99,
          description: { root: { children: [], type: 'root', version: 1 } },
        },
      })
    ).rejects.toThrow()
  })

  it('creates a Stat document', async () => {
    const stat = await payload.create({
      collection: 'stats',
      data: { name: 'TypeScript', level: 88, category: 'frontend', icon: 'Code' },
    })
    expect(stat.id).toBeDefined()
  })

  it('creates a Campaign document', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: {
        company: 'Test Co',
        role: 'Developer',
        startDate: '2022-01-01T00:00:00.000Z',
        isCurrent: false,
        endDate: '2023-01-01T00:00:00.000Z',
        description: { root: { children: [], type: 'root', version: 1 } },
        questRewards: [],
      },
    })
    expect(campaign.id).toBeDefined()
  })

  it('hides endDate when isCurrent is true', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: {
        company: 'Current Co',
        role: 'Lead Dev',
        startDate: '2024-01-01T00:00:00.000Z',
        isCurrent: true,
        description: { root: { children: [], type: 'root', version: 1 } },
        questRewards: [],
      },
    })
    expect(campaign.isCurrent).toBe(true)
    expect(campaign.endDate).toBeUndefined()
  })
})
```

Run: `pnpm test` — all tests must pass GREEN before proceeding to Phase 2B.

---

## Phase 2B — Frontend Skeleton + Theme

---

### 2B-Step 1 — Install Phase 2B dependencies

```bash
pnpm add framer-motion
pnpm add next-intl  # should already be installed from RFC-001
```

---

### 2B-Step 2 — Configure `next/font` in root layout

```ts
// app/layout.tsx (or app/[locale]/layout.tsx)
import { Unbounded, Chakra_Petch, JetBrains_Mono, Crimson_Pro } from 'next/font/google'

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
})

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})

// Apply all four as className on <html>:
// className={`${unbounded.variable} ${chakraPetch.variable} ${jetbrainsMono.variable} ${crimsonPro.variable}`}
```

---

### 2B-Step 3 — Update `app/globals.css`

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Void Forge Palette */
  --color-void: #000000;
  --color-surface: #0a0a0a;
  --color-surface-elevated: #111111;
  --color-border: #1f1f1f;
  --color-border-glow: #2a2a2a;
  --color-muted: #6b7280;
  --color-foreground: #e8e8e8;
  --color-name: #ffffff;
  --color-cyan: #00d4ff;
  --color-green: #00ff88;
  --color-amber: #ff8c00;
  --color-red: #ff3366;
  --color-glow-cyan: rgba(0, 212, 255, 0.12);
  --color-glow-green: rgba(0, 255, 136, 0.10);
  --color-glow-amber: rgba(255, 140, 0, 0.10);

  /* Typography */
  --font-display: var(--font-unbounded), sans-serif;
  --font-ui: var(--font-chakra-petch), sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
  --font-body: var(--font-crimson-pro), serif;
}

/* Base */
* { box-sizing: border-box; }

html {
  background-color: var(--color-void);
  color: var(--color-foreground);
  scroll-behavior: smooth;
  font-family: var(--font-body);
}

/* Grain noise overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* Glow pulse animation for stat bar tips */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 4px 1px currentColor; opacity: 1; }
  50% { box-shadow: 0 0 12px 3px currentColor; opacity: 0.7; }
}

/* Scanline effect for avatar */
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

---

### 2B-Step 4 — Complete next-intl setup

Ensure `app/[locale]/layout.tsx` wraps content with `NextIntlClientProvider`.

Populate `messages/es.json` and `messages/en.json` with:

```json
// messages/es.json
{
  "nav": {
    "stats": "Atributos",
    "quests": "Misiones",
    "campaigns": "Campañas",
    "contact": "Contacto"
  },
  "hero": {
    "viewQuest": "Ver Misión",
    "level": "Nivel",
    "character": "Hoja de Personaje"
  },
  "quests": {
    "status": {
      "completed": "Completada",
      "in-progress": "En Progreso",
      "side-quest": "Misión Secundaria"
    },
    "viewProject": "Ver Proyecto"
  },
  "campaigns": {
    "present": "Presente",
    "rewards": "Logros Obtenidos"
  }
}
```

```json
// messages/en.json
{
  "nav": {
    "stats": "Attributes",
    "quests": "Quests",
    "campaigns": "Campaigns",
    "contact": "Contact"
  },
  "hero": {
    "viewQuest": "View Quest",
    "level": "Level",
    "character": "Character Sheet"
  },
  "quests": {
    "status": {
      "completed": "Completed",
      "in-progress": "In Progress",
      "side-quest": "Side Quest"
    },
    "viewProject": "View Project"
  },
  "campaigns": {
    "present": "Present",
    "rewards": "Rewards Earned"
  }
}
```

---

### 2B-Step 5 — Build the homepage `app/[locale]/page.tsx`

The page fetches all data server-side via Payload Local API and passes it to client components.

```tsx
// app/[locale]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { HeroSection } from '@/components/homepage/HeroSection'
import { StatsSection } from '@/components/homepage/StatsSection'
import { QuestsSection } from '@/components/homepage/QuestsSection'
import { CampaignsSection } from '@/components/homepage/CampaignsSection'
import type { Metadata } from 'next'

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?w=900&auto=format&fit=crop&q=60'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })
  const hero = await payload.findGlobal({ slug: 'hero' })
  return {
    title: `Teomago — ${hero?.name ?? 'Portfolio'}`,
    description: hero?.role ?? 'Full-Stack Developer · Musician · Arts Educator',
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [hero, statsResult, questsResult, campaignsResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero' }),
    payload.find({ collection: 'stats', sort: '-level', limit: 24 }),
    payload.find({ collection: 'quests', sort: 'sortOrder', limit: 20, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'campaigns', sort: '-startDate', limit: 10 }),
  ])

  return (
    <main className="min-h-screen bg-void">
      <HeroSection hero={hero} defaultAvatar={DEFAULT_AVATAR} />
      <StatsSection stats={statsResult.docs} />
      <QuestsSection quests={questsResult.docs} defaultCover={DEFAULT_AVATAR} />
      <CampaignsSection campaigns={campaignsResult.docs} />
    </main>
  )
}
```

---

### 2B-Step 6 — Build component structure

Create these files (stubs for Phase 2B, animated in Phase 2C):

**Directory:** `src/components/homepage/`

**`HeroSection.tsx`** — Character sheet layout:
- Left (40%): Avatar with scanline overlay + glow border + Core Stats (mini RPG bars)
- Right (60%): Name in Unbounded, role in Chakra Petch + JetBrains Mono, bio in Crimson Pro, social links
- On mobile: stacked, avatar first

**`StatsSection.tsx`** — Attributes grid:
- Section header: `◈ ATRIBUTOS` / `◈ ATTRIBUTES`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Each card: icon + name + category pill + level number (JetBrains Mono, large) + progress bar
- Category → accent color: `frontend/backend` = cyan, `music/audio-engineering` = green

**`QuestsSection.tsx`** — Quest log:
- Section header: `◈ MISIONES` / `◈ QUESTS`
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- Featured quests: `col-span-2` or larger card
- Each card: cover image, category tag, title, description excerpt, stack pills, status badge, link

**`CampaignsSection.tsx`** — Campaign timeline:
- Section header: `◈ CAMPAÑAS` / `◈ CAMPAIGNS`
- Vertical timeline with gradient line (cyan → green → amber)
- Each entry: dot on line, company name, role, date range, description, achievement badges

**`LocaleSwitcher.tsx`** — Minimal header toggle:
- Fixed top-right or inline nav
- `ES` | `EN` — active locale in cyan, inactive in muted

---

### 2B-Step 7 — OG Image route

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          border: '1px solid #1f1f1f',
        }}
      >
        <div style={{ color: '#00d4ff', fontSize: 16, letterSpacing: 8, marginBottom: 16 }}>
          ◈ CHARACTER SHEET
        </div>
        <div style={{ color: '#ffffff', fontSize: 72, fontWeight: 900, letterSpacing: -2 }}>
          TEOMAGO
        </div>
        <div style={{ color: '#6b7280', fontSize: 24, marginTop: 16 }}>
          Full-Stack Developer · Musician · Arts Educator
        </div>
      </div>
    ),
    size
  )
}
```

---

### 2B-Step 8 — Phase 2B tests

```bash
# Route smoke tests
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/es  # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en  # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000     # expect 307 → /es
```

---

## Phase 2C — Animations, Polish & Extra Mile

---

### 2C-Step 1 — HeroSection animations

```tsx
// Staggered mount reveal:
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  {/* Name */}
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
>
  {/* Role */}
</motion.div>

// Avatar: fade + subtle scale
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: 'easeOut' }}
>
  {/* Avatar */}
</motion.div>
```

---

### 2C-Step 2 — Stat bar scroll animation

```tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function StatBar({ level, color }: { level: number; color: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="relative h-2 bg-surface-elevated rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${(level / 99) * 100}%` } : { width: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />
      {/* Glow pulse at tip */}
      {isInView && (
        <motion.div
          className="absolute top-0 bottom-0 w-1 rounded-full"
          style={{
            left: `calc(${(level / 99) * 100}% - 2px)`,
            backgroundColor: color,
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        />
      )}
    </div>
  )
}
```

---

### 2C-Step 3 — Card hover animation

```tsx
// Quest cards and Stat cards:
<motion.div
  whileHover={{
    x: -2,
    y: -4,
    rotate: -0.3,
    transition: { duration: 0.2, ease: 'easeOut' },
  }}
  className="border border-border bg-surface rounded-lg overflow-hidden cursor-pointer"
  style={{ willChange: 'transform' }}
>
  {/* card content */}
</motion.div>
```

---

### 2C-Step 4 — Quest cards stagger on scroll

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Wrap grid in:
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
>
  {quests.map(quest => (
    <motion.div key={quest.id} variants={cardVariants}>
      {/* card */}
    </motion.div>
  ))}
</motion.div>
```

---

### 2C-Step 5 — Avatar scanline effect

```tsx
// Overlay on avatar container:
<div className="relative overflow-hidden">
  <Image src={avatarUrl} alt={name} ... />
  {/* Scanline overlay */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
    }}
  />
  {/* Moving scan beam */}
  <div
    className="absolute left-0 right-0 h-8 pointer-events-none"
    style={{
      background: 'linear-gradient(transparent, rgba(0,212,255,0.06), transparent)',
      animation: 'scanline 4s linear infinite',
    }}
  />
</div>
```

---

### 2C-Step 6 — Copy social link to clipboard

```tsx
'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function SocialLinkButton({ url, label, icon }: SocialLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="group relative flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:border-cyan hover:bg-glow-cyan transition-all duration-200"
      onContextMenu={handleCopy}
    >
      {/* icon + label */}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-cyan font-mono">
          copied!
        </span>
      )}
    </a>
  )
}
```

---

### 2C-Step 7 — Locale switcher

```tsx
// src/components/LocaleSwitcher.tsx
'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'es' ? 'en' : 'es' })
  }

  return (
    <button
      onClick={toggle}
      className="font-mono text-sm tracking-widest"
    >
      <span className={locale === 'es' ? 'text-cyan' : 'text-muted'}>ES</span>
      <span className="text-border mx-1">|</span>
      <span className={locale === 'en' ? 'text-cyan' : 'text-muted'}>EN</span>
    </button>
  )
}
```

---

### 2C-Step 8 — Phase 2C verification

```bash
# Visual QA checklist (Teo verifies manually):
# [ ] Grain noise visible on dark background
# [ ] Stat bars animate from 0 on first scroll into view
# [ ] Glow pulse visible at stat bar tip
# [ ] Quest cards have asymmetric hover transform
# [ ] Avatar has scanline overlay
# [ ] Section headers show ◈ prefix
# [ ] ES/EN toggle switches language
# [ ] Social link right-click copies URL
# [ ] OG image renders at /opengraph-image
# [ ] pnpm build passes without errors
```

---

## Success Criteria (All Phases)

| Criterion | Verifiable by |
|-----------|--------------|
| `GET /es` and `GET /en` return HTTP 200 | `curl` / automated |
| `GET /` redirects to `/es` | `curl` |
| Schema tests pass (`pnpm test`) | `vitest` |
| Payload admin shows Hero, Quests, Stats, Campaigns | manual |
| SEO plugin adds meta tab to Hero and Quests | manual |
| Stat bars animate on scroll | Teo |
| All 4 font families render correctly | Teo |
| Design matches Void Forge palette | Teo |
| `pnpm build` passes | automated |

---

## Seed Data Guide (Phase 2B)

After schema is confirmed, seed the following via Payload admin or a `pnpm seed` script using Local API. Reference `.agents/context/Teomago Profile/Instructions.md` and the CV files for full content.

**Quests seed order:**
1. `sortOrder: 1` — Fundación Jazz para la Paz (fjpp.vercel.app) — category: `music`
2. `sortOrder: 2` — HeionHub (heionhub.com) — category: `tech`
3. `sortOrder: 3` — Tesis de Maestría (Realidad, Memoria y Creencia) — category: `education`
4. `sortOrder: 4` — SPC Canadian College — category: `tech`
5. `sortOrder: 5` — La Séptima Plataforma — category: `music`

**Stats seed (suggested):**
- TypeScript (94) — frontend — Code
- Next.js (91) — frontend — Layers
- Payload CMS (88) — backend — Database
- React (90) — frontend — Braces
- Java / Spring Boot (72) — backend — Server
- Jazz Piano (85) — music — Piano
- Music Production (80) — audio-engineering — AudioWaveform
- Sound Design (75) — audio-engineering — Waves
- Arts Education (88) — education — GraduationCap

**Campaigns seed (from CV):**
1. 10x Media (2025, current) — isCurrent: true
2. Lean Solutions Group (2024–2025)
3. SPC Canadian College (2022–2024, freelance)
4. Mostaza (prior)
5. Fundación Jazz para la Paz (ongoing, volunteer)

---

## Out of Scope (deferred to RFC-003)

- Individual Quest detail pages (`/quests/[slug]`)
- Interactive XP gamification (TICKET-003)
- Contact form
- Three.js integration
- Blog / Posts
