# RFC-001-decision — Project Bootstrap & Services Setup
**Phase:** 3 — Decision
**Date:** 2026-04-15
**RFC:** `.agents/specs/RFC-001-env-setup.md`
**Audit:** `.agents/audits/RFC-001-audit.md`
**Status:** PENDING TEO APPROVAL

---

## Audit Resolutions

| ID   | Decision                                                                 |
|------|--------------------------------------------------------------------------|
| C-01 | FIXED — `PAYLOAD_SECRET` added; generate with `openssl rand -hex 32`    |
| C-02 | FIXED — Commit to `next-intl` (recommended over native Next.js i18n)    |
| H-01 | FIXED — Command updated to `npx shadcn@latest init`                     |
| H-02 | FIXED — Node ≥20.9 enforced via `.nvmrc` and `engines` in package.json  |
| H-03 | FIXED — pnpm is the only package manager for this project               |
| H-04 | FIXED — Integration tests added for DB connection (see Step 9)          |
| M-01 | ACCEPTED — `@payloadcms/richtext-lexical` kept; it's Payload-native     |
| M-02 | FIXED — Neon SSL format: `?sslmode=verify-full&channel_binding=require` |
| M-03 | ACCEPTED — R2 token already scoped in Cloudflare dashboard              |
| M-04 | FIXED — `S3_REGION=auto` confirmed as required value for R2             |
| L-01 | FIXED — Bootstrap command: `npx create-payload-app`                     |
| L-02 | ACCEPTED — Brevo SMTP API key already prepared                          |

---

## Implementation Plan

> The Executor MUST follow these steps in order. Do not skip steps. Do not combine steps. Stop and escalate if a step fails twice.

---

### Step 1 — Set Node.js version requirement

**Goal:** Lock Node.js to ≥20.9 across all environments.

**Tasks:**
1. Create `.nvmrc` at project root with content `20`.
2. After project init (Step 3), add to `package.json`:
   ```json
   "engines": {
     "node": ">=20.9.0",
     "pnpm": ">=9.0.0"
   }
   ```

**Test (RED first):**
```bash
# Fails if node < 20.9
node -e "const [maj, min] = process.versions.node.split('.').map(Number); if (maj < 20 || (maj === 20 && min < 9)) process.exit(1)"
```

---

### Step 2 — Generate `PAYLOAD_SECRET`

**Goal:** Create a cryptographically secure secret for Payload CMS.

**Tasks:**
1. Run the following and copy the output:
   ```bash
   openssl rand -hex 32
   ```
2. Save it as `PAYLOAD_SECRET` in `.env` (created in Step 5).

> Note: Payload 3.x does NOT auto-generate this. The server will refuse to start without it.

---

### Step 3 — Initialize the project

**Goal:** Scaffold the Next.js + Payload CMS 3.x base project.

**Tasks:**
1. Run:
   ```bash
   npx create-payload-app
   ```
2. When prompted:
   - **Template:** `blank` (we configure everything manually)
   - **Package manager:** `pnpm`
   - **Database:** skip for now (we configure Neon manually in Step 6)
3. Verify `pnpm-lock.yaml` is generated and `node_modules/` exists.
4. Confirm the project runs with `pnpm dev` before proceeding.

**Test (RED first):**
```bash
# Project starts without errors
pnpm dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404"
kill %1
```

---

### Step 4 — Configure `.nvmrc` and `package.json` engines

**Goal:** Enforce Node.js and pnpm versions.

**Tasks:**
1. Create `.nvmrc`:
   ```
   20
   ```
2. Add `engines` field to `package.json` (see Step 1).
3. Add `packageManager` field to `package.json`:
   ```json
   "packageManager": "pnpm@9.0.0"
   ```

---

### Step 5 — Create `.env` and `.env.example`

**Goal:** Define all required environment variables.

**Tasks:**
1. Create `.env` with real values (DO NOT COMMIT):
   ```env
   # Payload
   PAYLOAD_SECRET=<output from Step 2>

   # Database — Neon PostgreSQL
   # Pooled connection (for queries via Payload)
   DATABASE_URI=postgresql://user:pass@ep-xxxx.region.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require
   # Direct connection (for Drizzle migrations — bypasses pooler)
   DATABASE_URI_DIRECT=postgresql://user:pass@ep-xxxx.region.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require

   # Storage — Cloudflare R2
   S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
   S3_ACCESS_KEY_ID=<r2-access-key>
   S3_SECRET_ACCESS_KEY=<r2-secret-key>
   S3_BUCKET=teomago-media
   S3_REGION=auto

   # Email — Brevo
   BREVO_API_KEY=<brevo-smtp-api-key>
   BREVO_EMAILS_ACTIVE=true
   BREVO_SENDER_NAME=Teomago
   BREVO_SENDER_EMAIL=<brevo-login-email>

   # Next.js
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

2. Create `.env.example` with placeholders:
   ```env
   # Payload
   PAYLOAD_SECRET=                    # generate: openssl rand -hex 32

   # Database — Neon PostgreSQL
   DATABASE_URI=                      # pooled: postgresql://...?sslmode=verify-full&channel_binding=require
   DATABASE_URI_DIRECT=               # direct: same host, no pooler prefix

   # Storage — Cloudflare R2
   S3_ENDPOINT=                       # https://<account-id>.r2.cloudflarestorage.com
   S3_ACCESS_KEY_ID=
   S3_SECRET_ACCESS_KEY=
   S3_BUCKET=
   S3_REGION=auto

   # Email — Brevo
   BREVO_API_KEY=                     # use Brevo SMTP API key
   BREVO_EMAILS_ACTIVE=true
   BREVO_SENDER_NAME=Teomago
   BREVO_SENDER_EMAIL=                # sender email (must be authorized in Brevo)

   # Next.js
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

