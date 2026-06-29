import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MarketCard } from "@/components/home/market-card";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { getLiveQuotes } from "@/lib/yahoo-finance";

const quickLinks = [
  { name: 'Stocks', path: '/stocks', requiresAuth: true },
  { name: 'Mutual Funds', path: '/mutual-funds', requiresAuth: true },
  { name: 'IPOs', path: '/', requiresAuth: true },
  { name: 'F&O', path: '/fno', requiresAuth: true },
  { name: 'ETFs', path: '/etfs', requiresAuth: true },
  { name: 'Bonds', path: '/bonds', requiresAuth: true },
];

export async function HeroSection({ activeTab = 'ipos' }: { activeTab?: string }) {
  const session = await auth();

  // Fetch index data via Yahoo Finance (^NSEI for Nifty 50, ^BSESN for Sensex, ^NSEBANK for Bank Nifty)
  const quotes = await getLiveQuotes(["^NSEI", "^BSESN", "^NSEBANK"]);
  
  const niftyLive = quotes.find(q => q.symbol === "^NSEI");
  const sensexLive = quotes.find(q => q.symbol === "^BSESN");
  const bankNiftyLive = quotes.find(q => q.symbol === "^NSEBANK");

  const formatQuote = (quote: any, fallbackPrice: string, fallbackChange: string, fallbackPct: string, fallbackUp: boolean) => {
    if (!quote) return { price: fallbackPrice, change: fallbackChange, pct: fallbackPct, up: fallbackUp };
    return {
      price: quote.last_price.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      change: quote.change > 0 ? `+${quote.change.toFixed(2)}` : quote.change.toFixed(2),
      pct: quote.percent_change > 0 ? `+${quote.percent_change.toFixed(2)}` : quote.percent_change.toFixed(2),
      up: quote.change >= 0
    };
  };

  const n = formatQuote(niftyLive, "N/A", "-", "-", true);
  const s = formatQuote(sensexLive, "N/A", "-", "-", true);
  const b = formatQuote(bankNiftyLive, "N/A", "-", "-", false);

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-8">
          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.1] mb-8">
            <span className="text-foreground">IPO Intelligence</span>
            <br className="hidden sm:block" />
            <span className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl mt-2 block font-medium">at your fingertips</span>
          </h1>

          {/* Search bar */}
          <form action="/search" method="GET" className="w-full max-w-2xl relative group mt-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="q"
              className="pl-16 h-16 w-full bg-card/90 border-border/60 rounded-full text-lg shadow-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all hover:bg-card"
              placeholder="What are you looking for today?"
              type="search"
            />
          </form>

          {/* Quick Links Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-16">
            {quickLinks.map((item) => {
              const isActive = (item.path === '/' && activeTab === 'ipos') || (item.path !== '/' && false); // We might need to handle active state better later, but for now this works.
              
              const ChipContent = (
                <div className={`px-6 py-2.5 rounded-full border transition-all text-sm font-medium cursor-pointer ${
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                    : "border-border/40 bg-card/30 hover:bg-card hover:border-primary/30 text-foreground"
                }`}>
                  {item.name}
                </div>
              );

              if (item.requiresAuth && !session?.user) {
                return (
                  <SignInModal key={item.name}>
                    <button type="button">{ChipContent}</button>
                  </SignInModal>
                );
              }

              return (
                <Link key={item.name} href={item.path}>
                  {ChipContent}
                </Link>
              );
            })}
          </div>

          {/* Market indices ticker */}
          <div className="w-full flex flex-col items-start mt-4">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Market Indices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <Link href="/terminal" className="block">
                <MarketCard name="NIFTY 50" value={n.price} change={n.change} pct={n.pct} up={n.up} />
              </Link>
              <Link href="/terminal" className="block">
                <MarketCard name="SENSEX" value={s.price} change={s.change} pct={s.pct} up={s.up} />
              </Link>
              <Link href="/terminal" className="block">
                <MarketCard name="BANK NIFTY" value={b.price} change={b.change} pct={b.pct} up={b.up} />
              </Link>
              <Link href="/ipos" className="block">
                <MarketCard name="IPOs" value="10" change="3 Mainboard, 7 SME" pct="" up={true} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


