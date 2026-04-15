# RFC-001 — Project Bootstrap & Services Setup

## Objective
Initialize the development environment, external service configurations, and core UI/i18n dependencies for the **teomago** portfolio using Payload CMS 3.x, shadcn/ui, and Tailwind CSS.

## Scope
- Configuration of environment variables for Database (Neon), Storage (R2), and Email (Brevo).
- Initialization of the Next.js App Router project with Payload 3.x.
- Integration of Tailwind CSS and shadcn/ui.
- Setup of Multilingual (i18n) support for ES (primary) and EN.

## Technical Details

### 1. Core Stack (Bootstrap)
We will use the Payload 3.x template for Next.js as the foundation.
- **Framework:** Next.js (App Router) + TypeScript.
- **CMS:** Payload CMS 3.x.
- **Styling:** Tailwind CSS + shadcn/ui.
- **i18n:** Payload built-in localization + `next-intl` (or standard Next.js i18n patterns) for the frontend.

### 2. Services Configuration
#### A. Database (Neon - PostgreSQL)
- **Adapter:** `@payloadcms/db-postgres` (Drizzle).
- **Variable:** `DATABASE_URI`.

#### B. Storage (Cloudflare R2 - S3)
- **Adapter:** `@payloadcms/storage-r2`.
- **Variables:** `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_REGION` (auto).

#### C. Email (Brevo - SMTP)
- **Variables:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

### 3. Dependencies to Install
- **Payload Core:** `payload`, `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/richtext-lexical`.
- **UI & Styles:** `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `tailwind-merge`, `clsx`.
- **shadcn/ui CLI:** For component initialization.

## Files to Create/Modify
- `.env`: Local secrets (DO NOT COMMIT).
- `.env.example`: Template for other developers/CI.
- `.gitignore`: Verification of `.env` and `node_modules` protection.
- `payload.config.ts`: Core CMS and Localization settings.
- `next.config.mjs`: Payload wrapper (`withPayload`).

## Success Criteria
- [ ] Next.js + Payload 3.x project initialized and running on `localhost:3000`.
- [ ] Tailwind CSS configured and working.
- [ ] shadcn/ui initialized (`npx shadcn-ui@latest init`).
- [ ] Localization (ES/EN) active in `payload.config.ts`.
- [ ] `.env.example` has all variables defined (Neon, R2, Brevo).
- [ ] `.gitignore` explicitly includes `.env`.

## Out of Scope
- Actual implementation of portfolio collections (Projects, Skills, etc.).
- Custom page designs or Three.js integration (Reserved for RFC-002).
