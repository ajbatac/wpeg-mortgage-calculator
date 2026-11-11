import { Calculator, DollarSign, Percent, Clock, RotateCcw, Wallet, Calendar } from "lucide-react";
import type { MortgageCalculation, PropertyType, HeatingType, PaymentFrequency } from "@/shared/types";
import { winnipegData } from "@/shared/mortgageCalculator";

interface MortgageFormProps {
  formData: MortgageCalculation;
  onChange: <K extends keyof MortgageCalculation>(field: K, value: MortgageCalculation[K]) => void;
  onCalculate: () => void;
  onReset: () => void;
  loading: boolean;
}

const PRESETS = [
  { label: "$275K", value: 275000, downPayment: 27500 },
  { label: "$375K", value: 375000, downPayment: 37500 },
  { label: "$475K", value: 475000, downPayment: 71250 },
  { label: "$575K", value: 575000, downPayment: 86250 },
  { label: "$675K", value: 675000, downPayment: 135000 },
  { label: "$875K", value: 875000, downPayment: 175000 },
  { label: "$1.1M", value: 1100000, downPayment: 220000 },
] as const;

const DOWN_PAYMENT_PERCENT_PRESETS = [5, 10, 15, 20] as const;

export default function MortgageForm({
  formData,
  onChange,
  onCalculate,
  onReset,
  loading,
}: MortgageFormProps) {
  const currentDownPaymentPercent = formData.propertyValue > 0
    ? ((formData.downPayment / formData.propertyValue) * 100)
    : 0;

  const handlePercentPresetClick = (percent: number) => {
    if (formData.propertyValue <= 0) return;
    const calculatedDownPayment = Math.round((formData.propertyValue * percent) / 100);
    onChange("downPayment", calculatedDownPayment);
  };

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Calculator className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-foreground">
            Calculate Your Mortgage
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust inputs below to see Winnipeg payments & closing costs in real time
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Property Value */}
        <div>
          <label htmlFor="propertyValue" className="block text-sm font-semibold text-foreground mb-2">
            Property Value (Purchase Price)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="propertyValue"
              type="number"
              min="0"
              value={formData.propertyValue === 0 ? "" : formData.propertyValue}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onChange("propertyValue", val);
              }}
              className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              placeholder="400,000"
            />
          </div>

          {/* Quick Property Value Pills */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Typical Winnipeg home price benchmarks:
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => {
                const isSelected = formData.propertyValue === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      onChange("propertyValue", preset.value);
                      onChange("downPayment", preset.downPayment);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="downPayment" className="block text-sm font-semibold text-foreground">
              Down Payment
            </label>
            <span className="text-xs font-semibold text-primary">
              {currentDownPaymentPercent.toFixed(1)}% of price
            </span>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="downPayment"
              type="number"
              min="0"
              value={formData.downPayment === 0 ? "" : formData.downPayment}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onChange("downPayment", val);
              }}
              className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              placeholder="80,000"
            />
          </div>

          {/* Down Payment Quick Percent Chips */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Quick tiers:</span>
            {DOWN_PAYMENT_PERCENT_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentPresetClick(pct)}
                className="px-2.5 py-1 text-xs rounded-md bg-muted/70 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Down Payment Slider */}
          <div className="mt-3.5">
            <input
              type="range"
              min="0"
              max={formData.propertyValue > 0 ? formData.propertyValue : 1000000}
              step={formData.propertyValue > 500000 ? 5000 : 1000}
              value={formData.downPayment}
              onChange={(e) => onChange("downPayment", parseInt(e.target.value, 10) || 0)}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Adjust down payment amount with slider"
            />
          </div>
        </div>

        {/* Household Annual Income */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="annualIncome" className="block text-sm font-semibold text-foreground">
              Annual Household Income (Optional)
            </label>
            <span className="text-xs text-muted-foreground">
              Winnipeg median: $85,000
            </span>
          </div>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="annualIncome"
              type="number"
              min="0"
              value={formData.annualIncome ? formData.annualIncome : ""}
              onChange={(e) => {
                const val = e.target.value === "" ? undefined : Math.max(0, parseInt(e.target.value, 10) || 0);
                onChange("annualIncome", val);
              }}
              className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              placeholder="85,000 (used for Canadian GDS affordability score)"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Calculates your Gross Debt Service (GDS) ratio against standard Canadian qualifying limits (32% - 39%).
          </p>
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-semibold text-foreground mb-2">
            Mortgage Interest Rate (%)
          </label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="interestRate"
              type="number"
              step="0.01"
              min="0"
              max="25"
              value={formData.interestRate === 0 ? "" : formData.interestRate}
              onChange={(e) => {
                const val = Math.max(0, parseFloat(e.target.value) || 0);
                onChange("interestRate", val);
              }}
              className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              placeholder="4.84"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <span>
              Winnipeg benchmark rates: 1-year {winnipegData.currentInterestRates.fixed1Year}%, 5-year {winnipegData.currentInterestRates.fixed5Year}%
            </span>
          </div>
        </div>

        {/* Amortization Period & Payment Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amortizationYears" className="block text-sm font-semibold text-foreground mb-2">
              Amortization Period
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <select
                id="amortizationYears"
                value={formData.amortizationYears}
                onChange={(e) => onChange("amortizationYears", parseInt(e.target.value, 10))}
                className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              >
                {[15, 20, 25, 30, 35].map((years) => (
                  <option key={years} value={years}>
                    {years} years
                  </option>
                ))}
              </select>
            </div>
            {currentDownPaymentPercent < 20 && formData.amortizationYears > 25 && !formData.isFirstTimeBuyer && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Notice: Insured mortgages require ≤25 years unless qualifying as a first-time buyer on new construction.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="paymentFrequency" className="block text-sm font-semibold text-foreground mb-2">
              Payment Schedule
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <select
                id="paymentFrequency"
                value={formData.paymentFrequency ?? "monthly"}
                onChange={(e) => onChange("paymentFrequency", e.target.value as PaymentFrequency)}
                className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              >
                <option value="monthly">Monthly (12/yr)</option>
                <option value="accelerated-bi-weekly">Accelerated Bi-Weekly (26/yr)</option>
                <option value="bi-weekly">Regular Bi-Weekly (26/yr)</option>
                <option value="semi-monthly">Semi-Monthly (24/yr)</option>
                <option value="accelerated-weekly">Accelerated Weekly (52/yr)</option>
                <option value="weekly">Regular Weekly (52/yr)</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Accelerated schedules make 1 extra month's payment/yr to pay off debt faster.
            </p>
          </div>
        </div>

        {/* Property Type & Heating Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-semibold text-foreground mb-2">
              Property Type
            </label>
            <select
              id="propertyType"
              value={formData.propertyType}
              onChange={(e) => onChange("propertyType", e.target.value as PropertyType)}
              className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
            >
              <option value="single-family">Single Family Home</option>
              <option value="condo">Condominium</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi-family">Multi-Family</option>
            </select>
          </div>

          <div>
            <label htmlFor="heatingType" className="block text-sm font-semibold text-foreground mb-2">
              Heating System
            </label>
            <select
              id="heatingType"
              value={formData.heatingType}
              onChange={(e) => onChange("heatingType", e.target.value as HeatingType)}
              className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
            >
              <option value="gas">Natural Gas (~$180/mo)</option>
              <option value="electric">Electric (~$120/mo)</option>
              <option value="oil">Oil (~$220/mo)</option>
              <option value="geothermal">Geothermal (~$80/mo)</option>
            </select>
          </div>
        </div>

        {/* First Time Buyer */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
          <input
            type="checkbox"
            id="firstTimeBuyer"
            checked={formData.isFirstTimeBuyer}
            onChange={(e) => onChange("isFirstTimeBuyer", e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="firstTimeBuyer" className="text-xs sm:text-sm font-medium text-foreground cursor-pointer">
            First-time home buyer (allows 30-year amortization on newly constructed Canadian homes)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 px-4 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm sm:text-base hover:bg-muted/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={onCalculate}
            disabled={loading}
            className="flex-[2] px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Calculating..." : "Calculate Mortgage"}
          </button>
        </div>
      </div>
    </div>
  );
}
