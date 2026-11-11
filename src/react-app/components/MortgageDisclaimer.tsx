export default function MortgageDisclaimer() {
  return (
    <section
      id="disclaimer"
      className="mt-16 bg-card border border-border rounded-3xl p-8 shadow-sm"
      aria-label="Financial and Legal Disclaimer"
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">
          Important Disclaimer
        </h3>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Not Financial Advice:</strong> This calculator provides estimates only and should not be considered as financial, legal, or tax advice.
            All calculations are for informational purposes and are not a guarantee of loan approval or final mortgage terms.
          </p>

          <p>
            <strong className="text-foreground">Accuracy of Information:</strong> While we strive to use current Winnipeg market data, interest rates, property tax rates,
            insurance costs, and utility estimates may vary significantly based on specific properties, lenders, and individual circumstances.
            Actual costs may be higher or lower than estimated.
          </p>

          <p>
            <strong className="text-foreground">Rate Fluctuations:</strong> Interest rates change frequently and may differ substantially from those shown.
            Mortgage rates depend on credit score, debt-to-income ratio, employment history, down payment amount, and other factors
            not considered in this calculator.
          </p>

          <p>
            <strong className="text-foreground">Regional Specificity:</strong> This calculator is designed for Winnipeg, Manitoba properties. Tax rates, insurance costs,
            and utility estimates are based on Winnipeg averages and may not apply to other municipalities or provinces.
          </p>

          <p>
            <strong className="text-foreground">Additional Costs:</strong> Homeownership involves additional costs not included in these calculations, such as
            legal fees, home inspection fees, moving costs, maintenance, repairs, condo fees, special assessments,
            and potential mortgage default insurance premiums that may vary.
          </p>

          <p>
            <strong className="text-foreground">Professional Consultation Required:</strong> Before making any financial decisions, consult with qualified professionals
            including mortgage brokers, financial advisors, real estate agents, lawyers, and tax professionals who can provide
            personalized advice based on your specific situation.
          </p>

          <p>
            <strong className="text-foreground">Limitation of Liability:</strong> Winnipeg Mortgage Calculator and its creators disclaim all liability for any financial
            decisions made based on information provided by this tool. Users assume full responsibility for verifying all information
            and seeking appropriate professional advice.
          </p>

          <p className="text-center font-medium text-foreground pt-4 border-t border-border">
            For educational purposes only | © 2026 WPEG.app | All rights reserved.
          </p>
          <p className="text-center font-medium text-muted-foreground pt-1">
            This calculator is not intended to be used for tax planning or financial advice.
          </p>
        </div>
      </div>
    </section>
  );
}
