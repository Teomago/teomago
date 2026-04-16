# STANDARD: Frontend Design Thinking

> **Role:** Mandatory for Phase 1 (Designer) on any UI/UX task.
> **Goal:** Prevent "AI-Aesthetic" (generic layouts, Inter/Roboto fonts, SaaS purples).

## 1. Aesthetic Definition
Before writing code, define the **Visual Direction**.
- **The "Void Forge" Aesthetic:** RPG-Gamer-Noir. Monospace typography (JetBrains Mono/Chakra Petch), high-contrast "glow" accents (Cyan/Green), dark/void backgrounds, scanline overlays, sharp corners (`2px` radius).
- **Anti-Patterns:** No rounded corners > 4px. No standard system sans-serif for UI labels. No "soft" shadows.

## 2. Typography & Motion
- **Monospace for Data:** Use monospace for all "system" values, labels, and stats.
- **Display for Identity:** Use bold, heavy-tracking display fonts for headings.
- **Motion:** Staggered entry, subtle glow pulses, and "scanline" animations. Use `framer-motion`.

## 3. Implementation Rules
- **Tailwind v4:** Use the established `@theme` tokens (e.g., `--shadow-glow-cyan`).
- **Real Content:** No "Lorem Ipsum". Use actual CV data or relevant placeholders.
- **RPG UI:** Use "Character Sheet" elements — progress bars for stats, status badges, and vertical timelines.

## 4. Design-to-Code Process
1. **Mood:** Identify the mood (e.g. "Gritty Terminal").
2. **Palette:** Stick to the "Void Forge" palette.
3. **Draft:** Describe the layout in the RFC before implementing.
