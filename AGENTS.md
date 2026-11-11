# AGENTS.md — Winnipeg Mortgage Calculator (`mortgage.wpeg.app`)

Guidelines, architecture, and conventions for AI coding agents working on this codebase.

## 1. Project Overview

- **Name:** Winnipeg Mortgage Calculator
- **Canonical URL:** `https://mortgage.wpeg.app`
- **Family:** WPEG.app suite of Winnipeg civic and financial tools
- **Framework:** Vite + React 19 + TypeScript + Tailwind CSS v3 + React Router v7
- **Deployment:** Netlify (static build output in `dist/`)

## 2. Directory Layout

```
.
├── public/                 # Static assets (favicons, logos, sitemap.xml, robots.txt, rss.xml, llms.txt)
│   └── changelog/          # RSS XML feed (public/changelog/rss.xml)
├── src/
│   ├── react-app/
│   │   ├── components/     # Modular UI components (SiteHeader, SiteFooter, MortgageForm, etc.)
│   │   ├── context/        # React Context (ThemeContext)
│   │   ├── hooks/          # React hooks (useTheme, useColorTheme)
│   │   ├── lib/            # Theme utilities (colorTheme.ts)
│   │   ├── pages/          # Router page views (Home.tsx, Changelog.tsx)
│   │   ├── App.tsx         # Root component with React Router and ThemeProvider
│   │   ├── index.css       # Tailwind directives & CSS custom properties
│   │   └── main.tsx        # React entrypoint
│   └── shared/             # Domain logic and pure calculation utilities
│       ├── constants.ts    # App version (APP_VERSION), titles, portal URLs
│       ├── formatters.ts   # Currency, percentage, and number formatters
│       ├── mortgageCalculator.ts # Canadian compounding, CMHC, down payment logic
│       ├── themes.ts       # 20+ accessible color theme presets
│       └── types.ts        # TypeScript schemas & Zod definitions
├── tests/                  # Unit test suite
├── CHANGELOG.md            # Internal developer changelog (technical, includes paths/lines)
├── DESIGN.md               # Design system specifications & token guide
├── README.md               # High-level overview & setup instructions
└── llms.txt                # Machine-readable knowledge summary
```

## 3. Core Development Commands

- Run local dev server: `npm run dev`
- Run test suite: `npm test`
- Run typecheck and build: `npm run build`
- Run ESLint: `npm run lint`

## 4. Key Engineering & Financial Rules

1. **Canadian Semi-Annual Compounding:**
   - In Canada, fixed mortgage rates compound semi-annually, not monthly.
   - Monthly effective rate: `r = (1 + annualRate / 2)^(2/12) - 1`.
   - Never use simple monthly division (`annualRate / 12`) for Canadian fixed mortgages.

2. **Down Payment & CMHC Insurance:**
   - Up to $500,000: 5% minimum down payment.
   - $500,000 to $1,499,999: 5% on first $500k + 10% on remainder.
   - $1,500,000+: 20% minimum (uninsured).
   - CMHC insurance is mandatory when down payment is less than 20% and purchase price is under $1.5M.
   - Insurance premium is added directly to principal loan amount.

3. **Two Changelogs Distinction:**
   - `CHANGELOG.md` at root is **INTERNAL**: Technical, includes paths, function names, and architecture notes.
   - `/changelog` route (`src/react-app/pages/Changelog.tsx`) is **PUBLIC-FACING**: Friendly for everyday users, strictly omits file paths and source references for security.
   - Always **APPEND** new versions; never overwrite or truncate history.

4. **WPEG Design System:**
   - Adhere to `DESIGN.md`. All buttons, cards, headers, and footers must match the WPEG family style (e.g. `SiteHeader`, `SiteFooter`).
   - Use theme variables (`theme-surface`, `theme-button`, `bg-card`, `text-primary`, etc.).

