# RFC-001-audit — Project Bootstrap & Services Setup
**Auditor:** Claude (Phase 2)
**Date:** 2026-04-15
**RFC:** `.agents/specs/RFC-001-env-setup.md`
**Status:** REQUIRES CHANGES BEFORE EXECUTION

---

## Summary

RFC-001 is well-scoped and covers the right surface area for a bootstrap cycle. However, it contains **2 blocking issues** that must be resolved before a decision file can be drafted, plus several high/medium findings that should be addressed.

---

## Findings

### CRITICAL — Blocking (must resolve before Phase 3)

#### C-01: `PAYLOAD_SECRET` environment variable is missing
**Standard violated:** Security
**Detail:** Payload CMS 3.x requires a `PAYLOAD_SECRET` env var for JWT signing and encryption. Without it, the application will fail to start. This variable must be:
- Added to `.env` with a cryptographically random value (min 32 chars).
- Added to `.env.example` with a placeholder and a note.
- **Never committed** to version control.

**Action required:** Add `PAYLOAD_SECRET` to the Services Configuration section and to the Files to Create/Modify list.

---

#### C-02: i18n approach is ambiguous — `next-intl` vs "standard Next.js i18n patterns"
**Standard violated:** Planning (no placeholders / ambiguity in specs)
**Detail:** The RFC states `next-intl` (or standard Next.js i18n patterns)`. These are fundamentally different implementations:
- `next-intl` is a dedicated library with its own middleware, routing conventions, and `useTranslations` hook.
- Next.js built-in i18n is router-level only (locale prefixing) and requires manual translation management.

Choosing the wrong one now will require a rewrite later. Since Payload 3.x has its own admin localization (`localization` in `payload.config.ts`) and the portfolio frontend needs translation strings too, `next-intl` is the stronger choice — but this must be **explicitly decided** in the RFC before execution.

**Action required:** Remove the ambiguity. Commit to one approach (recommend `next-intl`) and specify the integration pattern with Payload's built-in localization.

---

### HIGH — Should fix before execution

#### H-01: Incorrect shadcn/ui CLI command
**Detail:** The RFC specifies `npx shadcn-ui@latest init`. The `shadcn-ui` package was renamed to `shadcn` in late 2024. The correct command is:
```bash
npx shadcn@latest init
```
Using the old package name will install an outdated version.

---

#### H-02: Node.js version not specified
**Detail:** Payload CMS 3.x requires **Node.js 20.9 or higher**. This must be documented (e.g., `.nvmrc` or `engines` field in `package.json`) to prevent CI/local environment mismatches.

**Action required:** Add Node.js version requirement to the RFC and specify it should be enforced via `.nvmrc`.

---

#### H-03: Package manager not specified
**Detail:** Payload CMS 3.x is officially developed and tested with **pnpm**. Using npm or yarn can produce lockfile inconsistencies and install failures with Payload's monorepo dependencies. The RFC should commit to pnpm.

**Action required:** Specify `pnpm` as the package manager. Add `packageManager` field to `package.json`.

---

#### H-04: No TDD strategy for bootstrap/config
**Standard violated:** TDD
**Detail:** RFC-001 is a configuration-heavy cycle. While you cannot unit-test env vars, the following are testable and should be specified:
- **Integration test:** Payload server starts successfully with required env vars set.
- **Integration test:** Database connection is valid (Neon ping / `payload.find()` on a test collection).
- **Smoke test:** `localhost:3000/admin` returns HTTP 200.

Without a test strategy, Phase 4 (Executor) has no TDD anchor for this RFC.

**Action required:** Add a "Test Strategy" section to the RFC with the above test cases.

---

### MEDIUM — Improve before or during Phase 3

#### M-01: `@payloadcms/richtext-lexical` listed with no in-scope use case
**Detail:** The RFC lists `@payloadcms/richtext-lexical` as a dependency but RFC-001 explicitly excludes "portfolio collections." Lexical is only needed when defining RichText fields in a collection. Installing it in bootstrap without a use case adds dead weight and may cause version conflicts later.

**Recommendation:** Move `@payloadcms/richtext-lexical` to RFC-002 (collections definition). Remove from RFC-001 dependencies unless Payload 3.x requires it as a peer dependency at init time (verify).

---

#### M-02: Neon `DATABASE_URI` requires SSL mode
**Detail:** Neon PostgreSQL requires `sslmode=require` in the connection string. The RFC should document the expected format:
```
DATABASE_URI=postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```
Without this, `@payloadcms/db-postgres` will fail to connect in production/staging environments.

---

#### M-03: R2 credentials — no least-privilege note
**Standard violated:** Security
**Detail:** The RFC lists R2 credentials but doesn't specify that the API token should have **Object Read & Write** permissions scoped to the specific bucket only, not Account-level permissions. This is a security best practice that should be documented.

---

#### M-04: `S3_REGION (auto)` is unclear
**Detail:** Cloudflare R2 doesn't use AWS regions. The `@payloadcms/storage-s3` adapter (which is what Payload uses for R2 via compatible endpoint) derives the region automatically from the endpoint URL. The RFC should clarify:
- Use `auto` as the region value in the adapter config.
- The `S3_REGION` variable may not be needed at all — confirm adapter behavior.

---

### LOW — Minor clarity improvements

#### L-01: Bootstrap command not specified
**Detail:** The RFC doesn't specify how to initialize the Next.js + Payload project. The canonical command is:
```bash
npx create-payload-app@latest
```
This should be documented so the Executor doesn't improvise.

---

#### L-02: `SMTP_PASS` should be an app-specific password
**Detail:** The RFC should note that `SMTP_PASS` must be a Brevo SMTP API key, not the Brevo account password.

---

## Checklist Summary

| ID   | Severity | Status        | Description                                    |
|------|----------|---------------|------------------------------------------------|
| C-01 | CRITICAL | OPEN          | `PAYLOAD_SECRET` missing from env vars         |
| C-02 | CRITICAL | OPEN          | i18n approach ambiguous                        |
| H-01 | HIGH     | OPEN          | Wrong shadcn CLI command                       |
| H-02 | HIGH     | OPEN          | Node.js version not specified                  |
| H-03 | HIGH     | OPEN          | Package manager not specified                  |
| H-04 | HIGH     | OPEN          | No TDD strategy for bootstrap                  |
| M-01 | MEDIUM   | OPEN          | `@payloadcms/richtext-lexical` premature       |
| M-02 | MEDIUM   | OPEN          | Neon `DATABASE_URI` SSL format not documented  |
| M-03 | MEDIUM   | OPEN          | R2 credentials lack least-privilege note       |
| M-04 | MEDIUM   | OPEN          | `S3_REGION (auto)` notation unclear            |
| L-01 | LOW      | OPEN          | Bootstrap command not specified                |
| L-02 | LOW      | OPEN          | `SMTP_PASS` should be app-specific key         |

---

## Recommended Next Step

Teo reviews this audit and decides:
1. **Accept / Reject / Modify** each finding.
2. Once all CRITICAL and HIGH items are resolved (either in RFC or accepted as-is with rationale), Phase 3 can draft the decision file.
