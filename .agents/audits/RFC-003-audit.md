# RFC-003-audit — Media Upgrades + Hero Identity + Skills Panel
**Auditor:** Claude (Phase 2)  
**Date:** 2026-04-16  
**RFC:** `.agents/specs/RFC-003-media-identity-skills.md`  
**Status:** REQUIRES CHANGES BEFORE EXECUTION

---

## Summary

RFC-003 covers three independent features. The blueprint is well-scoped but has **3 critical gaps** that would block a correct Phase 3 execution plan: the WebP mechanism is unspecified, the `credit` field type is ambiguous, and the Skills data shape is undefined. Additionally, two high-severity issues around ThumbHash serialization and SEO regression must be resolved. All 10 findings are catalogued below.

---

## Critical Findings

### C-01 — `credit` field type is not a valid Payload field type
**Location:** RFC §1, Interface Definitions  
**Issue:** RFC specifies `credit: localized text array`. Payload CMS has no `text array` field primitive. This could mean:
- (a) A single `text` field (just for the credit string), or
- (b) An `array` field with a single `text` child (for multiple credits).

A single `text` field is almost certainly the intent (e.g., `"Photo by Unsplash"`), but it must be confirmed.

**Resolution required:** Change to `type: 'text', localized: true` (single credit string). If multiple credits are needed, specify as `type: 'array'` with a `text` child field named `creditLine`.

---

### C-02 — WebP auto-conversion mechanism unspecified
**Location:** RFC §1, Goal + File Impact Map  
**Issue:** RFC states "Auto-convert to WebP" but the File Impact Map only lists field changes to `Media.ts`. In Payload 3.x + sharp, WebP conversion is configured via `upload.formatOptions` in the collection config:

```ts
upload: {
  formatOptions: { format: 'webp', options: { quality: 85 } },
}
```

This is a required change to `Media.ts` that is missing from the RFC. Without it, "auto-convert to WebP" is not implemented at all.

**Resolution required:** Add `formatOptions` entry to the RFC's File Impact Map for `Media.ts`.

---

### C-03 — Skills global data shape is undefined
**Location:** RFC §3, Interface Definitions  
**Issue:** The RFC describes the Skills global as "groups/categories/items, localized" but never defines the Payload field structure. The component signature `SkillsPanel({ skills: SkillsType })` references a type that does not exist until Payload generates `payload-types.ts` from the defined schema. A Phase 3 executor cannot write `Skills.ts` without knowing the field tree.

**Resolution required:** Define the field schema in the RFC. Proposed structure:
```ts
// Skills global fields
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
}
```
If a simpler flat structure (group → items, no sub-categories) is intended, the RFC must state it explicitly.

---

## High Severity Findings

### H-01 — ThumbHash `Uint8Array` serialization missing
**Location:** RFC §1, Hook Signature  
**Issue:** `thumbhash.rgbaToThumbHash(width, height, rgba)` returns a `Uint8Array`. A `json` field in Postgres stores a JSON value — storing a raw `Uint8Array` object will serialize incorrectly (as `{}` or throw). The hook must convert it:

```ts
// Correct serialization for json field
thumbhash: Array.from(thumbhashBytes)  // stores as JSON number array
// OR store as base64 text field (more efficient for client-side decode)
thumbhash: Buffer.from(thumbhashBytes).toString('base64')
```

The RFC must specify the serialization format and match the field type to it (`json` for array, `text` for base64).

**Resolution required:** Add serialization step to the hook signature. Recommend `base64` + `type: 'text'` (smaller storage, directly usable by `thumbhash` JS lib on the client).

---

### H-02 — ThumbHash hook missing guards for non-file operations
**Location:** RFC §1, Hook Signature  
**Issue:** A `beforeChange` hook fires on every update, including metadata-only edits (e.g., updating `alt` text without re-uploading a file). If no file is present, `req.file` is undefined and the sharp pipeline will throw. The hook must guard:

```ts
if (!req.file?.data) return data  // skip if no new file upload
```

Additionally, the hook should be wrapped in `try/catch` to prevent a failed hash from blocking the upload.

**Resolution required:** Add guard clause and error handling to the hook signature in the RFC.

---

### H-03 — SEO plugin title regression when `name` field changes meaning
**Location:** RFC §2, Goal; `src/payload.config.ts:94`  
**Issue:** The current `seoPlugin` `generateTitle` uses `doc?.name` as the suffix: `"Teomago — ${doc?.name}"`. If `name` is changed from `'Mateo Ibagón'` (full name) to `'teomago'` (handle/nickname), the generated title becomes `"Teomago — teomago"` — a redundant, low-quality SEO title.

