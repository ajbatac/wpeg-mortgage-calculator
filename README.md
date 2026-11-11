## Prairie Home Calculator / Winnipeg Mortgage Calculator

To run the devserver:
```
npm install
npm run dev
```


---

### Overview

The **Winnipeg Mortgage Calculator** ([mortgage.wpeg.app](https://mortgage.wpeg.app)) is a fast, privacy-first Canadian mortgage estimation tool specifically tailored for Winnipeg, Manitoba home buyers.

### Key Capabilities

- **Canadian Semi-Annual Compounding:** Computes mortgage payments using official Canadian compounding standards rather than simple monthly compounding.
- **CMHC Insurance Calculation:** Automatically assesses mortgage default insurance premiums according to federal loan-to-value (LTV) rules.
- **Winnipeg Homeownership Expenses:** Integrates local estimates for City of Winnipeg property taxes, winter heating costs, and home insurance.
- **Affordability Analysis (GDS):** Calculates Gross Debt Service ratio against gross monthly income to evaluate purchasing comfort.
- **Customizable Themes & Dark Mode:** Offers 20+ accessible color themes and seamless dark/light mode toggling.
- **Privacy First:** 100% client-side calculations; no personal or financial information leaves your browser.

### Available Scripts

- `npm run dev` — Launch the local Vite development server.
- `npm run build` — Create an optimized production build in `dist/`.
- `npm run preview` — Locally preview the production build.
- `npm test` — Run the automated test suite.
- `npm run lint` — Validate code styling and TypeScript consistency.

---

### Version 1.3.0 Enhancements

- **Manitoba Land Transfer Tax (LTT) Calculation:** Automatically estimates statutory graduated land transfer taxes and registration fees for complete cash-to-close visibility.
- **Flexible Canadian Payment Schedules:** Compare monthly, semi-monthly, bi-weekly, accelerated bi-weekly, and weekly payment options.
- **Official References & Citations:** Every formula and statutory policy is cited directly to primary Canadian federal and Manitoba provincial publications.
- **Enhanced Keyboard Navigation:** Fully accessible WAI-ARIA theme picker and screen reader live announcements.
