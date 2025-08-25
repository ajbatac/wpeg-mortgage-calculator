import type { MortgageCalculation, MortgageResult, WinnipegPropertyData } from "./types";

// Winnipeg-specific property data
export const winnipegData: WinnipegPropertyData = {
  averagePropertyTaxRate: 2.35, // Winnipeg's average property tax rate as percentage
  averageInsuranceRate: 0.3, // Average home insurance as percentage of property value annually
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

// Calculate CMHC insurance premium based on down payment percentage
function calculateCMHCInsurance(propertyValue: number, downPayment: number): number {
  const downPaymentPercent = (downPayment / propertyValue) * 100;
  
  if (downPaymentPercent >= 20) return 0;
  
  // CMHC premium rates based on down payment percentage
  let premiumRate = 0;
  if (downPaymentPercent >= 15) premiumRate = 2.8;
  else if (downPaymentPercent >= 10) premiumRate = 3.1;
  else if (downPaymentPercent >= 5) premiumRate = 4.0;
  else premiumRate = 4.5; // Less than 5% down
  
  const mortgageAmount = propertyValue - downPayment;
  return (mortgageAmount * premiumRate) / 100;
}

// Calculate affordability rating
function getAffordabilityRating(totalMonthlyCost: number, assumedIncome: number): "excellent" | "good" | "fair" | "poor" {
  const ratio = (totalMonthlyCost / assumedIncome) * 100;
  
  if (ratio <= 28) return "excellent";
  if (ratio <= 32) return "good";
  if (ratio <= 39) return "fair";
  return "poor";
}

export function calculateMortgage(data: MortgageCalculation): MortgageResult {
  const principalAmount = data.propertyValue - data.downPayment;
  const cmhcInsurance = calculateCMHCInsurance(data.propertyValue, data.downPayment);
  const totalLoanAmount = principalAmount + cmhcInsurance;
  
  // Calculate monthly payment using standard mortgage formula
  const monthlyRate = data.interestRate / 100 / 12;
  const numPayments = data.amortizationYears * 12;
  
  const monthlyPayment = totalLoanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const totalInterest = (monthlyPayment * numPayments) - totalLoanAmount;
  
  // Winnipeg-specific costs
  const monthlyPropertyTax = (data.propertyValue * winnipegData.averagePropertyTaxRate / 100) / 12;
  const monthlyInsurance = (data.propertyValue * winnipegData.averageInsuranceRate / 100) / 12;
  const monthlyUtilities = winnipegData.utilityEstimates[data.heatingType];
  
  const totalMonthlyCost = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyUtilities;
  const downPaymentPercent = (data.downPayment / data.propertyValue) * 100;
  
  // Generate warnings
  const warnings: string[] = [];
  if (downPaymentPercent < 20) {
    warnings.push("Down payment less than 20% requires CMHC insurance");
  }
  if (downPaymentPercent < 5) {
    warnings.push("Down payment less than 5% may not be accepted by all lenders");
  }
  if (data.interestRate > winnipegData.currentInterestRates.fixed5Year + 1) {
    warnings.push("Interest rate appears higher than current market rates");
  }
  
  // Assume household income for affordability (this could be an input in a more advanced version)
  const assumedMonthlyIncome = totalMonthlyCost / 0.32; // Assume they're at 32% ratio
  const affordabilityRating = getAffordabilityRating(totalMonthlyCost, assumedMonthlyIncome);
  
  const result: MortgageResult = {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    principalAmount: Math.round(principalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    monthlyUtilities: Math.round(monthlyUtilities * 100) / 100,
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
    downPaymentPercent: Math.round(downPaymentPercent * 100) / 100,
    cmhcInsurance: Math.round(cmhcInsurance * 100) / 100,
    affordabilityRating,
    warnings,
  };
  
  return result;
}
