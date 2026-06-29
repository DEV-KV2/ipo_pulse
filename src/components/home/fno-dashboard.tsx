import { auth } from "@/lib/auth";
import { FnoClientDashboard } from "./fno-client-dashboard";
import { getLiveQuotes } from "@/lib/yahoo-finance";

const indexSymbols = [
  "^NSEI", "^NSEBANK", "^CNXFIN", "^INDIAVIX"
];

const indexNames: Record<string, string> = {
  "^NSEI": "NIFTY 50",
  "^NSEBANK": "BANK NIFTY",
  "^CNXFIN": "NIFTY FIN SERVICE",
  "^INDIAVIX": "INDIA VIX"
};

export async function FnoDashboard() {
  const session = await auth();

  const quotes = await getLiveQuotes(indexSymbols);

  const indices = quotes.map(q => ({
    symbol: indexNames[`^${q.symbol}`] || q.symbol,
    price: q.last_price,
    change: q.change,
    pct: q.percent_change,
  }));

  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="flex flex-col mb-8">
        <h2 className="text-3xl font-bold tracking-tight">F&O Dashboard</h2>
        <p className="text-muted-foreground mt-1">Live spot and index levels.</p>
      </div>

      <FnoClientDashboard 
        isLoggedIn={!!session?.user}
        indices={indices}
      />
    </section>
  );
}
