import { useState, useEffect, useCallback } from "react";
import { Calculator, AlertTriangle } from "lucide-react";
import type { MortgageCalculation, MortgageResult } from "@/shared/types";
import { calculateMortgage, winnipegData } from "@/shared/mortgageCalculator";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import MortgageForm from "./MortgageForm";
import MortgageBreakdown from "./MortgageBreakdown";
import MortgageWarnings from "./MortgageWarnings";
import WinnipegFunFacts from "./WinnipegFunFacts";
import MortgageDisclaimer from "./MortgageDisclaimer";

const INITIAL_FORM_DATA: MortgageCalculation = {
  propertyValue: 400000,
  downPayment: 80000,
  interestRate: 4.84,
  amortizationYears: 25,
  propertyType: "single-family",
  heatingType: "gas",
  isFirstTimeBuyer: false,
};

export default function MortgageCalculator() {
  const [formData, setFormData] = useState<MortgageCalculation>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with Winnipeg's current 5-year fixed benchmark rate
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      interestRate: winnipegData.currentInterestRates.fixed5Year,
    }));
  }, []);

  const handleInputChange = useCallback(
    <K extends keyof MortgageCalculation>(field: K, value: MortgageCalculation[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleCalculateMortgage = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      if (formData.propertyValue <= 0) {
        setError("Please enter a property value greater than 0.");
        setResult(null);
        return;
      }

      const calculationResult = calculateMortgage(formData);
      setResult(calculationResult);
    } catch {
      setError("Failed to calculate mortgage. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleReset = useCallback(() => {
    setFormData({
      ...INITIAL_FORM_DATA,
      interestRate: winnipegData.currentInterestRates.fixed5Year,
    });
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Unified Header matching salary.wpeg.app */}
      <SiteHeader />

      <div className="flex-1 max-w-[96rem] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            <span>Winnipeg Real Estate Edition · 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground mb-4 leading-tight">
            Prairie Home Mortgage Insights
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Accurate mortgage estimates tailored for Winnipeg, Manitoba, incorporating local 2.35% property tax rates, Manitoba Hydro heating averages, and CMHC mortgage rules.
          </p>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { label: "Winnipeg Tax: 2.35%", icon: "🏙️" },
              { label: "Manitoba Insurance (0.3%)", icon: "🛡️" },
              { label: "Manitoba Hydro Estimates", icon: "⚡" },
              { label: "CMHC Default Rules", icon: "🍁" },
            ].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-card border border-border text-muted-foreground shadow-sm"
              >
                <span role="img" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Calculator Grid */}
        <main id="main-content" className="grid lg:grid-cols-2 gap-8 scroll-mt-24">
          <div className="space-y-4">
            <MortgageForm
              formData={formData}
              onChange={handleInputChange}
              onCalculate={handleCalculateMortgage}
              onReset={handleReset}
              loading={loading}
            />

            {error && (
              <div
                className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400"
                role="alert"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Results Side */}
          <div id="results" className="space-y-6">
            {result ? (
              <>
                <MortgageBreakdown result={result} />
                <MortgageWarnings warnings={result.warnings} />
              </>
            ) : (
              <div className="bg-card rounded-3xl shadow-sm border border-border p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Calculator className="w-10 h-10 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-foreground mb-3">
                  Ready to Calculate?
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed mb-8">
                  Enter your property value and down payment to see your estimated monthly mortgage, tax, and utility breakdown.
                </p>
                <div className="flex gap-2 opacity-30" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Winnipeg Fun Facts & What If */}
        {result && (
          <WinnipegFunFacts result={result} propertyValue={formData.propertyValue} />
        )}

        {/* Financial & Legal Disclaimer */}
        <MortgageDisclaimer />
      </div>

      {/* Unified Footer matching salary.wpeg.app */}
      <SiteFooter />
    </div>
  );
}
