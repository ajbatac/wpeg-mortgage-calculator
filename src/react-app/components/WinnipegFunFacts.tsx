import { MapPin, Snowflake, Flame, Shield, Landmark, Compass } from "lucide-react";
import type { MortgageResult } from "@/shared/types";
import { formatCurrency } from "@/shared/formatters";

interface WinnipegFunFactsProps {
  result: MortgageResult;
  propertyValue: number;
}

export default function WinnipegFunFacts({ result, propertyValue }: WinnipegFunFactsProps) {
  const annualPropertyTax = result.monthlyPropertyTax * 12;

  const perspectives = [
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "The Forks & Local Culture",
      fact: `Your total monthly housing cost of ${formatCurrency(result.totalMonthlyCost)} is roughly equivalent to treating yourself to ${Math.round(result.totalMonthlyCost / 6.5)} cinnamon pastries at The Forks Market, with enough left over for skate rentals on the Nestaweya River Trail—one of Canada's premier naturally frozen winter trails.`,
    },
    {
      icon: <Compass className="w-5 h-5 text-primary" />,
      title: "Winnipeg Goldeyes & Canada Life Centre",
      fact: `At ${formatCurrency(result.monthlyPayment)}/mo in principal & interest, that's roughly ${Math.round(result.monthlyPayment / 18)} general admission tickets to Shaw Park for a Winnipeg Goldeyes baseball game, or season-ticket packages to cheer on the Winnipeg Jets downtown.`,
    },
    {
      icon: <Landmark className="w-5 h-5 text-primary" />,
      title: "City Services & Snow Removal",
      fact: `Your estimated ${formatCurrency(annualPropertyTax)} in annual property taxes funds essential municipal infrastructure: 24/7 snow clearing across 3,000+ lane-kilometers of roadway, local public libraries, community spray pads, and emergency services throughout Winnipeg's 230+ neighbourhoods.`,
    },
    {
      icon: <Flame className="w-5 h-5 text-primary" />,
      title: "Manitoba Hydro & Winter Living",
      fact: `Budgeting ${formatCurrency(result.monthlyUtilities)}/month accounts for the Manitoba Hydro winter heating load. Pro tip: Manitoba Hydro's equal payment plan (EPP) smooths seasonal spikes when Winnipeg temperatures dip below -30°C.`,
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Prairie Affordability Advantage",
      fact: `With a median single-family home price in Winnipeg hovering around $400,000, your property value of ${formatCurrency(propertyValue)} remains significantly more accessible than the Canadian national average—delivering strong square-footage value and community stability.`,
    },
    {
      icon: <Snowflake className="w-5 h-5 text-primary" />,
      title: "Portage & Main Distance Math",
      fact: `If you placed your monthly mortgage payment of ${formatCurrency(result.monthlyPayment)} in Canadian two-dollar toonies end-to-end, the line would stretch roughly ${(result.monthlyPayment * 0.028).toFixed(1)} meters from the historic corner of Portage and Main.`,
    },
  ];

  return (
    <section className="mt-12 bg-card rounded-3xl border border-border p-6 sm:p-10 shadow-sm" aria-label="Local Winnipeg Perspective">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Local Winnipeg Perspective</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">
            How Your Mortgage Measures Up in Winnipeg
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto leading-relaxed">
            Real estate in the Prairie capital has its own character, from winter hydro economics to community landmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {perspectives.map((item, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-card border border-border shadow-sm">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.fact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
