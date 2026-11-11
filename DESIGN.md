# DESIGN.md — WPEG Mortgage Calculator Design System

The Winnipeg Mortgage Calculator follows the shared WPEG design language established across `portal.wpeg.app`, `salary.wpeg.app`, `jobs.wpeg.app`, and `classifieds.wpeg.ca`.

## 1. Typography

- **Headings & Brand:** `Lora` (serif), with font-feature-settings for editorial warmth.
  - Usage: Hero headings, section titles, card headers, brand wordmarks.
  - Class: `font-serif`
- **Body & Controls:** `Inter` (sans-serif), high legibility at small sizes.
  - Usage: Form inputs, labels, numbers, metadata, navigation links.
  - Class: `font-sans`

## 2. Color System & Themes

The application supports over 20 selectable themes with dynamic CSS variable switching (`data-theme` attribute on `document.documentElement`):

- **CSS Variables:**
  - `--background`: Base app background color.
  - `--foreground`: Primary text color.
  - `--primary`: Brand accent color used for CTA buttons, focus states, and primary highlights.
  - `--primary-foreground`: Text color on top of primary accent.
  - `--card`: Surface color for cards, panels, and modals.
  - `--card-foreground`: Text color within cards.
  - `--border`: Subtle delimiter color for cards and dividing rules.
  - `--muted`: Low-emphasis background for chips, pills, and secondary containers.
  - `--muted-foreground`: Secondary text color for captions and hints.
  - `--radius`: Default border radius (`0.75rem` / `12px`).

## 3. Surface & Interactive Utility Classes

- `.theme-surface`:
  - Contextual background blending with subtle borders and shadow.
  - Responsive to both dark mode and light mode.
- `.theme-button`:
  - Rounded `[var(--radius)]` button with primary brand color, hover transitions, and contrast-safe text.
- `.skip-link`:
  - Accessible hidden skip navigation link that appears on keyboard focus.

## 4. Header & Footer Conventions

- **SiteHeader:**
  - Sticky glassmorphic bar (`backdrop-blur-md bg-background/80`).
  - Features the tool logo and title on the left.
  - Contains actions on the right: Color Theme Palette Picker, Dark/Light Mode toggle, and link to WPEG Portal.
- **SiteFooter:**
  - Features large background watermark wordmark ("WPEG").
  - Brand block introducing the WPEG ecosystem with outbound portal link.
  - Standard three/four-column footer link grid: This Tool, Company, Legal, More Free WPEG Tools, and Social channels.
  - Bottom bar with copyright, Winnipeg snowflake badge, and clickable version number leading to `/changelog`.

## 5. Accessibility & Contrast Standards

- All themes enforce WCAG AA (minimum 4.5:1 contrast for normal text, 3:1 for large text).
- Focus outlines are clearly rendered for keyboard navigators.
- All forms use explicit HTML `<label>` elements and accessible `aria-*` attributes.

## 6. Citations & References Pattern

- Primary sources are presented in a dedicated Wikipedia-style References section (`#sources`).
- Citations use bracketed index numbers (`[1]`, `[2]`, etc.) in `text-primary font-semibold select-none`.
- External government links open in a new tab (`target="_blank"` with `rel="nofollow noopener noreferrer"`).
- Verification date statement is anchored at the base of the list.

