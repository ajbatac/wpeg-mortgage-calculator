import type { MortgageCalculation, MortgageResult, WinnipegPropertyData } from "./types.ts";
import { formatCurrency } from "./formatters.ts";

// Winnipeg-specific property and benchmark data
export const winnipegData: WinnipegPropertyData = {
  averagePropertyTaxRate: 2.35, // Nominal municipal/school mill rate (~23.5 mills)
  effectivePropertyTaxRate: 1.25, // Effective net residential rate on market value (accounting for Manitoba 45% portioning)
  averageInsuranceRate: 0.3, // Average home insurance as percentage of property value annually
  benchmarkHouseholdIncome: 85000, // Median Winnipeg annual household income in CAD
  currentInterestRates: {
    fixed1Year: 5.24,
    fixed5Year: 4.84,
    variable: 5.95,
  },
  utilityEstimates: {
    gas: 180, // Monthly average for gas heating in Winnipeg
    electric: 120, // Monthly average for electric heating
    oil: 220, // Monthly average for oil heating
    geothermal: 80, // Monthly average for geothermal
  },
};

/**
 * Calculates Manitoba Land Transfer Tax (LTT) plus standard registration fee.
 * Manitoba statutory sliding scale:
 * - $0 to $30,000: 0%
 * - $30,001 to $90,000: 0.5% (max $300)
 * - $90,001 to $150,000: 1.0% (max $600)
 * - $150,001 to $200,000: 1.5% (max $750)
 * - Over $200,000: 2.0%
 * - Standard Manitoba Land Titles registration fee: $70
 */
export function calculateManitobaLandTransferTax(propertyValue: number): {
  tax: number;
  registrationFee: number;
  total: number;
} {
  if (propertyValue <= 0) {
    return { tax: 0, registrationFee: 0, total: 0 };
  }
  if (propertyValue <= 30000) {
    return { tax: 0, registrationFee: 70, total: 70 };
  }

  let tax = 0;

  // $30,001 - $90,000: 0.5% (max $300)
  if (propertyValue > 30000) {
    const tier1 = Math.min(propertyValue - 30000, 60000);
    tax += tier1 * 0.005;
  }
  // $90,001 - $150,000: 1.0% (max $600)
  if (propertyValue > 90000) {
    const tier2 = Math.min(propertyValue - 90000, 60000);
    tax += tier2 * 0.01;
  }
  // $150,001 - $200,000: 1.5% (max $750)
  if (propertyValue > 150000) {
    const tier3 = Math.min(propertyValue - 150000, 50000);
    tax += tier3 * 0.015;
  }
  // Over $200,000: 2.0%
  if (propertyValue > 200000) {
    const tier4 = propertyValue - 200000;
    tax += tier4 * 0.02;
  }

  const registrationFee = 70;
  const roundedTax = Math.round(tax * 100) / 100;
  return {
    tax: roundedTax,
    registrationFee,
    total: Math.round((roundedTax + registrationFee) * 100) / 100,
  };
}

/**
 * Calculates the statutory minimum down payment required in Canada:
 * - 5% on purchase price up to $500,000
 * - 10% on the portion between $500,000 and $1,499,999
 * - 20% on properties $1,500,000 or greater
 */
export function calculateMinimumDownPayment(propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  if (propertyValue <= 500000) {
    return propertyValue * 0.05;
  }
  if (propertyValue < 1500000) {
    return 25000 + (propertyValue - 500000) * 0.10;
  }
  return propertyValue * 0.20;
}

/**
 * Calculates CMHC (Canada Mortgage and Housing Corporation) insurance premium:
 * - Ineligible if property value is $1,500,000 or more
 * - 0% premium if down payment is 20% or more
 * - 2.80% if down payment is 15% - 19.99%
 * - 3.10% if down payment is 10% - 14.99%
 * - 4.00% if down payment is 5% - 9.99%
 * - 4.50% if under 5%
 */
