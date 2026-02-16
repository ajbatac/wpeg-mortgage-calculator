import { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, Clock, AlertTriangle, CheckCircle, Info, RotateCcw } from "lucide-react";
import type { MortgageCalculation, MortgageResult } from "../../shared/types";
import { calculateMortgage, winnipegData } from "../../shared/mortgageCalculator";

import { formatCurrency } from "@/shared/formatters";
import DonutChart from "./DonutChart";

export default function MortgageCalculator() {


  const initialFormData: MortgageCalculation = {
    propertyValue: 400000,
    downPayment: 80000,
    interestRate: 4.84,
    amortizationYears: 25,
    propertyType: "single-family",
    heatingType: "gas",
    isFirstTimeBuyer: false,
  };

  const [formData, setFormData] = useState<MortgageCalculation>(initialFormData);

  const [result, setResult] = useState<MortgageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial interest rate from Winnipeg data
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      interestRate: winnipegData.currentInterestRates.fixed5Year
    }));
  }, []);

  const handleInputChange = (field: keyof MortgageCalculation, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculateMortgage = () => {
    setLoading(true);
    setError(null);

    try {
      const result = calculateMortgage(formData);
      setResult(result);
    } catch (err) {
      setError("Failed to calculate mortgage. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      interestRate: winnipegData.currentInterestRates.fixed5Year
    });
    setResult(null);
    setError(null);
    setLoading(false);
  };



  const getAffordabilityColor = (rating: string) => {
    switch (rating) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "fair": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "poor": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getWinnipegFunFacts = (result: MortgageResult) => {
    const facts = {
      totalMonthlyCost: {
        title: "🏠 Total Monthly Housing Cost",
        amount: result.totalMonthlyCost,
        fact: `If you spent ${formatCurrency(result.totalMonthlyCost)} every month at The Forks Market, you could treat yourself to ${Math.round(result.totalMonthlyCost / 6)} daily gourmet cinnamon rolls from Cinnaholic, a bison burger, and still have enough left over for a year's worth of skating rentals on the Red River Trail—one of the world's longest naturally frozen skating trails.`
      },
      monthlyPayment: {
        title: "💳 Mortgage Payment",
        amount: result.monthlyPayment,
        fact: `${formatCurrency(result.monthlyPayment)} is about ${result.monthlyPayment < 1500 ? 'less than' : 'more than'} the cost of a round-trip flight from Winnipeg to Churchill, Manitoba for two—prime polar bear-watching territory. Or, you could buy roughly ${Math.round(result.monthlyPayment / 4)} tickets to a Winnipeg Goldeyes baseball game and invite the whole neighborhood.`
      },
      propertyTax: {
        title: "🏛️ Property Tax",
        amount: result.monthlyPropertyTax,
        fact: `${formatCurrency(result.monthlyPropertyTax)} monthly adds up to ${formatCurrency(result.monthlyPropertyTax * 12)} annually. Fun fact: Winnipeg's property tax rates are among the lowest of major Canadian cities, but the city makes up for it with a unique "frontage levy" based on the width of your lot.`
      },
      insurance: {
        title: "🛡️ Home Insurance",
        amount: result.monthlyInsurance,
        fact: `${formatCurrency(result.monthlyInsurance)} is about ${result.monthlyInsurance > 120 ? 'more than' : result.monthlyInsurance < 80 ? 'less than' : 'the same as'} what it costs to buy a premium Jets jersey at Canada Life Centre. And just like home insurance, it's a smart investment—especially if you want to protect your pride during playoff season.`
      },
      utilities: {
        title: "⚡ Utilities (Est.)",
        amount: result.monthlyUtilities,
        fact: `${formatCurrency(result.monthlyUtilities)} a month is a typical hydro bill for a Winnipeg home in winter, when the city's famous cold snaps can make your furnace work overtime. Pro tip: Manitoba Hydro's "Power Smart" program can help you cut that bill down, and the city's record for the coldest day ever? A brisk -47.8°C in 1879.`
      }
    };

    const bonusFacts = [
      `If you lined up ${formatCurrency(result.totalMonthlyCost)} in loonies from Portage & Main to The Forks, you'd cover about ${(result.totalMonthlyCost * 0.0005).toFixed(1)} kilometers—${result.totalMonthlyCost > 5000 ? 'more than' : 'almost'} the length of the city's famous river skating trail.`,
      `${formatCurrency(100)} in 1919 (the year of the Winnipeg General Strike) would be worth over $1,500 today—enough to cover your home insurance for ${Math.round(1500 / result.monthlyInsurance)} months and still have change for a box of Old Dutch chips.`,
      `Your annual mortgage payments (${formatCurrency(result.monthlyPayment * 12)}) could buy ${Math.round((result.monthlyPayment * 12) / 8)} season tickets to Jets games—though good luck getting those seats!`
    ];

    return { ...facts, bonusFacts };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          {/* Logo & Title Section */}
          <a
            href="https://portal.wpeg.app"
            className="group relative flex flex-col items-center gap-6 mb-10 transition-all duration-300 hover:opacity-95"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img
                src="/mortgage-wpeg-logo.png"
                alt="WPEG Mortgage Calculator Logo"
                className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="space-y-3 relative">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                Prairie Home Calculator
              </h1>
              <div className="flex items-center justify-center gap-3 text-lg md:text-xl font-medium text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                <span className="hidden md:block h-px w-12 bg-blue-200 dark:bg-blue-800"></span>
                <span>Winnipeg Mortgage Edition</span>
                <span className="hidden md:block h-px w-12 bg-blue-200 dark:bg-blue-800"></span>
              </div>
            </div>
          </a>

          {/* Subtitle & Description */}
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              Smart mortgage insights designed specifically for the <span className="font-semibold text-gray-900 dark:text-white decoration-blue-500/30 underline decoration-4 underline-offset-4">Winnipeg, Manitoba</span> real estate market.
            </p>

            {/* Features/Data Source Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Winnipeg Tax Rates (2.35%)", icon: "🏙️" },
                { label: "Manitoba Home Insurance", icon: "🛡️" },
                { label: "Hydro Estimates", icon: "⚡" },
                { label: "Live CAD Rates", icon: "📈" }
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default select-none">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed pt-6 border-t border-gray-100 dark:border-gray-800/50">
              Calculations include local property tax assessments, CMHC guidelines, and Manitoba-specific utility averages.
            </p>
          </div>
        </div>



        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculate Your Mortgage</h2>
            </div>

            <div className="space-y-6">
              {/* Property Value */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Property Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01] shadow-sm"
                    placeholder="400,000"
                  />
                </div>

                {/* Quick Property Value Pills */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick select (typical Winnipeg prices):</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "$275K", value: 275000, downPayment: 27500 },
                      { label: "$375K", value: 375000, downPayment: 37500 },
                      { label: "$475K", value: 475000, downPayment: 71250 },
                      { label: "$575K", value: 575000, downPayment: 86250 },
                      { label: "$675K", value: 675000, downPayment: 135000 },
                      { label: "$875K", value: 875000, downPayment: 175000 },
                      { label: "$1.1M", value: 1100000, downPayment: 220000 },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          handleInputChange('propertyValue', preset.value);
                          handleInputChange('downPayment', preset.downPayment);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${formData.propertyValue === preset.value
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400'
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) => handleInputChange('downPayment', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01] shadow-sm"
                    placeholder="80,000"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.propertyValue > 0 && (
                    `${((formData.downPayment / formData.propertyValue) * 100).toFixed(1)}% of property value`
                  )}
                </p>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01] shadow-sm"
                    placeholder="4.84"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                  <p>Current rates: 1-year {winnipegData.currentInterestRates.fixed1Year}%, 5-year {winnipegData.currentInterestRates.fixed5Year}%</p>
                </div>
              </div>

              {/* Amortization Period */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amortization Period (Years)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.amortizationYears}
                    onChange={(e) => handleInputChange('amortizationYears', parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200 focus:scale-[1.01] shadow-sm"
                  >
                    {[15, 20, 25, 30, 35].map(years => (
                      <option key={years} value={years}>{years} years</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value as any)}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Heating Type
                </label>
                <select
                  value={formData.heatingType}
                  onChange={(e) => handleInputChange('heatingType', e.target.value as any)}
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
                  onChange={(e) => handleInputChange('isFirstTimeBuyer', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="firstTimeBuyer" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  First-time home buyer
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
                <button
                  onClick={handleCalculateMortgage}
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Calculating..." : "Calculate Mortgage"}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Main Results */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your Monthly Payment</h3>

                  {/* Chart Visualization */}
                  <DonutChart data={[
                    { label: 'Mortgage', value: result.monthlyPayment, color: '#2563eb' }, // blue-600
                    { label: 'Property Tax', value: result.monthlyPropertyTax, color: '#4f46e5' }, // indigo-600
                    { label: 'Insurance', value: result.monthlyInsurance, color: '#9333ea' }, // purple-600
                    { label: 'Utilities', value: result.monthlyUtilities, color: '#db2777' }, // pink-600
                  ]} />

                  <div className="text-center mb-8">
                    <p className="text-gray-600 dark:text-gray-300">Total monthly housing cost</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mortgage Payment</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(result.monthlyPayment)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Property Tax</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(result.monthlyPropertyTax)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Home Insurance</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(result.monthlyInsurance)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Utilities (Est.)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(result.monthlyUtilities)}</p>
                    </div>
                  </div>

                  {/* Affordability Rating */}
                  <div className={`p-4 rounded-xl border-2 ${getAffordabilityColor(result.affordabilityRating)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {result.affordabilityRating === "excellent" || result.affordabilityRating === "good" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                      <span className="font-semibold capitalize">
                        {result.affordabilityRating} Affordability
                      </span>
                    </div>
                    <p className="text-sm dark:text-gray-700">
                      Based on typical debt-to-income ratios for this payment level.
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Loan Details</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Principal Amount</span>
                      <span className="font-semibold dark:text-gray-100">{formatCurrency(result.principalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                      <span className="font-semibold dark:text-gray-100">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Down Payment</span>
                      <span className="font-semibold dark:text-gray-100">{result.downPaymentPercent}%</span>
                    </div>
                    {result.cmhcInsurance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">CMHC Insurance</span>
                        <span className="font-semibold dark:text-gray-100">{formatCurrency(result.cmhcInsurance)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                      <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">Important Considerations</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-amber-700 dark:text-amber-300 text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {!result && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center h-full min-h-[600px]">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <Calculator className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-80" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Ready to Calculate?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed mb-8">
                  Enter your property details to get an instant estimate of your mortgage payments, tax, and insurance costs.
                </p>
                <div className="flex gap-2 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Winnipeg Fun Facts */}
        {result && (
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                  Winnipeg Mortgage Calculator: Local Fun Facts 🏠
                </h3>
                <p className="text-gray-600 dark:text-gray-300">See how your mortgage payments stack up against Winnipeg's unique culture and landmarks</p>
              </div>

              {(() => {
                const funFacts = getWinnipegFunFacts(result);
                const { bonusFacts, ...paymentFacts } = funFacts;
                return (
                  <div className="space-y-6">
                    {/* Main payment breakdowns */}
                    <div className="grid md:grid-cols-1 gap-6">
                      {Object.entries(paymentFacts).map(([key, factData]) => (
                        <div key={key} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{factData.title}</h4>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(factData.amount)}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{factData.fact}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bonus facts */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-indigo-100 dark:border-gray-700 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        Bonus: Winnipeg Mortgage Math 🧮
                      </h4>
                      <ul className="space-y-3">
                        {bonusFacts.map((fact, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                            <span className="text-indigo-500 dark:text-indigo-400 font-bold">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* What If Section */}
            <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-800">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                    💸 What If You Weren't Taxed? 💸
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Dreaming about what you could do with that {formatCurrency(result.monthlyPropertyTax * 12)} in annual property taxes? Let's explore!</p>
                </div>

                {(() => {
                  const annualPropertyTax = result.monthlyPropertyTax * 12;
                  const whatIfScenarios = [
                    {
                      emoji: "✈️",
                      title: "Travel the World",
                      description: `You could take ${Math.floor(annualPropertyTax / 3500)} annual trips to Europe (round-trip flights from Winnipeg), or ${Math.floor(annualPropertyTax / 1200)} trips to Vancouver to visit family. That's enough for a new adventure every ${annualPropertyTax > 7000 ? 'few months' : annualPropertyTax > 3500 ? '6 months' : 'year'}!`
                    },
                    {
                      emoji: "🍁",
                      title: "Winnipeg Jets Season Tickets",
                      description: `${formatCurrency(annualPropertyTax)} could get you ${Math.floor(annualPropertyTax / 3500)} season ticket packages for the Winnipeg Jets at Canada Life Centre. You'd be cheering "True North!" from premium seats for ${annualPropertyTax > 7000 ? 'multiple seasons' : 'a full season'} with money left over for concessions.`
                    },
                    {
                      emoji: "🏎️",
                      title: "The Ultimate Manitoba Road Trip Machine",
                      description: `That tax money could buy you a ${annualPropertyTax > 15000 ? 'brand new' : annualPropertyTax > 8000 ? 'nearly new' : 'reliable used'} vehicle every ${Math.floor(25000 / annualPropertyTax)} years. Perfect for exploring Manitoba's ${Math.floor(annualPropertyTax / 100)} provincial parks, or making ${Math.floor(annualPropertyTax / 80)} trips to Grand Beach for epic sunsets.`
                    },
                    {
                      emoji: "🍻",
                      title: "Local Brewery Enthusiast",
                      description: `You could buy ${Math.floor(annualPropertyTax / 7)} craft beers from local breweries like Half Pints, Torque, or Little Brown Jug. That's enough to sample every beer in Winnipeg ${Math.floor((annualPropertyTax / 7) / 200)} times over, or host epic backyard parties for your entire neighborhood.`
                    },
                    {
                      emoji: "🥶",
                      title: "Winter Survival Specialist",
                      description: `${formatCurrency(annualPropertyTax)} could buy you ${Math.floor(annualPropertyTax / 800)} top-tier Canada Goose parkas, ${Math.floor(annualPropertyTax / 200)} pairs of premium winter boots, and ${Math.floor(annualPropertyTax / 50)} ice fishing shelters. You'd be the warmest person in Manitoba during those -40°C blizzards.`
                    },
                    {
                      emoji: "🎭",
                      title: "Cultural Connoisseur",
                      description: `You could attend ${Math.floor(annualPropertyTax / 150)} shows at the Royal Manitoba Theatre Centre, ${Math.floor(annualPropertyTax / 80)} concerts at the Burton Cummings Theatre, or visit the Canadian Museum for Human Rights ${Math.floor(annualPropertyTax / 18)} times. That's enough culture to become Winnipeg's unofficial arts ambassador.`
                    },
                    {
                      emoji: "🥩",
                      title: "Prairie Foodie Paradise",
                      description: `That money could get you ${Math.floor(annualPropertyTax / 45)} fine dining experiences at 529 Wellington, ${Math.floor(annualPropertyTax / 12)} meals at The Keg, or ${Math.floor(annualPropertyTax / 6)} legendary Fat Boy burgers. You could eat like royalty at Winnipeg's best restaurants for ${annualPropertyTax > 5000 ? 'months' : 'weeks'}.`
                    },
                    {
                      emoji: "🏡",
                      title: "Home Improvement Mogul",
                      description: `${formatCurrency(annualPropertyTax)} could fund a ${annualPropertyTax > 10000 ? 'major kitchen renovation' : annualPropertyTax > 5000 ? 'bathroom upgrade' : 'beautiful deck'}, or you could install a ${annualPropertyTax > 15000 ? 'luxury hot tub' : 'nice pool'} to beat those scorching Manitoba summers that can hit +35°C.`
                    }
                  ];

                  return (
                    <div className="grid md:grid-cols-2 gap-6">
                      {whatIfScenarios.map((scenario, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-purple-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{scenario.emoji}</span>
                            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{scenario.title}</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scenario.description}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-pink-100 dark:border-gray-700 shadow-sm">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center justify-center gap-2">
                      <span>💭</span>
                      The Reality Check
                      <span>💭</span>
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                      While it's fun to dream about tax-free living, property taxes in Winnipeg fund essential services like snow removal
                      (crucial for those 5+ months of winter!), road maintenance, public transit, parks, libraries, and emergency services.
                      Plus, at {((result.monthlyPropertyTax * 12 / formData.propertyValue) * 100).toFixed(2)}% annually,
                      Winnipeg's property tax rate is actually quite reasonable compared to many other Canadian cities.
                      Your {formatCurrency(result.monthlyPropertyTax * 12)} helps keep the city running smoothly year-round! 🏙️
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Disclaimer */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">Important Disclaimer</h3>

            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                <strong>Not Financial Advice:</strong> This calculator provides estimates only and should not be considered as financial, legal, or tax advice.
                All calculations are for informational purposes and are not a guarantee of loan approval or final mortgage terms.
              </p>

              <p>
                <strong>Accuracy of Information:</strong> While we strive to use current Winnipeg market data, interest rates, property tax rates,
                insurance costs, and utility estimates may vary significantly based on specific properties, lenders, and individual circumstances.
                Actual costs may be higher or lower than estimated.
              </p>

              <p>
                <strong>Rate Fluctuations:</strong> Interest rates change frequently and may differ substantially from those shown.
                Mortgage rates depend on credit score, debt-to-income ratio, employment history, down payment amount, and other factors
                not considered in this calculator.
              </p>

              <p>
                <strong>Regional Specificity:</strong> This calculator is designed for Winnipeg, Manitoba properties. Tax rates, insurance costs,
                and utility estimates are based on Winnipeg averages and may not apply to other municipalities or provinces.
              </p>

              <p>
                <strong>Additional Costs:</strong> Homeownership involves additional costs not included in these calculations, such as
                legal fees, home inspection fees, moving costs, maintenance, repairs, condo fees, special assessments,
                and potential mortgage default insurance premiums that may vary.
              </p>

              <p>
                <strong>Professional Consultation Required:</strong> Before making any financial decisions, consult with qualified professionals
                including mortgage brokers, financial advisors, real estate agents, lawyers, and tax professionals who can provide
                personalized advice based on your specific situation.
              </p>

              <p>
                <strong>Limitation of Liability:</strong> Prairie Home Calculator and its creators disclaim all liability for any financial
                decisions made based on information provided by this tool. Users assume full responsibility for verifying all information
                and seeking appropriate professional advice.
              </p>

              <p className="text-center font-medium text-gray-700 dark:text-gray-300 pt-4 border-t border-gray-300 dark:border-gray-600">
                Last updated: February 16, 2026 | For educational purposes only | © 2026 Prairie Home Calculator | All rights reserved.
              </p>
              <p className="text-center font-medium text-gray-700 dark:text-gray-300 pt-4 border-t border-gray-300 dark:border-gray-600">This calculator is not intended to be used for tax planning or financial advice.
              </p>
            </div>
          </div>

        </div>
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto"><div className="max-w-4xl mx-auto"><a href="https://portal.wpeg.app"> &lt; &lt; Back to WPEG Portal</a></div></div>
        </div>
      </div>

    </div>
  );
}