3. Verify `.gitignore` includes `.env` (not `.env.example`):
   ```
   .env
   ```

---

### Step 6 — Configure Payload CMS (`payload.config.ts`)

**Goal:** Wire up database, storage, email, and localization.

**Tasks:**
1. Install required packages:
   ```bash
   pnpm add @payloadcms/db-postgres @payloadcms/storage-s3 @payloadcms/email-nodemailer @payloadcms/richtext-lexical
   ```
   > Note: Cloudflare R2 is S3-compatible. Use `@payloadcms/storage-s3` with the R2 endpoint.

2. Write `payload.config.ts`:
   ```typescript
   import { buildConfig } from 'payload'
   import { postgresAdapter } from '@payloadcms/db-postgres'
   import { s3Storage } from '@payloadcms/storage-s3'
   import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
   import { lexicalEditor } from '@payloadcms/richtext-lexical'
   import { es } from '@payloadcms/translations/languages/es'
   import { en } from '@payloadcms/translations/languages/en'

   export default buildConfig({
     secret: process.env.PAYLOAD_SECRET!,

     db: postgresAdapter({
       pool: {
         connectionString: process.env.DATABASE_URI!,
       },
       // Direct connection used for migrations (bypasses Neon pooler)
       migrationDir: './migrations',
     }),

     editor: lexicalEditor({}),

     localization: {
       locales: [
         { label: 'Español', code: 'es' },
         { label: 'English', code: 'en' },
       ],
       defaultLocale: 'es',
       fallback: true,
     },

     i18n: {
       supportedLanguages: { es, en },
       fallbackLanguage: 'es',
     },

     email: nodemailerAdapter({
       defaultFromAddress: process.env.BREVO_SENDER_EMAIL || 'noreply@teomago.com',
       defaultFromName: process.env.BREVO_SENDER_NAME || 'Teomago',
       transportOptions: {
         host: 'smtp-relay.brevo.com',
         port: 587,
         auth: {
           user: process.env.BREVO_SENDER_EMAIL,
           pass: process.env.BREVO_API_KEY,
         },
       },
       // (Optional) Disable email sending in dev if needed
       // skip: process.env.BREVO_EMAILS_ACTIVE !== 'true',
     }),

     plugins: [
       s3Storage({
         collections: {},   // populated in RFC-002 when media collections are defined
         bucket: process.env.S3_BUCKET!,
         config: {
           endpoint: process.env.S3_ENDPOINT,
           region: process.env.S3_REGION ?? 'auto',
           credentials: {
             accessKeyId: process.env.S3_ACCESS_KEY_ID!,
             secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
           },
         },
       }),
     ],

     collections: [],   // populated in RFC-002
   })
   ```

---

### Step 7 — Configure `next.config.mjs`

**Goal:** Wrap Next.js config with Payload's `withPayload` plugin.

**Tasks:**
1. Write `next.config.mjs`:
   ```javascript
   import { withPayload } from '@payloadcms/next/withPayload'

   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       reactCompiler: false,
     },
   }

   export default withPayload(nextConfig)
   ```

---

### Step 8 — Configure Tailwind CSS and shadcn/ui

**Goal:** Install and initialize Tailwind and shadcn/ui.

**Tasks:**
1. Install Tailwind:
   ```bash
   pnpm add -D tailwindcss postcss autoprefixer
   pnpx tailwindcss init -p
   ```
2. Initialize shadcn/ui:
   ```bash
   npx shadcn@latest init
   ```
   When prompted:
   - Style: **Default**
   - Base color: Teo's choice (suggest **Neutral**)
   - CSS variables: **Yes**

3. Verify `components/ui/` directory is created and `tailwind.config.ts` is updated.

---

### Step 9 — Configure `next-intl` for frontend i18n

**Goal:** Set up multilingual support (ES primary, EN secondary) for the Next.js frontend.

> Note: Payload's `localization` (Step 6) handles CMS content. `next-intl` handles frontend UI strings. These are complementary, not redundant.

**Tasks:**
1. Install:
   ```bash
   pnpm add next-intl
   ```
2. Create locale message files:
   - `messages/es.json` — empty object `{}`
   - `messages/en.json` — empty object `{}`