export function calculateCMHCInsurance(propertyValue: number, downPayment: number): number {
  if (propertyValue <= 0 || downPayment >= propertyValue) return 0;
  if (propertyValue >= 1500000) return 0; // Uninsurable by CMHC

  const downPaymentPercent = (downPayment / propertyValue) * 100;
  if (downPaymentPercent >= 20) return 0;

  let premiumRate = 4.5;
  if (downPaymentPercent >= 15) {
    premiumRate = 2.8;
  } else if (downPaymentPercent >= 10) {
    premiumRate = 3.1;
  } else if (downPaymentPercent >= 5) {
    premiumRate = 4.0;
  }

  const mortgageAmount = Math.max(0, propertyValue - downPayment);
  return Math.round(((mortgageAmount * premiumRate) / 100) * 100) / 100;
}

/**
 * Determines Gross Debt Service (GDS) affordability rating based on CMHC guidelines:
 * - <= 28%: Excellent
 * - <= 32%: Good (Canadian lending standard ceiling)
 * - <= 39%: Fair (maximum allowable with exceptional credit)
 * - > 39%: Poor (exceeds lending thresholds)
 */
export function getAffordabilityRating(gdsRatio: number): "excellent" | "good" | "fair" | "poor" {
  if (!Number.isFinite(gdsRatio) || gdsRatio <= 28) return "excellent";
  if (gdsRatio <= 32) return "good";
  if (gdsRatio <= 39) return "fair";
  return "poor";
}

/**
 * Computes monthly mortgage payment using Canadian semi-annual compounding:
 * Canadian law (Interest Act) requires semi-annual compounding for fixed mortgage rates.
 * Effective monthly rate i = (1 + r / 2)^(1/6) - 1
 */
export function calculateMonthlyPayment(
  principal: number,
  annualInterestRatePercent: number,
  amortizationYears: number
): { monthlyPayment: number; totalInterest: number } {
  if (principal <= 0 || amortizationYears <= 0) {
    return { monthlyPayment: 0, totalInterest: 0 };
  }

  const totalPayments = Math.max(1, amortizationYears * 12);

  if (annualInterestRatePercent <= 0) {
    const monthlyPayment = principal / totalPayments;
    return { monthlyPayment, totalInterest: 0 };
  }

  const nominalAnnualRate = annualInterestRatePercent / 100;
  // Canadian semi-annual compounding formula
  const monthlyRate = Math.pow(1 + nominalAnnualRate / 2, 1 / 6) - 1;

  const factor = Math.pow(1 + monthlyRate, totalPayments);
  const monthlyPayment = (principal * (monthlyRate * factor)) / (factor - 1);
  const totalInterest = Math.max(0, monthlyPayment * totalPayments - principal);

  return { monthlyPayment, totalInterest };
}

