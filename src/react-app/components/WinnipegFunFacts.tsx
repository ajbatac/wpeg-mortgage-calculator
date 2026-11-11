import type { MortgageResult } from "@/shared/types";
import { formatCurrency } from "@/shared/formatters";

interface WinnipegFunFactsProps {
  result: MortgageResult;
  propertyValue: number;
}

export default function WinnipegFunFacts({ result, propertyValue }: WinnipegFunFactsProps) {
  const annualPropertyTax = result.monthlyPropertyTax * 12;

  const paymentFacts = {
    totalMonthlyCost: {
      title: "🏠 Total Monthly Housing Cost",
      amount: result.totalMonthlyCost,
      fact: `If you spent ${formatCurrency(result.totalMonthlyCost)} every month at The Forks Market, you could treat yourself to ${Math.round(result.totalMonthlyCost / 6)} daily gourmet cinnamon rolls from Cinnaholic, a bison burger, and still have enough left over for a year's worth of skating rentals on the Red River Trail—one of the world's longest naturally frozen skating trails.`,
    },
    monthlyPayment: {
      title: "💳 Mortgage Payment",
      amount: result.monthlyPayment,
      fact: `${formatCurrency(result.monthlyPayment)} is about ${result.monthlyPayment < 1500 ? "less than" : "more than"} the cost of a round-trip flight from Winnipeg to Churchill, Manitoba for two—prime polar bear-watching territory. Or, you could buy roughly ${Math.round(result.monthlyPayment / 4)} tickets to a Winnipeg Goldeyes baseball game and invite the whole neighborhood.`,
    },
    propertyTax: {
      title: "🏛️ Property Tax",
      amount: result.monthlyPropertyTax,
      fact: `${formatCurrency(result.monthlyPropertyTax)} monthly adds up to ${formatCurrency(annualPropertyTax)} annually. Fun fact: Winnipeg's property tax rates are among the lowest of major Canadian cities, but the city makes up for it with a unique "frontage levy" based on the width of your lot.`,
    },
    insurance: {
      title: "🛡️ Home Insurance",
      amount: result.monthlyInsurance,
      fact: `${formatCurrency(result.monthlyInsurance)} is about ${result.monthlyInsurance > 120 ? "more than" : result.monthlyInsurance < 80 ? "less than" : "the same as"} what it costs to buy a premium Jets jersey at Canada Life Centre. And just like home insurance, it's a smart investment—especially if you want to protect your pride during playoff season.`,
    },
    utilities: {
      title: "⚡ Utilities (Est.)",
      amount: result.monthlyUtilities,
      fact: `${formatCurrency(result.monthlyUtilities)} a month is a typical hydro bill for a Winnipeg home in winter, when the city's famous cold snaps can make your furnace work overtime. Pro tip: Manitoba Hydro's "Power Smart" program can help you cut that bill down, and the city's record for the coldest day ever? A brisk -47.8°C in 1879.`,
    },
  };

  const safeInsurance = Math.max(1, result.monthlyInsurance);
  const bonusFacts = [
    `If you lined up ${formatCurrency(result.totalMonthlyCost)} in loonies from Portage & Main to The Forks, you'd cover about ${(result.totalMonthlyCost * 0.0005).toFixed(1)} kilometers—${result.totalMonthlyCost > 5000 ? "more than" : "almost"} the length of the city's famous river skating trail.`,
    `${formatCurrency(100)} in 1919 (the year of the Winnipeg General Strike) would be worth over $1,500 today—enough to cover your home insurance for ${Math.round(1500 / safeInsurance)} months and still have change for a box of Old Dutch chips.`,
    `Your annual mortgage payments (${formatCurrency(result.monthlyPayment * 12)}) could buy ${Math.round((result.monthlyPayment * 12) / 8)} season tickets to Jets games—though good luck getting those seats!`,
  ];

  const whatIfScenarios = [
    {
      emoji: "✈️",
      title: "Travel the World",
      description: `You could take ${Math.floor(annualPropertyTax / 3500)} annual trips to Europe (round-trip flights from Winnipeg), or ${Math.floor(annualPropertyTax / 1200)} trips to Vancouver to visit family. That's enough for a new adventure every ${annualPropertyTax > 7000 ? "few months" : annualPropertyTax > 3500 ? "6 months" : "year"}!`,
    },
    {
      emoji: "🍁",
      title: "Winnipeg Jets Season Tickets",
      description: `${formatCurrency(annualPropertyTax)} could get you ${Math.floor(annualPropertyTax / 3500)} season ticket packages for the Winnipeg Jets at Canada Life Centre. You'd be cheering "True North!" from premium seats for ${annualPropertyTax > 7000 ? "multiple seasons" : "a full season"} with money left over for concessions.`,
    },
    {
      emoji: "🏎️",
      title: "The Ultimate Manitoba Road Trip Machine",
      description: `That tax money could buy you a ${annualPropertyTax > 15000 ? "brand new" : annualPropertyTax > 8000 ? "nearly new" : "reliable used"} vehicle every ${annualPropertyTax > 0 ? Math.max(1, Math.floor(25000 / annualPropertyTax)) : 10} years. Perfect for exploring Manitoba's ${Math.floor(annualPropertyTax / 100)} provincial parks, or making ${Math.floor(annualPropertyTax / 80)} trips to Grand Beach for epic sunsets.`,
    },
    {
      emoji: "🍻",
      title: "Local Brewery Enthusiast",
      description: `You could buy ${Math.floor(annualPropertyTax / 7)} craft beers from local breweries like Half Pints, Torque, or Little Brown Jug. That's enough to sample every beer in Winnipeg ${Math.floor(annualPropertyTax / 7 / 200)} times over, or host epic backyard parties for your entire neighborhood.`,
    },
    {
      emoji: "🥶",
      title: "Winter Survival Specialist",
      description: `${formatCurrency(annualPropertyTax)} could buy you ${Math.floor(annualPropertyTax / 800)} top-tier Canada Goose parkas, ${Math.floor(annualPropertyTax / 200)} pairs of premium winter boots, and ${Math.floor(annualPropertyTax / 50)} ice fishing shelters. You'd be the warmest person in Manitoba during those -40°C blizzards.`,
    },
    {
      emoji: "🎭",
      title: "Cultural Connoisseur",
      description: `You could attend ${Math.floor(annualPropertyTax / 150)} shows at the Royal Manitoba Theatre Centre, ${Math.floor(annualPropertyTax / 80)} concerts at the Burton Cummings Theatre, or visit the Canadian Museum for Human Rights ${Math.floor(annualPropertyTax / 18)} times. That's enough culture to become Winnipeg's unofficial arts ambassador.`,
    },
    {
      emoji: "🥩",
      title: "Prairie Foodie Paradise",
      description: `That money could get you ${Math.floor(annualPropertyTax / 45)} fine dining experiences at 529 Wellington, ${Math.floor(annualPropertyTax / 12)} meals at The Keg, or ${Math.floor(annualPropertyTax / 6)} legendary Fat Boy burgers. You could eat like royalty at Winnipeg's best restaurants for ${annualPropertyTax > 5000 ? "months" : "weeks"}.`,
    },
    {
      emoji: "🏡",
      title: "Home Improvement Mogul",
      description: `${formatCurrency(annualPropertyTax)} could fund a ${annualPropertyTax > 10000 ? "major kitchen renovation" : annualPropertyTax > 5000 ? "bathroom upgrade" : "beautiful deck"}, or you could install a ${annualPropertyTax > 15000 ? "luxury hot tub" : "nice pool"} to beat those scorching Manitoba summers that can hit +35°C.`,
    },
  ];

  const taxRatioText = propertyValue > 0
    ? `${((annualPropertyTax / propertyValue) * 100).toFixed(2)}%`
    : "2.35%";

  return (
    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Winnipeg Mortgage Calculator: Local Fun Facts 🏠
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            See how your mortgage payments stack up against Winnipeg's unique culture and landmarks
          </p>
        </div>

        <div className="space-y-6">
          {/* Main payment breakdowns */}
          <div className="grid md:grid-cols-1 gap-6">
            {Object.entries(paymentFacts).map(([key, factData]) => (
              <div
                key={key}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{factData.title}</h4>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(factData.amount)}
                  </span>
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
                <li
                  key={index}
                  className="text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* What If Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
              💸 What If You Weren't Taxed? 💸
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dreaming about what you could do with that {formatCurrency(annualPropertyTax)} in annual property taxes? Let's explore!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {whatIfScenarios.map((scenario, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-purple-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {scenario.emoji}
                  </span>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{scenario.title}</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scenario.description}</p>
              </div>
            ))}
          </div>

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
                Plus, at {taxRatioText} annually,
                Winnipeg's property tax rate is actually quite reasonable compared to many other Canadian cities.
                Your {formatCurrency(annualPropertyTax)} helps keep the city running smoothly year-round! 🏙️
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

