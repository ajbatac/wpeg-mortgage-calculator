# Internal Technical Changelog — Winnipeg Mortgage Calculator

This document records technical details, architectural decisions, file paths, code changes, and release history for internal engineering reference. For the public-facing release notes, see the `/changelog` page.

---

## [v1.2.0] — 2026-11-11

### Summary
Comprehensive architectural modernization, WPEG design system unification, Canadian semi-annual compounding implementation, CMHC insurance calculation hardening, multi-theme engine integration, and public changelog/RSS feed establishment.

### 1. Calculation Engine & Financial Accuracy
- **File:** `src/shared/mortgageCalculator.ts`
  - Replaced naive monthly interest compounding (`rate / 12`) with official Canadian semi-annual compounding governed by the Canadian Interest Act:
    ```typescript
    // Semi-annual compounding formula for Canadian fixed-rate mortgages:
    const monthlyRate = Math.pow(1 + annualRate / 2, 2 / 12) - 1;
    const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    ```
  - Implemented `calculateMinimumDownPayment(purchasePrice: number)` adhering to federal mortgage rules:
    - 5% on purchase price up to $500,000.
    - 10% on the portion between $500,000 and $1,499,999.
    - 20% on homes priced at $1,500,000 or greater.
  - Implemented and exported `calculateCMHCInsurance(purchasePrice, downPayment)` with Loan-to-Value (LTV) tiers:
    - Up to 65% LTV: 0.60%
    - 65.01% - 75% LTV: 1.70%
    - 75.01% - 80% LTV: 2.40%
    - 80.01% - 85% LTV: 2.80%
    - 85.01% - 90% LTV: 3.10%
    - 90.01% - 95% LTV: 4.00%
    - Down payment >= 20%: $0 (uninsured conventional mortgage)
  - Fixed floating point precision issue in CMHC insurance calculation:
    ```typescript
    return Math.round(loanAmount * premiumRate * 100) / 100;
    ```
  - Added Gross Debt Service (GDS) ratio calculation incorporating Principal, Interest, Taxes, and Heating (PITH) against gross household income:
    ```typescript
    const monthlyPITH = monthlyMortgagePayment + monthlyPropertyTax + monthlyHeating;
    const gdsRatio = annualIncome ? (monthlyPITH / (annualIncome / 12)) * 100 : undefined;
    ```

### 2. Type System & Schema Validation
- **File:** `src/shared/types.ts`
  - Added `PropertyType` and `HeatingType` enums:
    ```typescript
    export type PropertyType = 'single_family' | 'condo' | 'townhouse' | 'duplex';
    export type HeatingType = 'natural_gas' | 'electric' | 'other';
    ```
  - Updated `MortgageResult` interface with `totalLoanAmount`, `minimumDownPayment`, `gdsRatio`, and `affordabilityRating`.
- **File:** `src/shared/formatters.ts`
  - Added safe guards against `NaN` and `Infinity` in `formatCurrency()`.
  - Added `formatPercent()` for decimal percentage formatting.

### 3. Component Architecture & Decomposition
- Decomposed monolithic 692-line `MortgageCalculator.tsx` into modular single-responsibility components:
  - `src/react-app/components/MortgageForm.tsx`: Controlled inputs for purchase price, down payment, rate, amortization, and income.
  - `src/react-app/components/MortgageBreakdown.tsx`: Monthly payment breakdown card, principal/interest/tax/heating splits, and affordability metrics.
  - `src/react-app/components/MortgageWarnings.tsx`: Down payment warnings and CMHC insurance alerts.
  - `src/react-app/components/MortgageDisclaimer.tsx`: Legal disclosures, source citations, and bank rate disclaimers.
  - `src/react-app/components/WinnipegFunFacts.tsx`: Local contextual real estate trivia and neighbourhood insights.
  - `src/react-app/components/DonutChart.tsx`: SVG donut visualization of monthly housing expense distribution.

### 4. WPEG Ecosystem Design Alignment
- **File:** `src/react-app/components/SiteHeader.tsx`
  - Mirrored standard header from `salary.wpeg.app` with responsive WPEG branding, ColorThemeSelector, DarkModeToggle, and portal navigation.
- **File:** `src/react-app/components/SiteFooter.tsx`
  - Mirrored standard footer from `salary.wpeg.app` with giant watermark typography, cross-tool directory, social links, Winnipeg snowflake badge, and version link wired to internal `/changelog`.
- **File:** `src/shared/constants.ts`
  - Upgraded `APP_VERSION` to `'v1.2.0'`.
- **Files:** `src/shared/themes.ts`, `src/react-app/lib/colorTheme.ts`, `src/react-app/hooks/useColorTheme.ts`, `src/react-app/context/ThemeContext.tsx`
  - Integrated 20+ accessible color themes and decoupled ThemeProvider to comply with React Fast Refresh guidelines.

### 5. Public Changelog, RSS & SEO Infrastructure
- **File:** `src/react-app/pages/Changelog.tsx`
  - Created high-level, user-friendly changelog page with no exposed internal file paths or function names.
  - Added "Subscribe to this feed" pill badge linking to `/changelog/rss.xml`.
- **File:** `src/react-app/App.tsx`
  - Registered `/changelog` route under React Router.
- **Files:** `public/changelog/rss.xml` & `public/rss.xml`
  - Created fully validated RSS 2.0 XML feeds containing itemized bullet descriptions matching public release notes.
- **Files:** `public/sitemap.xml`, `public/robots.txt`, `public/_redirects`, `public/llms.txt`, `llms.txt`
  - Established XML sitemap, robot crawler rules, Netlify SPA/RSS rewrites, and canonical LLM reference document.