3. Create `i18n/routing.ts`:
   ```typescript
   import { defineRouting } from 'next-intl/routing'

   export const routing = defineRouting({
     locales: ['es', 'en'],
     defaultLocale: 'es',
   })
   ```
4. Create `i18n/navigation.ts`:
   ```typescript
   import { createNavigation } from 'next-intl/navigation'
   import { routing } from './routing'

   export const { Link, redirect, usePathname, useRouter, getPathname } =
     createNavigation(routing)
   ```
5. Create `middleware.ts` at project root:
   ```typescript
   import createMiddleware from 'next-intl/middleware'
   import { routing } from './i18n/routing'

   export default createMiddleware(routing)

   export const config = {
     matcher: ['/((?!api|_next|_payload|admin|.*\\..*).*)'],
   }
   ```
6. Wrap `app/layout.tsx` with `NextIntlClientProvider` (stub — populated in RFC-002).

---

### Step 10 — Write integration tests

**Goal:** Verify the two database connections work before claiming success. These are the TDD anchors for this RFC.

**Tasks:**
1. Install test dependencies:
   ```bash
   pnpm add -D vitest @vitest/node postgres dotenv
   ```
2. Add to `package.json`:
   ```json
   "scripts": {
     "test": "vitest run",
     "test:watch": "vitest"
   }
   ```
3. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'

   export default defineConfig({
     test: {
       environment: 'node',
       setupFiles: ['./tests/setup.ts'],
     },
   })
   ```
4. Create `tests/setup.ts`:
   ```typescript
   import { config } from 'dotenv'
   config({ path: '.env' })
   ```
5. Write **failing test first**, then implement:

   **RED — Create `tests/integration/database.test.ts`:**
   ```typescript
   import { describe, it, expect, afterAll } from 'vitest'
   import postgres from 'postgres'

   describe('Neon database connections', () => {
     let pooledClient: ReturnType<typeof postgres>
     let directClient: ReturnType<typeof postgres>

     afterAll(async () => {
       await pooledClient?.end()
       await directClient?.end()
     })

     it('connects via pooled DATABASE_URI', async () => {
       pooledClient = postgres(process.env.DATABASE_URI!, { ssl: 'verify-full' })
       const result = await pooledClient`SELECT 1 AS ok`
       expect(result[0].ok).toBe(1)
     })

     it('connects via direct DATABASE_URI_DIRECT', async () => {
       directClient = postgres(process.env.DATABASE_URI_DIRECT!, { ssl: 'verify-full' })
       const result = await directClient`SELECT 1 AS ok`
       expect(result[0].ok).toBe(1)
     })
   })
   ```

   **GREEN:** Run `pnpm test`. Both tests must pass with real Neon credentials in `.env`.

---

### Step 11 — Verify success criteria

Run each check in order. All must pass before closing this cycle.

```bash
# 1. Dev server starts
pnpm dev

# 2. Admin panel reachable
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
# Expected: 200

# 3. Database integration tests pass
pnpm test

# 4. Tailwind works — inspect any page for Tailwind classes rendering correctly
# (manual check)

# 5. shadcn/ui initialized
ls components/ui/
# Expected: at least button.tsx or similar base component

# 6. Localization active — verify in payload.config.ts localization block is
#    loaded (check Payload admin > Settings > Localization shows ES and EN)

# 7. .env not tracked by git
git status | grep -v "\.env\.example" | grep "\.env"
# Expected: no output
```

---

## Environment Variables Reference (Final)

| Variable             | Required | Notes                                            |
|----------------------|----------|--------------------------------------------------|
| `PAYLOAD_SECRET`     | YES      | `openssl rand -hex 32`                           |
| `DATABASE_URI`       | YES      | Neon pooled, `?sslmode=verify-full&channel_binding=require` |
| `DATABASE_URI_DIRECT`| YES      | Neon direct (migrations), same SSL params        |
| `S3_ENDPOINT`        | YES      | `https://<account-id>.r2.cloudflarestorage.com`  |
| `S3_ACCESS_KEY_ID`   | YES      | R2 token scoped to bucket (already done)         |
| `S3_SECRET_ACCESS_KEY`| YES     | R2 token secret                                  |
| `S3_BUCKET`          | YES      | Bucket name in R2                                |
| `S3_REGION`          | YES      | `auto` (required by R2)                          |
| `BREVO_API_KEY`      | YES      | Brevo SMTP API key (not account password)        |
| `BREVO_EMAILS_ACTIVE` | YES      | `true` or `false`                                |
| `BREVO_SENDER_NAME`   | YES      | `Teomago`                                        |
| `BREVO_SENDER_EMAIL`  | YES      | Sender email (must be authorized in Brevo)        |
| `NEXT_PUBLIC_SERVER_URL` | YES  | `http://localhost:3000` (dev)                    |

---

## Out of Scope (deferred to RFC-002)

- Portfolio collections (Projects, Skills, Experience).
- Custom page designs, Three.js integration.
- Populating `s3Storage` `collections` field.
- Populating `messages/es.json` and `messages/en.json` with actual strings.
- Wrapping layouts with `NextIntlClientProvider`.
