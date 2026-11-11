import { CheckCircle, Info } from "lucide-react";
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
          container: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
          header: "text-green-700 dark:text-green-300",
          body: "text-green-800 dark:text-green-200",
        };
      case "good":
        return {
          container: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
          header: "text-blue-700 dark:text-blue-300",
          body: "text-blue-800 dark:text-blue-200",
        };
      case "fair":
        return {
          container: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
          header: "text-yellow-700 dark:text-yellow-300",
          body: "text-yellow-800 dark:text-yellow-200",
        };
      case "poor":
        return {
          container: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
          header: "text-red-700 dark:text-red-300",
          body: "text-red-800 dark:text-red-200",
        };
      default:
        return {
          container: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          header: "text-gray-700 dark:text-gray-300",
          body: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const affordabilityStyle = getAffordabilityStyles(result.affordabilityRating);

  return (
    <>
      {/* Main Results */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Your Monthly Payment
        </h3>

        {/* Chart Visualization */}
        <DonutChart
          data={[
            { label: "Mortgage", value: result.monthlyPayment, color: "#2563eb" },
            { label: "Property Tax", value: result.monthlyPropertyTax, color: "#4f46e5" },
            { label: "Insurance", value: result.monthlyInsurance, color: "#9333ea" },
            { label: "Utilities", value: result.monthlyUtilities, color: "#db2777" },
          ]}
        />

        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-300">Total monthly housing cost</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mortgage Payment</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {formatCurrency(result.monthlyPayment)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Property Tax</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {formatCurrency(result.monthlyPropertyTax)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Home Insurance</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {formatCurrency(result.monthlyInsurance)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Utilities (Est.)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {formatCurrency(result.monthlyUtilities)}
            </p>
          </div>
        </div>

        {/* Affordability Rating */}
        <div className={`p-4 rounded-xl border-2 ${affordabilityStyle.container}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.affordabilityRating === "excellent" || result.affordabilityRating === "good" ? (
              <CheckCircle className={`w-5 h-5 ${affordabilityStyle.header}`} aria-hidden="true" />
            ) : (
              <Info className={`w-5 h-5 ${affordabilityStyle.header}`} aria-hidden="true" />
            )}
            <span className={`font-semibold capitalize ${affordabilityStyle.header}`}>
              {result.affordabilityRating} Affordability ({result.gdsRatio}% GDS)
            </span>
          </div>
          <p className={`text-sm ${affordabilityStyle.body}`}>
            Based on Canadian Gross Debt Service (GDS) ratios. Standard qualification recommends keeping housing costs at or under 32% of monthly income.
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Loan Details
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Principal Amount</span>
            <span className="font-semibold dark:text-gray-100">
              {formatCurrency(result.principalAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
            <span className="font-semibold dark:text-gray-100">
              {formatCurrency(result.totalInterest)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Down Payment</span>
            <span className="font-semibold dark:text-gray-100">
              {formatPercent(result.downPaymentPercent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Min. Required Down Payment</span>
            <span className="font-semibold dark:text-gray-100">
              {formatCurrency(result.minimumDownPayment)}
            </span>
          </div>
          {result.cmhcInsurance > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">CMHC Insurance</span>
              <span className="font-semibold dark:text-gray-100">
                {formatCurrency(result.cmhcInsurance)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

