import z from "zod";

export const MortgageCalculationSchema = z.object({
  propertyValue: z.number().min(1, "Property value must be greater than 0"),
  downPayment: z.number().min(0, "Down payment cannot be negative"),
  interestRate: z.number().min(0.1).max(20, "Interest rate must be between 0.1% and 20%"),
  amortizationYears: z.number().int().min(1).max(35, "Amortization must be between 1 and 35 years"),
  propertyType: z.enum(["single-family", "condo", "townhouse", "multi-family"]),
  heatingType: z.enum(["gas", "electric", "oil", "geothermal"]),
  isFirstTimeBuyer: z.boolean(),
});

export type MortgageCalculation = z.infer<typeof MortgageCalculationSchema>;

export const MortgageResultSchema = z.object({
  monthlyPayment: z.number(),
  principalAmount: z.number(),
  totalInterest: z.number(),
  monthlyPropertyTax: z.number(),
  monthlyInsurance: z.number(),
  monthlyUtilities: z.number(),
  totalMonthlyCost: z.number(),
  downPaymentPercent: z.number(),
  cmhcInsurance: z.number(),
  affordabilityRating: z.enum(["excellent", "good", "fair", "poor"]),
  warnings: z.array(z.string()),
});

export type MortgageResult = z.infer<typeof MortgageResultSchema>;

export const WinnipegPropertyDataSchema = z.object({
  averagePropertyTaxRate: z.number(),
  averageInsuranceRate: z.number(),
  currentInterestRates: z.object({
    fixed1Year: z.number(),
    fixed5Year: z.number(),
    variable: z.number(),
  }),
  utilityEstimates: z.object({
    gas: z.number(),
    electric: z.number(),
    oil: z.number(),
    geothermal: z.number(),
  }),
});

export type WinnipegPropertyData = z.infer<typeof WinnipegPropertyDataSchema>;

export type Env = Record<string, unknown>;
