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

---

## [v1.1.0] — 2026-10-01

### Summary
- Initial prototype release of the Winnipeg Mortgage Calculator.
- Basic payment calculation, down payment and interest rate inputs, and initial Winnipeg contextual insights.