export function calculateMortgage(data: MortgageCalculation): MortgageResult {
  const propertyValue = Math.max(0, data.propertyValue);
  const downPayment = Math.max(0, Math.min(data.downPayment, propertyValue));

  const rawPrincipal = Math.max(0, propertyValue - downPayment);
  const cmhcInsurance = calculateCMHCInsurance(propertyValue, downPayment);
  const totalLoanAmount = rawPrincipal + cmhcInsurance;

  const { monthlyPayment, totalInterest } = calculateMonthlyPayment(
    totalLoanAmount,
    data.interestRate,
    data.amortizationYears
  );

  // Payment frequency calculation (Canadian mortgage options)
  const frequency = data.paymentFrequency ?? "monthly";
  let paymentAmount = monthlyPayment;
  let paymentsPerYear = 12;

  switch (frequency) {
    case "semi-monthly":
      paymentAmount = monthlyPayment / 2;
      paymentsPerYear = 24;
      break;
    case "bi-weekly":
      paymentAmount = (monthlyPayment * 12) / 26;
      paymentsPerYear = 26;
      break;
    case "accelerated-bi-weekly":
      paymentAmount = monthlyPayment / 2;
      paymentsPerYear = 26;
      break;
    case "weekly":
      paymentAmount = (monthlyPayment * 12) / 52;
      paymentsPerYear = 52;
      break;
    case "accelerated-weekly":
      paymentAmount = monthlyPayment / 4;
      paymentsPerYear = 52;
      break;
    case "monthly":
    default:
      paymentAmount = monthlyPayment;
      paymentsPerYear = 12;
      break;
  }

  // Winnipeg-specific costs
  const monthlyPropertyTax = propertyValue > 0
    ? (propertyValue * (winnipegData.effectivePropertyTaxRate / 100)) / 12
    : 0;

  const monthlyInsurance = propertyValue > 0
    ? (propertyValue * (winnipegData.averageInsuranceRate / 100)) / 12
    : 0;

  const monthlyUtilities = winnipegData.utilityEstimates[data.heatingType] ?? winnipegData.utilityEstimates.gas;

  const totalMonthlyCost = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyUtilities;

  const downPaymentPercent = propertyValue > 0 ? (downPayment / propertyValue) * 100 : 0;
  const minimumDownPayment = calculateMinimumDownPayment(propertyValue);

  // Household income & Canadian statutory GDS ratio calculation (PITH / Gross Monthly Income)
  // PITH = Principal & Interest + Property Taxes + Heating. (Home insurance is excluded from underwriting GDS).
  const annualIncome = data.annualIncome && data.annualIncome > 0
    ? data.annualIncome
    : winnipegData.benchmarkHouseholdIncome;
  const monthlyIncome = Math.max(1, annualIncome / 12);
  const monthlyPITH = monthlyPayment + monthlyPropertyTax + monthlyUtilities;
  const gdsRatio = (monthlyPITH / monthlyIncome) * 100;
  const affordabilityRating = getAffordabilityRating(gdsRatio);

  // Manitoba Land Transfer Tax & upfront cash calculation
  const ltt = calculateManitobaLandTransferTax(propertyValue);
  const closingCostsTotal = ltt.total + downPayment;

  // Compliance warnings
  const warnings: string[] = [];

  if (propertyValue > 0 && downPayment < minimumDownPayment) {
    warnings.push(
      `Down payment is below the Canadian statutory minimum of ${formatCurrency(minimumDownPayment)}.`
    );
  }

  if (downPaymentPercent < 20 && propertyValue > 0 && propertyValue < 1500000) {
    warnings.push("Down payment under 20% requires CMHC mortgage default insurance.");
  }

  if (propertyValue >= 1500000 && downPaymentPercent < 20) {
    warnings.push(
      "Homes priced at $1.5M or above in Canada are ineligible for mortgage default insurance and require at least 20% down payment."
    );
  }

  if (downPaymentPercent < 20 && data.amortizationYears > 25 && !data.isFirstTimeBuyer) {
    warnings.push(
      "Insured mortgages are restricted to a 25-year maximum amortization unless you qualify as a first-time homebuyer."
    );
  }

  if (data.interestRate > winnipegData.currentInterestRates.fixed5Year + 1.5) {
    warnings.push(
      `Interest rate (${data.interestRate}%) is higher than Winnipeg benchmark 5-year fixed rate (${winnipegData.currentInterestRates.fixed5Year}%).`
    );
  }

  if (propertyValue > 0 && downPayment >= propertyValue) {
    warnings.push("Down payment equals or exceeds property value; no mortgage financing is needed.");
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    paymentAmount: Math.round(paymentAmount * 100) / 100,
    paymentFrequency: frequency,
    paymentsPerYear,
    principalAmount: Math.round(rawPrincipal * 100) / 100,
    totalLoanAmount: Math.round(totalLoanAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    monthlyUtilities: Math.round(monthlyUtilities * 100) / 100,
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
    downPaymentPercent: Math.round(downPaymentPercent * 100) / 100,
    minimumDownPayment: Math.round(minimumDownPayment * 100) / 100,
    cmhcInsurance: Math.round(cmhcInsurance * 100) / 100,
    landTransferTax: ltt.total,
    landTransferTaxOnly: ltt.tax,
    closingCostsTotal: Math.round(closingCostsTotal * 100) / 100,
    gdsRatio: Math.round(gdsRatio * 10) / 10,
    affordabilityRating,
    warnings,
  };
}
