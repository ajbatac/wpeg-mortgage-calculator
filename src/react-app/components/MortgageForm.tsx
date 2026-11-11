import { Calculator, DollarSign, Percent, Clock, RotateCcw } from "lucide-react";
import type { MortgageCalculation, PropertyType, HeatingType } from "@/shared/types";
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

export default function MortgageForm({
  formData,
  onChange,
  onCalculate,
  onReset,
  loading,
}: MortgageFormProps) {
  const downPaymentPercent = formData.propertyValue > 0
    ? ((formData.downPayment / formData.propertyValue) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="w-6 h-6 text-blue-600" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Calculate Your Mortgage
        </h2>
      </div>

      <div className="space-y-6">
        {/* Property Value */}
        <div>
          <label htmlFor="propertyValue" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Property Value
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="propertyValue"
              type="number"
              min="0"
              value={formData.propertyValue === 0 ? "" : formData.propertyValue}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onChange("propertyValue", val);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01] shadow-sm"
              placeholder="400,000"
            />
          </div>

          {/* Quick Property Value Pills */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Quick select (typical Winnipeg prices):
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    onChange("propertyValue", preset.value);
                    onChange("downPayment", preset.downPayment);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    formData.propertyValue === preset.value
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label htmlFor="downPayment" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Down Payment
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="downPayment"
              type="number"
              min="0"
              value={formData.downPayment === 0 ? "" : formData.downPayment}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                onChange("downPayment", val);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01] shadow-sm"
              placeholder="80,000"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {downPaymentPercent}% of property value
          </p>
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Interest Rate (%)
          </label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01] shadow-sm"
              placeholder="4.84"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
            <p>
              Current Winnipeg rates: 1-year {winnipegData.currentInterestRates.fixed1Year}%, 5-year {winnipegData.currentInterestRates.fixed5Year}%
            </p>
          </div>
        </div>

        {/* Amortization Period */}
        <div>
          <label htmlFor="amortizationYears" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Amortization Period (Years)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <select
              id="amortizationYears"
              value={formData.amortizationYears}
              onChange={(e) => onChange("amortizationYears", parseInt(e.target.value, 10))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200 focus:scale-[1.01] shadow-sm"
            >
              {[15, 20, 25, 30, 35].map((years) => (
                <option key={years} value={years}>
                  {years} years
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Property Type
          </label>
          <select
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => onChange("propertyType", e.target.value as PropertyType)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200 focus:scale-[1.01] shadow-sm"
          >
            <option value="single-family">Single Family Home</option>
            <option value="condo">Condominium</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi-family">Multi-Family</option>
          </select>
        </div>

        {/* Heating Type */}
        <div>
          <label htmlFor="heatingType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Heating Type
          </label>
          <select
            id="heatingType"
            value={formData.heatingType}
            onChange={(e) => onChange("heatingType", e.target.value as HeatingType)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200 focus:scale-[1.01] shadow-sm"
          >
            <option value="gas">Natural Gas</option>
            <option value="electric">Electric</option>
            <option value="oil">Oil</option>
            <option value="geothermal">Geothermal</option>
          </select>
        </div>

        {/* First Time Buyer */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="firstTimeBuyer"
            checked={formData.isFirstTimeBuyer}
            onChange={(e) => onChange("isFirstTimeBuyer", e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="firstTimeBuyer" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
            First-time home buyer (allows 30-yr amortization on qualifying purchases)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={onCalculate}
            disabled={loading}
            className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Calculating..." : "Calculate Mortgage"}
          </button>
        </div>
      </div>
    </div>
  );
}
