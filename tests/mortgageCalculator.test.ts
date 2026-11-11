import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateMortgage,
  calculateMinimumDownPayment,
  calculateCMHCInsurance,
  calculateMonthlyPayment,
  calculateManitobaLandTransferTax,
  getAffordabilityRating,
} from "../src/shared/mortgageCalculator.ts";
import { formatCurrency, formatPercent } from "../src/shared/formatters.ts";

test("calculateMinimumDownPayment applies Canadian statutory tiers", () => {
  assert.equal(calculateMinimumDownPayment(0), 0);
  // Up to $500k: 5%
  assert.equal(calculateMinimumDownPayment(400000), 20000);
  assert.equal(calculateMinimumDownPayment(500000), 25000);
  // $500k - $1.5M: $25k + 10% of remainder
  // e.g. $600,000: 25,000 + 10,000 = 35,000
  assert.equal(calculateMinimumDownPayment(600000), 35000);
  // $1,000,000: 25,000 + 50,000 = 75,000
  assert.equal(calculateMinimumDownPayment(1000000), 75000);
  // $1.5M or more: 20%
  assert.equal(calculateMinimumDownPayment(1500000), 300000);
  assert.equal(calculateMinimumDownPayment(2000000), 400000);
});

test("calculateManitobaLandTransferTax applies statutory sliding scale", () => {
  assert.equal(calculateManitobaLandTransferTax(0).total, 0);
  assert.equal(calculateManitobaLandTransferTax(30000).tax, 0);
  assert.equal(calculateManitobaLandTransferTax(30000).registrationFee, 70);

  // $90,000: $30k exempt, $60k @ 0.5% = $300 + $70 = $370
  const at90k = calculateManitobaLandTransferTax(90000);
  assert.equal(at90k.tax, 300);
  assert.equal(at90k.total, 370);

  // $150,000: $300 + $60k @ 1.0% ($600) = $900 + $70 = $970
  const at150k = calculateManitobaLandTransferTax(150000);
  assert.equal(at150k.tax, 900);
  assert.equal(at150k.total, 970);

  // $200,000: $900 + $50k @ 1.5% ($750) = $1,650 + $70 = $1,720
  const at200k = calculateManitobaLandTransferTax(200000);
  assert.equal(at200k.tax, 1650);
  assert.equal(at200k.total, 1720);

  // $400,000: $1,650 + $200k @ 2.0% ($4,000) = $5,650 + $70 = $5,720
  const at400k = calculateManitobaLandTransferTax(400000);
  assert.equal(at400k.tax, 5650);
  assert.equal(at400k.total, 5720);
});

test("calculateCMHCInsurance tiers and eligibility", () => {
  // 20% or more down payment: 0% CMHC
  assert.equal(calculateCMHCInsurance(400000, 80000), 0);
  // $1.5M+: Ineligible for CMHC
  assert.equal(calculateCMHCInsurance(1500000, 150000), 0);
  // 15% - 19.99%: 2.80%
  // $400k home, $60k down (15%), loan = $340k * 2.8% = $9,520
  assert.equal(calculateCMHCInsurance(400000, 60000), 9520);
  // 10% - 14.99%: 3.10%
  // $400k home, $40k down (10%), loan = $360k * 3.1% = $11,160
  assert.equal(calculateCMHCInsurance(400000, 40000), 11160);
  // 5% - 9.99%: 4.00%
  // $400k home, $20k down (5%), loan = $380k * 4.0% = $15,200
  assert.equal(calculateCMHCInsurance(400000, 20000), 15200);
  // 0 or negative property value
  assert.equal(calculateCMHCInsurance(0, 0), 0);
});

test("calculateMonthlyPayment handles standard and edge cases", () => {
  // Standard loan
  const standard = calculateMonthlyPayment(320000, 4.84, 25);
  assert.ok(standard.monthlyPayment > 1700 && standard.monthlyPayment < 1900);
  assert.ok(standard.totalInterest > 200000);

  // 0% interest rate
  const zeroInterest = calculateMonthlyPayment(300000, 0, 25);
  assert.equal(zeroInterest.monthlyPayment, 1000);
  assert.equal(zeroInterest.totalInterest, 0);

  // 0 principal
  const zeroPrincipal = calculateMonthlyPayment(0, 4.84, 25);
  assert.equal(zeroPrincipal.monthlyPayment, 0);
  assert.equal(zeroPrincipal.totalInterest, 0);
});

test("getAffordabilityRating evaluates GDS thresholds", () => {
  assert.equal(getAffordabilityRating(25), "excellent");
  assert.equal(getAffordabilityRating(28), "excellent");
  assert.equal(getAffordabilityRating(30), "good");
  assert.equal(getAffordabilityRating(32), "good");
  assert.equal(getAffordabilityRating(35), "fair");
  assert.equal(getAffordabilityRating(39), "fair");
  assert.equal(getAffordabilityRating(45), "poor");
});

test("calculateMortgage completes full end-to-end calculation correctly", () => {
  const result = calculateMortgage({
    propertyValue: 400000,
    downPayment: 80000,
    interestRate: 4.84,
    amortizationYears: 25,
    propertyType: "single-family",
    heatingType: "gas",
    isFirstTimeBuyer: false,
  });

  assert.equal(result.principalAmount, 320000);
  assert.equal(result.downPaymentPercent, 20);
  assert.equal(result.cmhcInsurance, 0);
  assert.ok(result.monthlyPayment > 0);
  assert.ok(result.monthlyPropertyTax > 0);
  assert.ok(result.monthlyInsurance > 0);
  assert.ok(result.monthlyUtilities > 0);
  assert.ok(result.totalMonthlyCost > result.monthlyPayment);
  assert.ok(Number.isFinite(result.gdsRatio));
});

test("calculateMortgage handles 100% cash down payment", () => {
  const result = calculateMortgage({
    propertyValue: 500000,
    downPayment: 500000,
    interestRate: 5.0,
    amortizationYears: 25,
    propertyType: "single-family",
    heatingType: "gas",
    isFirstTimeBuyer: false,
  });

  assert.equal(result.principalAmount, 0);
  assert.equal(result.totalLoanAmount, 0);
  assert.equal(result.monthlyPayment, 0);
  assert.equal(result.totalInterest, 0);
  assert.ok(result.warnings.some((w) => w.includes("no mortgage financing is needed")));
});

test("calculateMortgage handles down payment below statutory minimum", () => {
  const result = calculateMortgage({
    propertyValue: 400000,
    downPayment: 10000, // Only 2.5%, min is 5% ($20,000)
    interestRate: 4.84,
    amortizationYears: 25,
    propertyType: "single-family",
    heatingType: "gas",
    isFirstTimeBuyer: false,
  });

  assert.ok(result.warnings.some((w) => w.includes("below the Canadian statutory minimum")));
});

test("formatters handle values safely", () => {
  assert.equal(formatCurrency(1234), "$1,234");
  assert.equal(formatCurrency(0), "$0");
  assert.equal(formatCurrency(NaN), "$0");
  assert.equal(formatCurrency(Infinity), "$0");

  assert.equal(formatPercent(20), "20.0%");
  assert.equal(formatPercent(12.345, 2), "12.35%");
  assert.equal(formatPercent(NaN), "0%");
});

