import { ExternalLink } from "lucide-react";

interface SourceItem {
  label: string;
  description: string;
  url: string;
}

const SOURCES: readonly SourceItem[] = [
  {
    label: "Government of Canada: Interest Act (R.S.C., 1985, c. I-15), Section 6",
    description: "Federal statute mandating that interest on Canadian fixed mortgages cannot be calculated or compounded greater than semi-annually.",
    url: "https://laws-lois.justice.gc.ca/eng/acts/I-15/page-1.html#h-263059",
  },
  {
    label: "Financial Consumer Agency of Canada (FCAC): Minimum Down Payment Rules",
    description: "Official federal guidelines: 5% minimum on first $500,000, 10% on remainder up to $1.5M, and 20% on properties $1,500,000 or greater.",
    url: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html",
  },
  {
    label: "Canada Mortgage and Housing Corporation (CMHC): Mortgage Loan Insurance Costs",
    description: "Official CMHC loan-to-value (LTV) premium tiers (0.60% to 4.00%), amortization limits, and insurable property thresholds.",
    url: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/cmhc-mortgage-loan-insurance-costs",
  },
  {
    label: "Government of Manitoba (Taxation Division): Land Transfer Tax & Registration Fees",
    description: "Manitoba Revenue Act Part III: statutory sliding scale (0% up to $30k, 0.5% to $90k, 1.0% to $150k, 1.5% to $200k, 2.0% above) plus Land Titles transfer registration fees.",
    url: "https://www.gov.mb.ca/finance/taxation/taxes/landtransfer.html",
  },
  {
    label: "City of Winnipeg: Assessment and Taxation Department",
    description: "City of Winnipeg property tax rates, municipal assessment portioning (45% for residential properties), and combined mill rates.",
    url: "https://assessment.winnipeg.ca/",
  },
  {
    label: "Manitoba Hydro: Residential Natural Gas & Electric Heating Rates",
    description: "Current residential electricity and natural gas rates, winter heating averages, and Equal Payment Plan (EPP) seasonal structures.",
    url: "https://www.hydro.mb.ca/accounts_and_services/rates/residential_rates/",
  },
  {
    label: "Canada Mortgage and Housing Corporation (CMHC) & OSFI: Calculating GDS and TDS",
    description: "Official debt-service underwriting guidelines: Gross Debt Service (GDS) benchmark threshold of 32% to 39% based on Principal, Interest, Taxes, and Heat (PITH).",
    url: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/calculating-gds-tds",
  },
  {
    label: "Bank of Canada: Selected Financial Statistics and Benchmark Mortgage Rates",
    description: "Weekly conventional mortgage lending rates and benchmark interest rate series from Canadian chartered banks.",
    url: "https://www.bankofcanada.ca/rates/banking-and-financial-statistics/posted-interest-rates-offered-by-chartered-banks/",
  },
];

export default function MortgageSources() {
  return (
    <section
      id="sources"
      className="mt-12 bg-card rounded-3xl border border-border p-6 sm:p-10 shadow-sm scroll-mt-24"
      aria-label="Official Sources and References"
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl xl:text-3xl font-bold text-foreground font-serif mb-1">
          References
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Every statutory calculation, interest formula, tax bracket, and lending policy in this calculator is cited directly to official Canadian and Manitoba government publications.
        </p>

        <div className="h-px bg-border mb-6" aria-hidden="true" />

        <ol className="space-y-3">
          {SOURCES.map((source, index) => (
            <li key={source.url} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <span className="text-primary font-semibold select-none shrink-0" aria-hidden="true">
                [{index + 1}]
              </span>
              <span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1 group"
                >
                  <span>{source.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity inline" aria-hidden="true" />
                </a>
                <span className="text-muted-foreground"> · {source.description}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-xs italic text-muted-foreground border-t border-border/60 pt-4">
          All rates, statutory thresholds, and tax scales last verified against these official publications in November 2026.
        </p>
      </div>
    </section>
  );
}
