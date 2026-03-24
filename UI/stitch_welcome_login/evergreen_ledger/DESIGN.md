# Design System Document

## 1. Overview & Creative North Star: "The Financial Atelier"

This design system moves away from the sterile, "spreadsheet" aesthetic of traditional finance apps. Our Creative North Star is **"The Financial Atelier"**—a space that feels bespoke, curated, and architecturally sound. 

To achieve a "High-End Editorial" feel, we break the generic grid through **Intentional Asymmetry** and **Tonal Depth**. We replace rigid lines with soft transitions and layered surfaces. The goal is to make the user feel like they are looking at a premium physical ledger made of vellum and frosted glass, where data isn't just displayed—it is composed.

---

## 2. Colors & The "No-Line" Philosophy

Our palette is anchored in deep, authoritative greens and blues, balanced by a sophisticated "cool-ice" neutral scale. 

### The Palette
- **Primary (Deep Emerald):** `#00322d` — Used for high-level brand moments and core CTAs.
- **Tertiary (Growth Green):** `#003321` — Reserved for "Success" states, wealth growth indicators, and positive cash flow.
- **Surface Scale:** From `surface-container-lowest` (`#ffffff`) to `surface-dim` (`#c7dde9`).

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off content. In this design system, boundaries are created through **background color shifts**. 
*   *Implementation:* A card (`surface-container-lowest`) should sit on a section background (`surface-container-low`). The 4-8% difference in value is enough to define the edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
1.  **Base Layer:** `surface` (#f3faff).
2.  **Structural Sections:** `surface-container-low` (#e6f6ff).
3.  **Active Interactive Cards:** `surface-container-lowest` (#ffffff).
4.  **Floating Modals:** Use Glassmorphism (Semi-transparent `surface` with a 20px backdrop-blur).

### Signature Textures
Main CTAs and Hero headers should utilize a **Subtle Tonal Gradient** from `primary` (#00322d) to `primary-container` (#004b44) at a 135-degree angle. This adds "soul" and prevents the flat, "template" look.

---

## 3. Typography: Editorial Authority

We pair two sans-serifs to create a distinction between "Data" and "Direction."

*   **Display & Headlines (Manrope):** Used for large numbers and section headers. Manrope’s geometric yet open structure feels modern and precise. Use `display-lg` (3.5rem) for total balance views to give them a "monumental" feel.
*   **Body & Labels (Work Sans):** Chosen for its exceptional legibility at small sizes. Work Sans handles financial tables and dense transaction lists without becoming a "blur."

**Hierarchy Note:** Always use `on-surface-variant` (#3f4947) for secondary labels to ensure the primary data (in `on-surface`) pops with editorial clarity.

---

## 4. Elevation & Depth: Tonal Layering

We convey hierarchy through "Tonal Lift" rather than traditional heavy shadows.

*   **The Layering Principle:** Stacking is the primary tool for depth. An expense category chip should be `secondary-container` sitting on a `surface-container` card.
*   **Ambient Shadows:** For floating elements (like a Bottom Sheet or a FAB), use a custom shadow: `box-shadow: 0 12px 32px rgba(7, 30, 39, 0.06)`. Note the 6% opacity—it mimics natural light, not a digital effect.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline-variant` (#bfc9c6) at **20% opacity**. It should be a suggestion of a line, not a hard edge.

---

## 5. Components

### Buttons & CTAs
*   **Primary:** Gradient of `primary` to `primary-container`. Corner radius: `md` (0.375rem).
*   **Secondary:** Ghost style. No background, `on-surface` text, with a `2.5` spacing unit (0.625rem) padding.
*   **Interaction:** On hover, shift the gradient density rather than changing the base color.

### Cards & Expense Lists
*   **Strict Rule:** No dividers. Separate transactions using `1.5` (0.375rem) or `2` (0.5rem) vertical spacing. 
*   **Visual Grouping:** Group daily transactions within a `surface-container-low` wrapper to visually isolate "Yesterday" from "Today" without using a single line.

### Inputs & Financial Data Entry
*   **The "Focus Glow":** When an input is active, do not just change the border color. Apply a subtle `primary-fixed` (#b1eee4) outer glow (4px spread) to make the field feel "energized."
*   **Typography:** All currency inputs must use `headline-lg` (Manrope) for the value and `label-md` (Work Sans) for the currency code.

### Additional Signature Components
*   **The Growth Sparkline:** A minimal, non-axes trend line using `tertiary` (#003321) with a 2px stroke, sitting behind the balance text as a subtle watermark.
*   **Progress Pill:** For budget tracking, use a wide, flat pill with `secondary-container` as the track and `primary` as the fill. 

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical white space. For example, give the left margin of a dashboard `8` (2rem) and the right margin `4` (1rem) to create an editorial "pull."
*   **Do** use `9999px` (full) roundness for chips and status indicators to contrast against the `md` (0.375rem) roundedness of containers.
*   **Do** use `surface-bright` for areas where the user needs to focus, like a "New Transaction" flow.

### Don’t:
*   **Don’t** use pure black (#000000) for text. Always use `on-surface` (#071e27) to maintain the professional, deep-blue tonal range.
*   **Don’t** use standard 1px dividers. If you feel the need for a line, increase your white space by one step on the spacing scale instead.
*   **Don’t** use high-saturation "Neon" greens for money. Only use the refined `tertiary` and `primary` greens provided in the palette.