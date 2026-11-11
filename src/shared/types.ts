import z from "zod";

export const PROPERTY_TYPES = ["single-family", "condo", "townhouse", "multi-family"] as const;
export const PropertyTypeSchema = z.enum(PROPERTY_TYPES);
export type PropertyType = z.infer<typeof PropertyTypeSchema>;

export const HEATING_TYPES = ["gas", "electric", "oil", "geothermal"] as const;
export const HeatingTypeSchema = z.enum(HEATING_TYPES);
export type HeatingType = z.infer<typeof HeatingTypeSchema>;

export const MortgageCalculationSchema = z.object({
  propertyValue: z.number().min(0, "Property value cannot be negative"),
  downPayment: z.number().min(0, "Down payment cannot be negative"),
  interestRate: z.number().min(0).max(25, "Interest rate must be between 0% and 25%"),
  amortizationYears: z.number().int().min(1).max(35, "Amortization must be between 1 and 35 years"),
  propertyType: PropertyTypeSchema,
  heatingType: HeatingTypeSchema,
  isFirstTimeBuyer: z.boolean(),
  annualIncome: z.number().min(0).optional(),
});

export type MortgageCalculation = z.infer<typeof MortgageCalculationSchema>;

export const MortgageResultSchema = z.object({
  monthlyPayment: z.number(),
  principalAmount: z.number(),
  totalLoanAmount: z.number(),
  totalInterest: z.number(),
  monthlyPropertyTax: z.number(),
  monthlyInsurance: z.number(),
  monthlyUtilities: z.number(),
  totalMonthlyCost: z.number(),
  downPaymentPercent: z.number(),
  minimumDownPayment: z.number(),
  cmhcInsurance: z.number(),
  gdsRatio: z.number(),
  affordabilityRating: z.enum(["excellent", "good", "fair", "poor"]),
  warnings: z.array(z.string()),
});

export type MortgageResult = z.infer<typeof MortgageResultSchema>;

export const WinnipegPropertyDataSchema = z.object({
  averagePropertyTaxRate: z.number(),
  averageInsuranceRate: z.number(),
  benchmarkHouseholdIncome: z.number(),
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