- **Files:** `AGENTS.md` & `DESIGN.md`
  - Documented engineering guidelines for AI agents and the unified WPEG design system token catalog.

### 6. Design System Enforcement & Manitoba Closing Costs (Phase A & B)
- **Files:** `src/react-app/components/MortgageForm.tsx`, `src/react-app/components/MortgageBreakdown.tsx`, `src/react-app/components/DonutChart.tsx`
  - Stripped all hardcoded Tailwind blue, indigo, and gray classes; aligned all surfaces, borders, text, and active buttons with WPEG CSS custom property tokens (`bg-card`, `border-border`, `text-primary`, `bg-primary`, `focus:ring-primary`).
  - Added Annual Household Income input field with Canadian GDS affordability qualification guidance.
  - Added quick down payment percentage selector chips (5%, 10%, 15%, 20%).
- **File:** `src/shared/mortgageCalculator.ts`
  - Implemented and exported `calculateManitobaLandTransferTax(propertyValue: number)` calculating statutory graduated tiers (0% to $30k, 0.5% to $90k, 1.0% to $150k, 1.5% to $200k, 2.0% above) plus $70 land titles fee.
  - Corrected property tax rate calculation to reflect Manitoba's 45% residential assessment portioning factor (effective ~1.25% market rate).
  - Aligned Gross Debt Service (GDS) calculation strictly to Canadian PITH (Principal, Interest, Taxes, Heat), removing casualty insurance from the debt-service qualification ratio.
- **File:** `src/react-app/components/WinnipegFunFacts.tsx`
  - Replaced neon purple/pink gradients and emoji clutter with an editorial "Local Winnipeg Perspective" card grid adhering to anti-slop principles.
- **Files:** `src/react-app/components/MortgageDisclaimer.tsx`, `index.html`
  - Purged legacy "Prairie Home Calculator" references; unified branding and metadata to "Winnipeg Mortgage Calculator | WPEG.app" with canonical URL and social tags.
- **File:** `src/react-app/components/MortgageCalculator.tsx`
  - Triggered initial calculation on mount so users are greeted with real data rather than an empty placeholder.
  - Added `aria-live="polite"` to the results container for screen reader accessibility.

### 7. Reactive Interaction, Payment Schedules & Security Hardening (Phase C & D)
- **Files:** `src/shared/types.ts`, `src/shared/mortgageCalculator.ts`, `src/react-app/components/MortgageForm.tsx`, `src/react-app/components/MortgageBreakdown.tsx`
  - Added Canadian payment frequency schedules (`monthly`, `semi-monthly`, `bi-weekly`, `accelerated-bi-weekly`, `weekly`, `accelerated-weekly`) with interest-saving accelerated calculation logic.
  - Added synchronized down payment range slider alongside percentage chips for seamless touch/desktop adjustments.
  - Added amortization qualification validation for insured mortgages (<20% down).
  - Integrated mobile viewport smooth scroll to `#results` upon calculation execution.
- **File:** `src/react-app/components/ColorThemeSelector.tsx`
  - Implemented full WAI-ARIA accessible keyboard menu navigation with `ArrowUp`, `ArrowDown`, `Home`, `End`, and focus-trapped dismissals (`Escape`, `Tab`).
- **Files:** `public/_headers`, `index.html`
  - Added Netlify security headers configuration (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and asset cache policies).
  - Optimized OpenGraph and Twitter social card tags and preconnected font origins.

### 8. Structured Data, Web Manifest & SEO Hardening (Phase E)
- **File:** `index.html`
  - Injected `schema.org/WebApplication` JSON-LD structured data for rich snippets in Google Search results.
  - Optimized Google Fonts loading with DNS prefetch, preconnect, and font style preloading (`Inter` and `Lora`).
- **File:** `public/site.webmanifest`
  - Overhauled manifest metadata: updated application name to "Winnipeg Mortgage Calculator | WPEG.app", short name to "Mortgage WPEG", and theme colors to WPEG brand palette (`#524495`).
- **Files:** `public/_headers`, `public/llms.txt`, `llms.txt`
  - Updated CSP connect sources to permit Google Analytics 4 region endpoints and collectors.
  - Documented Manitoba Land Transfer Tax scale, Canadian payment frequency models, and net assessment benchmarks in machine-readable LLM documentation.

### 9. Wikipedia-Style Citations & Official References
- **Files:** `src/react-app/components/MortgageSources.tsx`, `src/react-app/components/MortgageCalculator.tsx`, `src/react-app/components/SiteHeader.tsx`, `src/react-app/components/SiteFooter.tsx`
  - Added a dedicated Wikipedia-style numbered References & Sources section (`#sources`) verifying every calculation claim with direct links to primary government publications:
    1. Interest Act (R.S.C., 1985, c. I-15), Section 6 (Canadian semi-annual compounding mandate)
    2. Financial Consumer Agency of Canada (FCAC) down payment rules
    3. CMHC loan-to-value mortgage default insurance cost schedules
    4. Manitoba Revenue Act Part III graduated Land Transfer Tax scale and Land Titles registration fees
    5. City of Winnipeg Assessment & Taxation Department residential 45% portioning factor and mill rates
    6. Manitoba Hydro residential natural gas & electricity heating tariffs
    7. CMHC & OSFI debt service ratio (GDS/TDS) PITH qualification guidelines
    8. Bank of Canada chartered bank conventional mortgage rate series
  - Added jump navigation links in the header and footer directly referencing `/#sources`.

---

## [v1.1.0] — 2026-10-01

### Summary
- Initial prototype release of the Winnipeg Mortgage Calculator.
- Basic payment calculation, down payment and interest rate inputs, and initial Winnipeg contextual insights.

