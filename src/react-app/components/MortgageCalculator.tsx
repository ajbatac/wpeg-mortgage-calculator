import { useState, useEffect } from "react";
import { Calculator, Home, DollarSign, Percent, Clock, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { MortgageCalculation, MortgageResult, WinnipegPropertyData } from "../../shared/types";

export default function MortgageCalculator() {
  const [formData, setFormData] = useState<MortgageCalculation>({
    propertyValue: 400000,
    downPayment: 80000,
    interestRate: 4.84,
    amortizationYears: 25,
    propertyType: "single-family",
    heatingType: "gas",
    isFirstTimeBuyer: false,
  });
  
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [winnipegData, setWinnipegData] = useState<WinnipegPropertyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Winnipeg market data on component mount
  useEffect(() => {
    fetch("/api/winnipeg-data")
      .then(res => res.json())
      .then((data: WinnipegPropertyData) => {
        setWinnipegData(data);
        setFormData(prev => ({
          ...prev,
          interestRate: data.currentInterestRates.fixed5Year
        }));
      })
      .catch(() => {
        setError("Failed to load current market data");
      });
  }, []);

  const handleInputChange = (field: keyof MortgageCalculation, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMortgage = async () => {
    console.log("Calculating mortgage...");
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/calculate-mortgage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || "Calculation failed");
      }
      
      const result: MortgageResult = responseData;
      setResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
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
        title: "Total Monthly Housing Cost",
        amount: result.totalMonthlyCost,
        fact: `If you spent ${formatCurrency(result.totalMonthlyCost)} every month at The Forks Market, you could treat yourself to ${Math.round(result.totalMonthlyCost / 6)} daily gourmet cinnamon rolls from Cinnaholic, a bison burger, and still have enough left over for a year's worth of skating rentals on the Red River Trail—one of the world's longest naturally frozen skating trails.`
      },
      monthlyPayment: {
        title: "Mortgage Payment",
        amount: result.monthlyPayment,
        fact: `${formatCurrency(result.monthlyPayment)} is about ${result.monthlyPayment < 1500 ? 'less than' : 'more than'} the cost of a round-trip flight from Winnipeg to Churchill, Manitoba for two—prime polar bear-watching territory. Or, you could buy roughly ${Math.round(result.monthlyPayment / 4)} tickets to a Winnipeg Goldeyes baseball game and invite the whole neighborhood.`
      },
      propertyTax: {
        title: "Property Tax",
        amount: result.monthlyPropertyTax,
        fact: `${formatCurrency(result.monthlyPropertyTax)} monthly adds up to ${formatCurrency(result.monthlyPropertyTax * 12)} annually. Fun fact: Winnipeg's property tax rates are among the lowest of major Canadian cities, but the city makes up for it with a unique "frontage levy" based on the width of your lot.`
      },
      insurance: {
        title: "Home Insurance",
        amount: result.monthlyInsurance,
        fact: `${formatCurrency(result.monthlyInsurance)} is about ${result.monthlyInsurance > 120 ? 'more than' : result.monthlyInsurance < 80 ? 'less than' : 'the same as'} what it costs to buy a premium Jets jersey at Canada Life Centre. And just like home insurance, it's a smart investment—especially if you want to protect your pride during playoff season.`
      },
      utilities: {
        title: "Utilities (Est.)",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <a href="https://portal.wpeg.ca" title="WPEG" target="_blank" rel="noopener noreferrer" className="hover:underline">WPEG: Prairie Home Calculator</a>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Smart mortgage calculator designed for Winnipeg real estate market conditions
          </p>
          
          {/* Data Sources Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-sm text-gray-500 leading-relaxed">
              <strong>Based on:</strong> Current Winnipeg property tax rates (2.35% average), Manitoba home insurance estimates (0.3% of property value annually), 
              real-time Canadian mortgage rates, and local utility costs based on heating type. Property tax calculations use City of Winnipeg assessment data, 
              while utility estimates reflect Manitoba Hydro rates and typical consumption patterns for Winnipeg homes. CMHC insurance calculations follow 
              current federal guidelines. All data is updated regularly to reflect current market conditions.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Calculate Your Mortgage</h2>
            </div>

            <div className="space-y-6">
              {/* Property Value */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="400,000"
                  />
                </div>
                
                {/* Quick Property Value Pills */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Quick select (typical Winnipeg prices):</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "$250K", value: 250000, downPayment: 25000 },
                      { label: "$350K", value: 350000, downPayment: 35000 },
                      { label: "$450K", value: 450000, downPayment: 67500 },
                      { label: "$550K", value: 550000, downPayment: 82500 },
                      { label: "$650K", value: 650000, downPayment: 130000 },
                      { label: "$850K", value: 850000, downPayment: 170000 },
                      { label: "$1M", value: 1000000, downPayment: 200000 },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          handleInputChange('propertyValue', preset.value);
                          handleInputChange('downPayment', preset.downPayment);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                          formData.propertyValue === preset.value
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="80,000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4.84"
                  />
                </div>
                {winnipegData && (
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <p>Current rates: 1-year {winnipegData.currentInterestRates.fixed1Year}%, 5-year {winnipegData.currentInterestRates.fixed5Year}%</p>
                  </div>
                )}
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
                  onChange={(e) => handleInputChange('propertyType', e.target.value as string)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
                  onChange={(e) => handleInputChange('heatingType', e.target.value as string)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
                <label htmlFor="firstTimeBuyer" className="text-sm font-semibold text-gray-700">
                  First-time home buyer
                </label>
              </div>

              <button
                onClick={calculateMortgage}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Calculating..." : "Calculate Mortgage"}
              </button>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
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
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Monthly Payment</h3>
                  
                  <div className="text-center mb-8">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      {formatCurrency(result.totalMonthlyCost)}
                    </div>
                    <p className="text-gray-600">Total monthly housing cost</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Mortgage Payment</p>
                      <p className="text-xl font-bold text-gray-800">{formatCurrency(result.monthlyPayment)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Property Tax</p>
                      <p className="text-xl font-bold text-gray-800">{formatCurrency(result.monthlyPropertyTax)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Home Insurance</p>
                      <p className="text-xl font-bold text-gray-800">{formatCurrency(result.monthlyInsurance)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Utilities (Est.)</p>
                      <p className="text-xl font-bold text-gray-800">{formatCurrency(result.monthlyUtilities)}</p>
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
                    <p className="text-sm">
                      Based on typical debt-to-income ratios for this payment level.
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Loan Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal Amount</span>
                      <span className="font-semibold">{formatCurrency(result.principalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-semibold">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Down Payment</span>
                      <span className="font-semibold">{result.downPaymentPercent}%</span>
                    </div>
                    {result.cmhcInsurance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">CMHC Insurance</span>
                        <span className="font-semibold">{formatCurrency(result.cmhcInsurance)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h3 className="text-lg font-bold text-amber-800">Important Considerations</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-amber-700 text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Winnipeg Fun Facts */}
        {result && (
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Winnipeg Mortgage Calculator: Local Fun Facts 🏠
                </h3>
                <p className="text-gray-600">See how your mortgage payments stack up against Winnipeg's unique culture and landmarks</p>
              </div>
              
              {(() => {
                const funFacts = getWinnipegFunFacts(result);
                const { bonusFacts, ...paymentFacts } = funFacts;
                return (
                  <div className="space-y-6">
                    {/* Main payment breakdowns */}
                    <div className="grid md:grid-cols-1 gap-6">
                      {Object.entries(paymentFacts).map(([key, factData]) => (
                        <div key={key} className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-gray-800">{factData.title}</h4>
                            <span className="text-xl font-bold text-blue-600">{formatCurrency(factData.amount)}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{factData.fact}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bonus facts */}
                    <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Bonus: Winnipeg Mortgage Math 🧮
                      </h4>
                      <ul className="space-y-3">
                        {bonusFacts.map((fact, index) => (
                          <li key={index} className="text-gray-600 leading-relaxed flex items-start gap-2">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Comprehensive Disclaimer */}
        <div className="mt-16 bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Important Disclaimer</h3>
            
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
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
              
              <p className="text-center font-medium text-gray-700 pt-4 border-t border-gray-300">
                Last updated: August 2025 | For educational purposes only
              </p>
            </div>
          </div>

        <div className="mt-16 bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <div className="max-w-4xl mx-auto"><a href="https://portal.wpeg.ca" title="WPEG" target="_blank" rel="noopener noreferrer" className="hover:underline">&laquo; &laquo; Back to WPEG</a></div>
        </div>

        </div>
      </div>
    </div>
  );
}
