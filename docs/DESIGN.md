# Design Guidelines

**Project:** C.S.I. Higher Secondary School For The Partially Hearing, Manakala  
**Reference:** [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)  
**PRD Alignment:** [PRD.md](./PRD.md) — 100% Lighthouse Accessibility, full WCAG compliance

This document defines UI/UX standards for the CSI HSS Manakala web app. It merges industry best practices with project-specific accessibility requirements for a school serving the partially hearing community.

---

## 1. Design System

### 1.1 Colors

| Token | Purpose | Light | High Contrast |
|-------|---------|-------|---------------|
| Primary (50–950) | Brand, CTAs, links | `#468eef` (600) | — |
| `hc-bg` | Background | — | `#000000` |
| `hc-text` | Body text | — | `#FFFFFF` |
| `hc-accent` | Accents | — | `#FFFF00` |
| `hc-interactive` | Buttons, links | — | `#00FFFF` |
| Zinc (50–900) | Neutrals, borders | — | — |

- Use `primary-*` for actions and links in normal contrast.
- High-contrast mode (`data-theme="high-contrast"`) switches to `hc-*` tokens.
- All interactive elements must meet WCAG 2.1 AA contrast (4.5:1 text, 3:1 large text/UI).

### 1.2 Typography

- **Standard:** Open Sans, system-ui, sans-serif  
- **Dyslexia-friendly:** OpenDyslexic, Comic Sans MS, sans-serif  
- **Font sizes:** `small` | `normal` | `large` | `extraLarge` (via Accessibility Toolbar)
- Use `font-variant-numeric: tabular-nums` for numbers (counts, dates, tables).
- Use `text-wrap: balance` or `text-pretty` on headings to avoid widows.
- Curly ellipsis `…` (U+2026), not three dots `...`.
- Curly quotes `“` `”` where appropriate.

### 1.3 Spacing & Layout

- Container: `container mx-auto px-4 sm:px-6 lg:px-8`
- Main content: `id="main-content"` with `scroll-margin-top` on headings for anchor jumps.
- Full-bleed layouts: use `env(safe-area-inset-*)` for notches.
- Prefer flex/grid over JS measurement for layout.
- Avoid extra scrollbars: `overflow-x-hidden` where needed and fix overflow sources.

---

## 2. Accessibility (Critical)

### 2.1 Skip Navigation

- Skip link to `#main-content`; visible only on keyboard focus (`sr-only focus:not-sr-only`).
- Component: `SkipNavigation.tsx`.

### 2.2 Semantic HTML

Use semantic elements before ARIA:

- `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<address>`
- Headings hierarchical (`h1`–`h6`); one `h1` per page.
- Landmarks and headings define structure for screen readers.

### 2.3 Interactive Elements

| Element | Requirement |
|---------|-------------|
| Icon-only buttons | `aria-label` describing the action |
| Form controls | Associated `<label>` with `htmlFor` or wrapping |
| Images | `alt` (or `alt=""` if decorative) |
| Decorative icons | `aria-hidden="true"` |
| Links | `<a>` or `<Link>` with `href` — no `<div>`/`<span>` with click handlers |
| Navigation | `<a>`/`<Link>` for routes — supports Cmd/Ctrl+click, middle-click |

### 2.4 Focus States

- All interactive elements must have a visible focus state.
- Prefer `focus-visible:ring-*` or equivalent; never `outline: none` without a replacement.
- Use `:focus-visible` over `:focus` to avoid focus ring on click.
- For compound controls, use `:focus-within`.
- Default pattern: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`

### 2.5 Motion

- Respect `prefers-reduced-motion` via Accessibility Toolbar (`motion: 'reduced'`).
- Animations: `transform` and `opacity` only (compositor-friendly).
- Avoid `transition: all`; list properties explicitly.
- Ensure animations can be interrupted by user input.
- No motion in reduced mode: `fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn'`.

### 2.6 Async Updates

- Toasts, validation, loading states: `aria-live="polite"` (or `assertive` when urgent).
- Loading text: end with `…` (e.g. `“Loading…”`, `“Saving…”`).

---

## 3. Forms

