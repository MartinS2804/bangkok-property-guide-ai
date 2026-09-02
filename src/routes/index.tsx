import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia · Bangkok Real Estate Advisory for Foreign Investors" },
      {
        name: "description",
        content:
          "Aurelia is an AI investment advisor for foreigners buying Thai real estate — regulation-first guidance on condo quotas, yields, taxes and the FET form.",
      },
      { property: "og:title", content: "Aurelia · Bangkok Real Estate Advisory" },
      {
        property: "og:description",
        content:
          "Regulation-first AI guidance for foreign investors in Bangkok property: the 49% condo quota, land ownership limits, taxes and realistic rental yields.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const quarters = [
  { label: "Q1 · 25", height: "40%", tone: "bg-primary/40" },
  { label: "Q2 · 25", height: "55%", tone: "bg-primary/55" },
  { label: "Q3 · 25", height: "68%", tone: "bg-primary/70" },
  { label: "Q4 · 25", height: "80%", tone: "bg-primary/80" },
  { label: "Q1 · 26", height: "100%", tone: "bg-primary" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-background">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div className="absolute -right-24 -top-24 size-96 rotate-45 border border-primary" />
          <div className="absolute -left-16 -bottom-32 size-72 rotate-45 border border-primary/60" />
          <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-primary/30" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex items-center justify-center gap-4 text-primary/70">
              <span className="h-px w-16 bg-primary/40" />
              <span className="eyebrow tracking-[0.4em]">Bangkok · Foreign Investment</span>
              <span className="h-px w-16 bg-primary/40" />
            </div>
            <p className="eyebrow mb-6 text-primary">Your Concierge for Bangkok Real Estate</p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
              Invest with <span className="text-primary">Clarity</span>,
              <br />
              Build with <span className="text-primary">Integrity</span>
            </h1>
            <p className="mx-auto mt-8 max-w-xl font-serif text-xl italic text-foreground/75 md:text-2xl">
              &ldquo;Every decision grounded in regulation. Every baht guided by honesty.&rdquo;
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/chat"
                className="bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-gold-light"
              >
                Begin the Conversation
              </Link>
              <a
                href="#market"
                className="border border-primary/50 px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-primary/10"
              >
                Read the Market
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-emerald">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center md:grid-cols-4">
          <div>
            <p className="font-display text-3xl text-gold-light">4.2%</p>
            <p className="eyebrow mt-1 text-foreground/60">Avg. Net Yield · BKK</p>
          </div>
          <div className="border-x border-primary/15">
            <p className="font-display text-3xl text-gold-light">฿245K</p>
            <p className="eyebrow mt-1 text-foreground/60">Prime THB / sqm</p>
          </div>
          <div>
            <p className="font-display text-3xl text-gold-light">49%</p>
            <p className="eyebrow mt-1 text-foreground/60">Foreign Quota Cap</p>
          </div>
          <div className="md:border-l md:border-primary/15">
            <p className="font-display text-3xl text-gold-light">14</p>
            <p className="eyebrow mt-1 text-foreground/60">Districts Tracked</p>
          </div>
        </div>
      </section>

      {/* MARKET CHART */}
      <section id="market" className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4 text-primary">Market Pulse</p>
            <h2 className="font-display text-4xl leading-tight">
              Bangkok&rsquo;s Quiet
              <br />
              Appreciation
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/65">
              Condominium prices along the BTS and MRT corridors have climbed steadily, outpacing
              the national index while transaction volume stayed thin. Aurelia tracks 14 districts —
              price per sqm, achievable rent, common-area fees and the remaining foreign quota — so
              you can time entry with evidence rather than speculation.
            </p>
            <div className="mt-8 border-l-2 border-primary pl-5">
              <p className="font-serif text-xl italic text-gold-light">
                &ldquo;Data first. Law before data.&rdquo; — Aurelia&rsquo;s standing doctrine.
              </p>
            </div>
          </div>
          <div className="border border-border bg-background p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="eyebrow text-foreground/60">Price Index · 2025 → 2026</p>
              <span className="font-display text-lg text-primary">▲ 6.1%</span>
            </div>
            <div className="flex h-48 items-end gap-3">
              {quarters.map((quarter) => (
                <div key={quarter.label} className="flex h-full flex-1 flex-col justify-end">
                  <div className="flex h-full flex-col justify-end bg-surface-raised">
                    <div className={quarter.tone} style={{ height: quarter.height }} />
                  </div>
                  <span className="mt-2 block text-center text-[9px] text-foreground/40">
                    {quarter.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 h-px bg-primary/20" />
            <p className="mt-4 text-xs text-foreground/50">
              Indicative composite of prime and mid-market Bangkok condominium asking prices. Not a
              valuation.
            </p>
          </div>
        </div>
      </section>

      {/* NEWS + EDUCATION */}
      <section id="insights" className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-14 text-center">
            <div className="mb-6 flex items-center justify-center gap-4 text-primary/70">
              <span className="h-px w-12 bg-primary/40" />
              <span className="size-2 rotate-45 bg-primary" />
              <span className="h-px w-12 bg-primary/40" />
            </div>
            <h2 className="font-display text-4xl">Insights &amp; Guidance</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <p className="eyebrow mb-3 text-primary">News · This Week</p>
              <h3 className="font-serif text-2xl leading-snug">
                Foreign Buyers Return to Sukhumvit as Completions Peak
              </h3>
              <p className="mt-4 text-sm text-foreground/60">
                A heavy 2025 delivery wave has left negotiable stock in Asok and Phrom Phong.
                Freehold units still sit inside the 49% quota in most towers — but only some.
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-primary">Read Brief →</p>
            </article>
            <article className="border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <p className="eyebrow mb-3 text-primary">Yield · Data</p>
              <h3 className="font-serif text-2xl leading-snug">
                Sathon Net Yields Edge Toward 5% on Softer Entry Prices
              </h3>
              <p className="mt-4 text-sm text-foreground/60">
                Corporate leases keep occupancy near 90%. After common-area fees, sinking fund and
                withholding tax, realistic net yield lands between 3.8% and 5.0%.
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-primary">Read Brief →</p>
            </article>
            <article className="border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <p className="eyebrow mb-3 text-primary">Education · Guide</p>
              <h3 className="font-serif text-2xl leading-snug">
                Can a Foreigner Own Land in Thailand? A Plain-Spoken Answer
              </h3>
              <p className="mt-4 text-sm text-foreground/60">
                No — not directly. Understand the condo-versus-land distinction, the registered
                30-year lease, and why nominee shareholder companies are illegal.
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-primary">Read Guide →</p>
            </article>
          </div>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section id="compliance" className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="eyebrow mb-3 text-primary">Know the Law</p>
            <h2 className="font-display text-4xl">Four Rules Behind Every Purchase</h2>
          </div>
          <div className="grid gap-px bg-primary/25 md:grid-cols-4">
            <div className="bg-background p-6">
              <p className="font-display text-2xl text-primary">49%</p>
              <h3 className="mt-2 font-serif text-xl">The condominium quota</h3>
              <p className="mt-2 text-sm text-foreground/60">
                Foreigners may hold freehold on up to 49% of a building&rsquo;s saleable floor area —
                measured by area, not unit count.
              </p>
            </div>
            <div className="bg-background p-6">
              <p className="font-display text-2xl text-primary">Land</p>
              <h3 className="mt-2 font-serif text-xl">Not in your name</h3>
              <p className="mt-2 text-sm text-foreground/60">
                No direct freehold land or villa ownership. Lawful routes are a registered 30-year
                lease or a BOI-qualified investment.
              </p>
            </div>
            <div className="bg-background p-6">
              <p className="font-display text-2xl text-primary">FET</p>
              <h3 className="mt-2 font-serif text-xl">Money from abroad</h3>
              <p className="mt-2 text-sm text-foreground/60">
                Funds must arrive in foreign currency and be evidenced on the FET form for freehold
                registration at the Land Department.
              </p>
            </div>
            <div className="bg-background p-6">
              <p className="font-display text-2xl text-primary">Tax</p>
              <h3 className="mt-2 font-serif text-xl">The transfer table</h3>
              <p className="mt-2 text-sm text-foreground/60">
                Transfer fee 2%, stamp duty 0.5%, Specific Business Tax 3.3% if sold within five
                years, withholding tax 1-3%.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/chat"
              className="inline-block bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-gold-light"
            >
              Ask Aurelia About Your Case
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
