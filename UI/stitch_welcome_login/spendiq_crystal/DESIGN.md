# Design System Specification: The Intelligent Ledger

## 1. Overview & Creative North Star
This design system moves beyond the rigid, "templated" feel of standard financial applications to embrace a philosophy we call **"The Digital Curator."** 

In a sector often defined by clutter and anxiety, this system prioritizes clarity through **Editorial Sophistication**. We achieve a "Trustworthy" and "Intelligent" vibe by treating the UI not as a collection of boxes, but as a series of curated, physical layers. By utilizing intentional asymmetry, expansive white space, and a high-contrast typography scale, we transform raw financial data into a calm, authoritative narrative. The experience should feel like a premium concierge service—silent, observant, and impeccably organized.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in Google’s core primaries but executed with a "High-End Editorial" lens.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. Use `surface-container-low` (#f3f4f5) sections sitting on a `surface` (#f8f9fa) background to define zones.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine paper. 
*   **Base:** `surface` (#f8f9fa)
*   **Secondary Zone:** `surface-container-low` (#f3f4f5)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff)
*   **Prominent Accents:** Use `primary-container` (#1a73e8) with `on-primary` (#ffffff) text for high-impact insights.

### Glass & Gradient Transitions
To avoid a flat, "out-of-the-box" appearance:
*   **Signature Textures:** For Hero sections or primary CTAs, use a subtle linear gradient (Top-Left to Bottom-Right) transitioning from `primary` (#005bbf) to `primary-container` (#1a73e8).
*   **Floating Navigation:** Use **Glassmorphism**. Apply `surface` (#f8f9fa) at 80% opacity with a `20px` backdrop-blur to allow underlying content to bleed through, creating an integrated, premium feel.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font pairing to balance character with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-forward" personality. Use `display-lg` (3.5rem) for balance summaries to command authority.
*   **Title & Body (Inter):** Chosen for its exceptional legibility at small sizes. Use `body-md` (0.875rem) for all transactional data.

**Hierarchy as Identity:** 
High-contrast scaling is mandatory. A large `headline-lg` (2rem) summary should be immediately followed by a quiet `label-md` (0.75rem) in `on-surface-variant` (#414754) to create an information hierarchy that feels scanned, not read.

---

## 4. Elevation & Depth: Tonal Layering
Traditional Material shadows are too heavy for a "Simple" vibe. We use **Tonal Layering** to create lift.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` (#ffffff) card on top of a `surface-container-low` (#f3f4f5) background. The subtle 2% shift in brightness provides all the separation necessary.
*   **Ambient Shadows:** If an element must float (e.g., a Fraud Alert FAB), use a hyper-diffused shadow: `box-shadow: 0 12px 32px rgba(25, 28, 29, 0.06);`. The shadow color must be a tint of the `on-surface` color, never pure black.
*   **The "Ghost Border":** For accessibility in input fields, use `outline-variant` (#c1c6d6) at **20% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components: Soft & Intentional

### Buttons
*   **Primary:** `rounded-full` (9999px), `primary` (#005bbf) background. Use the signature gradient for the "Main Action" of any screen.
*   **Secondary:** `rounded-full`, `surface-container-high` (#e7e8e9) with `on-surface` (#191c1d) text. No border.

### Cards & Lists
*   **Constraint:** Forbid the use of divider lines. 
*   **Execution:** Separate transactions using `spacing-4` (1rem) of vertical whitespace. Group related items within a `md` (1.5rem) rounded container.
*   **Fraud Alerts:** Use `tertiary-container` (#dc392c) with a subtle `4px` left-accent bar to denote urgency without breaking the soft aesthetic.

### Input Fields
*   **Style:** `surface-container-highest` (#e1e3e4) backgrounds with `1rem` (DEFAULT) corner radius. 
*   **Interaction:** On focus, transition the background to `surface-container-lowest` (#ffffff) and apply a "Ghost Border."

### Specialized Finance Components
*   **The Trust Meter:** A custom circular gauge using `secondary` (#006e2c) and `secondary-fixed-dim` (#6ddd81) to visualize credit health or fraud safety scores.
*   **Spend-Stream:** A vertical list where the "Time" is an overlapping editorial element, using `headline-sm` typography to break the standard grid.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., `spacing-8` on the left, `spacing-12` on the right) for header sections to create an editorial look.
*   **Do** favor `surface` shifts over lines. If you think you need a divider, add 16px of whitespace instead.
*   **Do** use `rounded-lg` (2rem) for large dashboard containers to emphasize the "soft" brand personality.

### Don’t
*   **Don't** use pure black (#000000) for text. Always use `on-surface` (#191c1d) to maintain the premium, soft-contrast look.
*   **Don't** use standard Material 2 shadows. They feel dated and "heavy."
*   **Don't** crowd the interface. If the user feels "intelligent," it’s because the UI gives them room to think. Aim for at least 20% "dead" space on every screen.