- Inputs: `autocomplete` and meaningful `name`.
- Correct `type` (`email`, `tel`, `url`, `number`) and `inputmode` where useful.
- Never block paste (`onPaste` + `preventDefault`).
- Labels clickable via `htmlFor` or wrapping the control.
- `spellCheck={false}` on email, codes, usernames.
- Checkboxes/radios: label + control as a single hit target (no dead zones).
- Submit button remains enabled until request starts; show spinner during request.
- Errors inline next to fields; focus first error on submit.
- Placeholders end with `…` when showing an example pattern.
- `autocomplete="off"` only on non-auth fields to avoid password manager issues.
- Warn before leaving with unsaved changes (`beforeunload` or router guard).

---

## 4. Content & Copy

- Active voice: e.g. “Install the CLI” not “The CLI will be installed”.
- Title case for headings and buttons (Chicago style).
- Numerals for counts: e.g. “8 deployments” not “eight”.
- Specific button labels: “Save API Key” not “Continue”.
- Error messages: include what went wrong and how to fix it.
- Second person; avoid first person.
- Use `&` instead of “and” when space is limited.

---

## 5. Images

- Provide explicit `width` and `height` to prevent layout shift (CLS).
- Below-fold images: `loading="lazy"`.
- Above-fold or critical images: `priority` or `fetchpriority="high"`.
- `OptimizedImage.tsx` supports loading and transitions; ensure dimensions are set.
- All images require an `alt` attribute.

---

## 6. Touch & Interaction

- `touch-action: manipulation` to reduce double-tap zoom delay.
- Set `-webkit-tap-highlight-color` intentionally.
- Modals/drawers/sheets: `overscroll-behavior: contain`.
- During drag: disable text selection and use `inert` on dragged elements.
- Use `autoFocus` sparingly — desktop only, single primary input; avoid on mobile.

---

## 7. Dark Mode & Theming

- High-contrast: `color-scheme: dark` on `<html>` for dark themes.
- `<select>` and other native controls: explicit `background-color` and `color` in dark mode.
- Theme switching via `document.documentElement.setAttribute('data-theme', 'high-contrast')`.

---

## 8. Locale & i18n

- Dates/times: `Intl.DateTimeFormat` (no hardcoded formats).
- Numbers/currency: `Intl.NumberFormat`.
- Language: `Accept-Language` / `navigator.languages`, not IP.

---

## 9. Hydration Safety

- Inputs with `value` need `onChange` (or use `defaultValue` for uncontrolled).
- Guard date/time rendering against server vs client mismatch.
- Use `suppressHydrationWarning` only where necessary.

---

## 10. Anti-Patterns (Avoid)

| Anti-pattern | Correct approach |
|--------------|------------------|
| `user-scalable=no` or `maximum-scale=1` | Never disable zoom |
| `onPaste` with `preventDefault` | Allow paste |
| `transition: all` | List properties explicitly |
| `outline-none` without focus replacement | Visible focus ring |
| Inline `onClick` navigation without `<Link>` | Use `<Link>` |
| `<div>`/`<span>` with click handlers for nav | Use `<button>` or `<a>` |
| Images without dimensions | Always set `width` and `height` |
| Large arrays `.map()` without virtualization | Use `virtua` or `content-visibility: auto` |
| Form inputs without labels | Always associate labels |
| Icon buttons without `aria-label` | Add descriptive `aria-label` |
| Hardcoded date/number formats | Use `Intl.*` |
| `autoFocus` without clear justification | Avoid or use sparingly |

---

## 11. Project-Specific Components

| Component | Responsibility |
|-----------|----------------|
| `SkipNavigation` | Skip to main content link |
| `AccessibilityToolbar` | Font size, font family, contrast, motion |
| `Header` | Logo, nav, mobile menu; sticky, ARIA-controlled |
| `Footer` | Links, address |
| `OptimizedImage` | Lazy load, placeholder, dimensions |
| `ProtectedRoute` | Auth guard for admin routes |

---

## 12. Review Checklist

Before merging UI changes, verify:

- [ ] All interactive elements have visible focus states
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Images have `alt` and dimensions
- [ ] Motion respects reduced-motion preference
- [ ] No `transition: all` or `outline: none` without replacement
- [ ] Loading text uses `…` (e.g. `Loading…`)
- [ ] Links use `<Link>` for in-app navigation
- [ ] Dates/numbers use `Intl.*` where applicable

---

## 13. References

- [PRD.md](./PRD.md) — Product requirements and success criteria  
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)  
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
