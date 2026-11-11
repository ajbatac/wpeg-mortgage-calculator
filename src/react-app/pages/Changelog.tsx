import { Link } from 'react-router';
import { Rss, ArrowLeft, Sparkles, Zap, Shield, Palette, Sun, MapPin, Calculator, TrendingUp, CheckCircle2, Landmark, Sliders, BookOpen } from 'lucide-react';
import SiteHeader from '@/react-app/components/SiteHeader';
import SiteFooter from '@/react-app/components/SiteFooter';
import { APP_VERSION } from '@/shared/constants';

interface Release {
  version: string;
  date: string;
  label: string;
  labelColor: string;
  summary: string;
  highlights: { icon: React.ReactNode; title: string; description: string }[];
}

const RELEASES: Release[] = [
  {
    version: 'v1.3.0',
    date: 'November 11, 2026',
    label: 'Latest',
    labelColor: 'bg-primary text-primary-foreground',
    summary:
      'A major accuracy and transparency release adding official primary source citations, Manitoba Land Transfer Tax closing calculations, Canadian payment schedules, interactive down payment controls, and full keyboard accessibility.',
    highlights: [
      {
        icon: <BookOpen className="w-5 h-5" />,
        title: 'Official Primary Source Citations',
        description:
          'Every statutory calculation, interest formula, tax bracket, and lending policy is now verified and cited directly to primary Canadian and Manitoba government legislation, complete with official reference links.',
      },
      {
        icon: <Landmark className="w-5 h-5" />,
        title: 'Manitoba Land Transfer Tax & Cash to Close',
        description:
          "Plan ahead with complete visibility into completion day costs. The calculator now automatically computes Manitoba's graduated Land Transfer Tax sliding scale and Land Titles registration fees.",
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: 'Flexible Canadian Payment Schedules',
        description:
          'Switch seamlessly between Monthly, Semi-Monthly, Bi-Weekly, Accelerated Bi-Weekly, Weekly, and Accelerated Weekly schedules to see how paying more frequently can pay down your loan years earlier.',
      },
      {
        icon: <Sliders className="w-5 h-5" />,
        title: 'Synchronized Down Payment Slider & Tiers',
        description:
          'Fine-tune your down payment with a fluid interactive range slider or jump instantly to standard Canadian lending tiers (5%, 10%, 15%, 20%) with a single tap.',
      },
      {
        icon: <Calculator className="w-5 h-5" />,
        title: 'Household Income & Affordability Check',
        description:
          'Enter your actual annual household income to evaluate your Gross Debt Service (GDS) ratio against real Canadian lending thresholds (32%–39%).',
      },
      {
        icon: <CheckCircle2 className="w-5 h-5" />,
        title: 'WAI-ARIA Keyboard Accessibility & Contrast',
        description:
          'The entire application is now fully keyboard navigable, including full arrow-key and escape-key support for the 20+ color theme menu, screen reader live announcements, and calibrated contrast.',
      },
    ],
  },
  {
    version: 'v1.2.0',
    date: 'November 11, 2026',
    label: 'Previous',
    labelColor: 'bg-muted text-muted-foreground',
    summary:
      'A major quality-of-life update bringing a unified WPEG look and feel, smarter calculations, and a richer set of tools to help you navigate the Winnipeg housing market with confidence.',
    highlights: [
      {
        icon: <Calculator className="w-5 h-5" />,
        title: 'Accurate Canadian Mortgage Calculations',
        description:
          'Mortgage payments are now calculated using the official Canadian semi-annual compounding method — the same standard used by banks across the country. Numbers you can trust.',
      },
      {
        icon: <Palette className="w-5 h-5" />,
        title: 'Over 20 Color Themes',
        description:
          'Make the calculator your own. Choose from more than 20 handcrafted color palettes — from classic navy to warm autumn tones — all designed to meet accessibility contrast standards.',
      },
      {
        icon: <Sun className="w-5 h-5" />,
        title: 'Dark Mode & Light Mode',
        description:
          'Seamlessly toggle between dark and light mode at any time. Your preference is remembered across visits so the tool always looks the way you like it.',
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Unified WPEG Design',
        description:
          'The calculator now shares the same polished header, footer, and brand identity as other WPEG tools — a consistent, professional experience across the entire WPEG family.',
      },
      {
        icon: <MapPin className="w-5 h-5" />,
        title: 'Winnipeg-Specific Cost Estimates',
        description:
          'Get real-world context with estimated Winnipeg property tax rates, home heating costs, and home insurance — giving you a fuller picture of your true monthly housing costs.',
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: 'CMHC Insurance Guidance',
        description:
          'Automatically understand when mortgage insurance is required and how much it costs, based on your down payment and purchase price — with Canadian rules applied correctly.',
      },
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Manitoba Land Transfer Tax & Closing Costs',
        description:
          'Get a full breakdown of estimated cash needed on closing day, including Manitoba graduated Land Transfer Tax (LTT) and Land Titles registration fees.',
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: 'Flexible Payment Schedules',
        description:
          'Compare monthly, semi-monthly, bi-weekly, and accelerated bi-weekly schedules to see how paying more frequently can pay down your loan faster.',
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: 'Mortgage Affordability Rating',
        description:
          'See a plain-language affordability rating based on your gross monthly income. Understand at a glance whether a mortgage is comfortable, stretched, or beyond recommended limits.',
      },
      {
        icon: <CheckCircle2 className="w-5 h-5" />,
        title: 'Improved Reliability',
        description:
          'Under the hood, we hardened every calculation against edge cases — zero values, unusual inputs, and extreme numbers all behave correctly. The tool is more stable and dependable than ever.',
      },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'October 2026',
    label: 'Previous',
    labelColor: 'bg-muted text-muted-foreground',
    summary: 'Initial public release of the Winnipeg Mortgage Calculator — a free tool for Winnipeg home buyers.',
    highlights: [
      {
        icon: <Calculator className="w-5 h-5" />,
        title: 'Mortgage Payment Estimator',
        description:
          'Enter your purchase price, down payment, amortization period, and interest rate to get an instant monthly payment estimate.',
      },
      {
        icon: <MapPin className="w-5 h-5" />,
        title: 'Winnipeg Fun Facts',
        description:
          'Discover local housing insights and neighbourhood context alongside your mortgage results.',
      },
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">
        {/* Page header */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Calculator
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                What's New
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold font-serif tracking-tight text-foreground leading-tight">
                Changelog
              </h1>
              <p className="mt-3 text-muted-foreground text-lg max-w-xl leading-relaxed">
                Every improvement we ship to make your home-buying journey clearer, smarter, and more Winnipeg.
              </p>
            </div>

            {/* RSS Subscribe badge */}
            <a
              href="/changelog/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-orange-400/60 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:border-orange-400 transition-colors self-start sm:self-auto whitespace-nowrap"
              aria-label="Subscribe to the changelog RSS feed"
            >
              <Rss className="w-4 h-4" aria-hidden="true" />
              Subscribe to this feed
            </a>
          </div>

          {/* Current version pill */}
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Current version: {APP_VERSION}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical rule */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" aria-hidden="true" />

          <div className="space-y-16">
            {RELEASES.map((release) => (
              <article key={release.version} className="relative sm:pl-16">
                {/* Timeline dot */}
                <div
                  className="hidden sm:flex absolute left-0 top-1 w-12 h-12 rounded-full bg-card border-2 border-primary/40 items-center justify-center shadow-sm"
                  aria-hidden="true"
                >
                  <span className="text-xs font-bold text-primary">
                    {release.version.replace('v', '')}
                  </span>
                </div>

                {/* Release header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${release.labelColor}`}
                  >
                    {release.label}
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-foreground">
                    {release.version}
                  </h2>
                  <time
                    dateTime={release.date}
                    className="text-sm text-muted-foreground"
                  >
                    {release.date}
                  </time>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8 text-base max-w-2xl">
                  {release.summary}
                </p>

                {/* Feature highlights grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
                  {release.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                    >
                      <span className="shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom RSS nudge */}
        <div className="mt-20 p-6 rounded-2xl bg-card border border-border text-center">
          <Rss className="w-6 h-6 text-orange-500 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-muted-foreground mb-3">
            Get notified whenever we ship new features or improvements.
          </p>
          <a
            href="/changelog/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Rss className="w-4 h-4" aria-hidden="true" />
            Subscribe to RSS feed
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