**Resolution required:** RFC must include an update to the `generateTitle` function in `payload.config.ts` to use `properName` for the hero global:
```ts
generateTitle: ({ doc, globalSlug }) =>
  globalSlug === 'hero'
    ? `Teomago — ${(doc as any)?.properName ?? 'Portfolio'}`
    : `Teomago — ${(doc as any)?.title ?? 'Portfolio'}`,
```

---

### H-04 — `SkillsPanel` client boundary ambiguity vs. codebase aesthetic
**Location:** RFC §3, Interface Definitions  
**Issue:** RFC specifies `SkillsPanel` as a "server component." However, every existing homepage section (`HeroSection`, `StatsSection`, `QuestsSection`, `CampaignsSection`) uses framer-motion animations. A static, non-animated Skills panel will be visually jarring against animated siblings.

**Resolution required:** RFC must declare one of:
- (a) `SkillsPanel` is intentionally static (no animations), with a rationale.
- (b) `SkillsPanel` is a client component (`'use client'`) using framer-motion, matching the existing aesthetic.
- (c) `SkillsPanel` is a server component that renders an inner `'use client'` animation wrapper.

---

## Medium Severity Findings

### M-01 — `properName` localization unspecified
**Location:** RFC §2, Interface Definitions  
**Issue:** The RFC adds a `properName` field but does not state whether it is localized. Real names are language-independent; `localized: true` would be wrong. Must be explicit.

**Resolution required:** Add `localized: false` (or omit `localized:` entirely, as false is the default) to the RFC's field spec for `properName`.

---

### M-02 — Skills global `slug` never declared
**Location:** RFC §3, File Impact Map  
**Issue:** The RFC says "Register the new global" in `payload.config.ts` but never declares the global's slug. The page query `payload.findGlobal({ slug: '???' })` has no target. Implied slug is `'skills'`, but it must be explicit.

**Resolution required:** Add `slug: 'skills'` to the RFC's Skills global spec.

---

### M-03 — Page layout grid placement ambiguous
**Location:** RFC §3, Interface Definitions  
**Issue:** RFC says change the main grid to `lg:grid-cols-10` with col-span assignments for Campaigns and Skills. However, in the current `page.tsx`, sections are stacked sequentially — there is no shared grid container for `CampaignsSection` and a hypothetical `SkillsPanel`. The RFC must specify where the grid wrapper is introduced and which existing sections it encompasses.

**Resolution required:** Add a snippet showing the wrapper `<div className="lg:grid-cols-10 ...">` placement relative to the other sections, or confirm that only CampaignsSection + SkillsPanel are co-located in the grid.

---

### M-04 — `payload-types.ts` regeneration not in metadata/migration notes
**Location:** RFC §5, Metadata  
**Issue:** All three features add fields or globals. Payload must regenerate `src/payload-types.ts` after schema changes for TypeScript types to be correct. This must be a step in the Phase 3 execution plan.

**Resolution required:** Add `pnpm payload generate:types` to the Phase 3 metadata as a required step after each schema file is created/modified.

---

## Low Severity Findings

### L-01 — Admin folders option missing from Media upload config
**Location:** RFC §1, Goal + File Impact Map  
**Issue:** RFC mentions "enable admin folders" but `upload.adminFolders: true` (Payload 3.x) is not listed in the interface definitions or file impact map for `Media.ts`. This is a one-liner but must be explicitly included.

**Resolution required:** Add `adminFolders: true` to the `upload` config in the RFC's Media interface definition.

---

## Approval Conditions

The RFC may proceed to Phase 3 only after the following are resolved in the spec:

| # | Condition |
|---|-----------|
| C-01 | `credit` field type confirmed as `text` (single) or `array` |
| C-02 | WebP `formatOptions` added to Media.ts impact map |
| C-03 | Skills field schema fully defined (groups/categories/items or simpler) |
| H-01 | ThumbHash serialization format specified (base64 text or JSON array) |
| H-02 | Hook guard clause added for no-file updates |
| H-03 | SEO `generateTitle` fix included in Hero Identity file impact map |
| H-04 | SkillsPanel client/server boundary decision made explicit |

M-01 through M-04 and L-01 should be incorporated but are not blockers if Phase 3 author is aware of them.

---

## What's Good (Carry Forward to Phase 3)

- Sharp is already installed (`sharp: 0.34.5`) — no new install needed for ThumbHash hook.
- `vitest.config.mts` has `environment: 'jsdom'` — React component tests are supported.
- Migrations are all additive (new nullable columns / new table) — zero breaking changes.
- `thumbhash` dependency correctly identified (`pnpm add thumbhash`).
- `lg:grid-cols-10` with 6/4 split is a sound responsive layout choice.
- `admin.hidden: true` on `thumbhash` field is correct — it's an internal computed value.
