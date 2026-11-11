import { CheckCircle2, AlertCircle, Info, Landmark } from "lucide-react";
import type { MortgageResult } from "@/shared/types";
import { formatCurrency, formatPercent } from "@/shared/formatters";
import DonutChart from "./DonutChart";

interface MortgageBreakdownProps {
  result: MortgageResult;
}

export default function MortgageBreakdown({ result }: MortgageBreakdownProps) {
  const getAffordabilityStyles = (rating: string) => {
    switch (rating) {
      case "excellent":
        return {
          container: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
          icon: "text-emerald-600 dark:text-emerald-400",
        };
      case "good":
        return {
          container: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
          icon: "text-blue-600 dark:text-blue-400",
        };
      case "fair":
        return {
          container: "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300",
          icon: "text-amber-600 dark:text-amber-400",
        };
      case "poor":
        return {
          container: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400",
          icon: "text-rose-600 dark:text-rose-400",
        };
      default:
        return {
          container: "bg-muted border-border text-muted-foreground",
          icon: "text-muted-foreground",
        };
    }
  };

  const affordabilityStyle = getAffordabilityStyles(result.affordabilityRating);

  return (
    <div className="space-y-6">
      {/* Monthly Payment Summary Card */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold font-serif text-foreground">
              Estimated Monthly Outflow
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Includes mortgage payment, Winnipeg municipal taxes & local utilities
            </p>
          </div>
          <span className="text-2xl font-bold font-serif text-primary">
            {formatCurrency(result.totalMonthlyCost)}
            <span className="text-xs font-sans font-normal text-muted-foreground">/mo</span>
          </span>
        </div>

        {/* Chart Visualization */}
        <DonutChart
          data={[
            { label: "Mortgage P&I", value: result.monthlyPayment },
            { label: "Winnipeg Property Tax", value: result.monthlyPropertyTax },
            { label: "Home Insurance", value: result.monthlyInsurance },
            { label: "Heating & Utilities", value: result.monthlyUtilities },
          ]}
        />

        {/* 4-Item Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          <div className="p-4 bg-muted/40 border border-border rounded-2xl">
            <p className="text-xs font-medium text-muted-foreground mb-1 capitalize">
              {result.paymentFrequency === "monthly" ? "Mortgage Payment" : `${result.paymentFrequency.replace("-", " ")} Payment`}
            </p>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {formatCurrency(result.paymentAmount)}
            </p>
            {result.paymentFrequency !== "monthly" && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                ({formatCurrency(result.monthlyPayment)}/mo eq.)
              </p>
            )}
          </div>
          <div className="p-4 bg-muted/40 border border-border rounded-2xl">
            <p className="text-xs font-medium text-muted-foreground mb-1">Property Tax (Est.)</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {formatCurrency(result.monthlyPropertyTax)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ~1.25% effective net mill rate
            </p>
          </div>
          <div className="p-4 bg-muted/40 border border-border rounded-2xl">
            <p className="text-xs font-medium text-muted-foreground mb-1">Home Insurance (Est.)</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {formatCurrency(result.monthlyInsurance)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ~$100–$140/mo Winnipeg avg
            </p>
          </div>
          <div className="p-4 bg-muted/40 border border-border rounded-2xl">
            <p className="text-xs font-medium text-muted-foreground mb-1">Heating & Hydro</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {formatCurrency(result.monthlyUtilities)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Winter baseline estimate
            </p>
          </div>
        </div>

        {/* Affordability Rating Pill */}
        <div className={`p-4 rounded-2xl border ${affordabilityStyle.container}`}>
          <div className="flex items-center gap-2 mb-1.5">
            {result.affordabilityRating === "excellent" || result.affordabilityRating === "good" ? (
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${affordabilityStyle.icon}`} aria-hidden="true" />
            ) : result.affordabilityRating === "fair" ? (
              <Info className={`w-5 h-5 shrink-0 ${affordabilityStyle.icon}`} aria-hidden="true" />
            ) : (
              <AlertCircle className={`w-5 h-5 shrink-0 ${affordabilityStyle.icon}`} aria-hidden="true" />
            )}
            <span className="font-semibold text-sm capitalize">
              {result.affordabilityRating} Affordability ({result.gdsRatio}% GDS)
            </span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            Canadian Gross Debt Service (GDS) benchmark measures Principal, Interest, Taxes, and Heating (PITH) against monthly gross income. Recommended maximum threshold is 32% (or up to 39% with strong credit).
          </p>
        </div>
      </div>

      {/* Manitoba Closing Costs & Cash to Close */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Landmark className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-foreground">
              Cash Required at Closing
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upfront funds needed on completion day in Manitoba
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-sm">
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">Down Payment</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(result.closingCostsTotal - result.landTransferTax)}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">
              Manitoba Land Transfer Tax (LTT)
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(result.landTransferTaxOnly)}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">
              Land Titles Registration Fee
            </span>
            <span className="font-semibold text-foreground">
              $70
            </span>
          </div>

          <div className="flex justify-between pt-2 text-base font-bold text-foreground">
            <span>Estimated Cash to Close</span>
            <span className="text-primary font-serif text-lg">
              {formatCurrency(result.closingCostsTotal)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic pt-1">
            * Note: Does not include legal fees/disbursements (~$1,200–$1,800) or home inspection.
          </p>
        </div>
      </div>

      {/* Loan & Mortgage Details */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
        <h3 className="text-xl font-bold font-serif text-foreground mb-6">
          Loan & Amortization Summary
        </h3>

        <div className="space-y-3.5 text-sm">
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">Base Loan Principal</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(result.principalAmount)}
            </span>
          </div>
          {result.cmhcInsurance > 0 && (
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">CMHC Default Insurance Premium</span>
              <span className="font-semibold text-foreground">
                + {formatCurrency(result.cmhcInsurance)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">Total Financed Mortgage</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(result.totalLoanAmount)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">Total Interest over Amortization</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(result.totalInterest)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/60">
            <span className="text-muted-foreground">Down Payment Equity</span>
            <span className="font-semibold text-foreground">
              {formatPercent(result.downPaymentPercent)}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-muted-foreground">Statutory Minimum Down Payment</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(result.minimumDownPayment)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
