# AGENTS.md — Multi-Agent Engineering Pipeline

> RULE ZERO: Read this file before starting any session.

## Shared Engineering Standards (Superpowers)

All agents (Gemini, Claude, or any future AI) MUST adhere to the following standards. These are globally available as skills. Invoke them using `activate_skill` before starting any phase:

1.  **Planning (`writing-plans`):** Every implementation plan must be granular, bite-sized, and free of placeholders.
2.  **TDD (`test-driven-development`):** No production code without a failing test first. Red-Green-Refactor is mandatory.
3.  **Debugging (`systematic-debugging`):** No fixes without root cause investigation. Follow the 4-phase process.
4.  **Verification (`verification-before-completion`):** No completion claims without fresh, evidence-based verification.
5.  **Brainstorming (`brainstorming`):** No implementation until a design is approved.
6.  **Frontend Design (`frontend-design.md`):** Mandatory for Phase 1 on all UI/UX tasks. Prevents generic "AI aesthetic" by enforcing the project's specific design language.
7.  **Documentation (`find-docs`):** Use the `find-docs` skill for up-to-date library information.

---

## Roles and Workflow (Agent-Agnostic)

The pipeline is divided into 6 phases, each with a clear responsibility. Any capable agent can take any role as directed by Teo.

1.  **Phase 1: Specification & Blueprint (Role: Designer)**
    - Reads `BACKLOG.md` and `PROJECT_STATE.md`.
    - Follows `brainstorming.md` to refine the feature with Teo.
    - Writes a **Deep RFC** at `.agents/specs/RFC-[N]-[short-name].md`.
    - **Blueprint Requirement:** The RFC must include a full "File Impact Map" and "Interface Definitions" (Props, Hooks, State logic) using the `writing-plans` skill logic. It must define the **TDD Strategy** (what to test) before any code is written.
    - Does NOT touch source code.

2.  **Phase 2: Audit (Role: Auditor)**
    - Reads the active RFC and `PROJECT_STATE.md`.
    - Audits the RFC's architectural logic, type safety, and security.
    - Writes the risk report at `.agents/audits/RFC-[N]-audit.md`.
    - **Verification:** Confirm the RFC is deep enough to implement without further "invention."

3.  **Phase 3: Execution Plan (Role: Auditor + Designer + Teo)**
    - **Auditor:** Drafts `.agents/decisions/RFC-[N]-decision.md` integrating Teo's feedback.
    - **Designer:** Converts the RFC Blueprint into a **Step-by-Step Task List** following the `planning.md` format.
    - **Content:** Adds granular checkboxes, exact shell commands, and draft commit messages.
    - **Teo:** Provides final approval.

4.  **Phase 4: Execution (Role: Executor)**
    - Follows strictly the steps in `.agents/decisions/RFC-[N]-decision.md`.
    - MUST follow the `tdd.md` cycle for every task.
    - After implementation, STOPS and waits for Phase 5.

5.  **Phase 5: QA Verification (Role: QA + Teo)**
    - QA Agent runs the success criteria checklist.
    - Follows `verification.md` to ensure evidence-based results.
    - Teo confirms QA passed.

6.  **Phase 6: Cycle Closure (Role: Administrator)**
    - Updates `PROJECT_STATE.md`, archives specs, and commits changes.

---

## Strict Operating Rules

- **Zero code without orders:** Forbidden to modify source code without an explicit instruction file in `.agents/decisions/`.
- **Single executor per task:** Do not operate simultaneously with another agent in the same cycle on the same files.
- **No improvisation:** Execute exactly what the decision file says. If something is missing, stop and escalate.

---

## Escalation Protocol

Stop execution and escalate to Teo when:
- 2+ failed attempts on the same task.
- Any change touching core auth, sensitive data, or critical portfolio logic.
- The executor needs to invent logic not specified in the decision file.

---

## BACKLOG ticket format

Every item in `BACKLOG.md` must follow this structure:
```
## [TICKET-ID] — Short name
**Priority:** high | medium | low
**Type:** feature | bug | refactor | migration
**Description:** what must exist when this is done
**Success criterion:** verifiable condition
**Dependencies:** what must be completed first
```

---

## Project context

- **Name:** teomago
- **Description:** Personal portfolio and digital showcase.
- **Stack:** Next.js + Tailwind CSS + TypeScript + Payload CMS 3.x.
- **Primary language:** Spanish (ES).
