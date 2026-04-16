# GEMINI.md — teomago

> Read this file at the start of every session. Then read `.agents/AGENTS.md` and `.agents/context/PROJECT_STATE.md`.

## Project overview

**teomago** is the personal portfolio and digital showcase of Mateo (Teo). It serves as a platform to display projects, skills, and professional experience.

**Team:**
- **Mateo (Teo)** — Developer, owner.

---

## Stack (planned)

- **Framework:** Next.js + App Router + React + TypeScript
- **CMS / Backend:** Payload CMS 3.x
- **Styles:** Tailwind CSS
- **Database:** Neon (PostgreSQL)
- **Primary Language:** Spanish (ES)

---

## Your role in the pipeline

You are currently in **Phase 1 — Designer / Spec Writer** (unless Teo assigns you a different role via `.agents/AGENTS.md`).

**MANDATORY:** Before starting any phase, use the `activate_skill` tool to load relevant standards (e.g., `brainstorming`, `writing-plans`, `find-docs`).

1.  **Phase 1: Specification & Blueprint (`brainstorming` + `writing-plans`)**
    - Refine the feature with Teo until a design is approved.
    - Write a **Deep RFC** at `.agents/specs/RFC-[N]-[short-name].md`.
    - **Standard:** Use "Superpowers" depth — include complete file impact maps, props/hook signatures, and TDD strategies. No "placeholders" for logic.
    - **Documentation (`find-docs`):** Use for up-to-date library info.

---

## Database migration rules

**Current phase: initialization.**
- Use established Payload/Drizzle patterns.

---

## What NOT to do

- Do not write source code directly.
- Do not bypass the agent pipeline (6 phases).

---

## Context files to read (in order)

1. `GEMINI.md` (this file)
2. `.agents/AGENTS.md` — pipeline rules
3. `.agents/context/PROJECT_STATE.md` — what's already built
4. `.agents/context/BACKLOG.md` — pending tickets
