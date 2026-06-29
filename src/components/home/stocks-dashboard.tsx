import { auth } from "@/lib/auth";
import { StocksClientDashboard } from "./stocks-client-dashboard";
import { getLiveQuotes } from "@/lib/yahoo-finance";

const stockSymbols = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", 
  "ITC.NS", "SBIN.NS", "ICICIBANK.NS", "WIPRO.NS", 
  "BAJFINANCE.NS", "TATAMOTORS.NS", "LT.NS", "M&M.NS",
  "AXISBANK.NS", "MARUTI.NS", "ASIANPAINT.NS", "SUNPHARMA.NS"
];

const sectorSymbols = [
  "^CNXIT", "^NSEBANK", "^CNXAUTO", "^CNXPHARMA", "^CNXMETAL", "^CNXFMCG"
];

const sectorNames: Record<string, string> = {
  "^CNXIT": "NIFTY IT",
  "^NSEBANK": "NIFTY BANK",
  "^CNXAUTO": "NIFTY AUTO",
  "^CNXPHARMA": "NIFTY PHARMA",
  "^CNXMETAL": "NIFTY METAL",
  "^CNXFMCG": "NIFTY FMCG",
};

export async function StocksDashboard() {
  const session = await auth();

  // Fetch all live data in parallel using Yahoo Finance
  const [stockQuotes, indexQuotes] = await Promise.all([
    getLiveQuotes(stockSymbols),
    getLiveQuotes(sectorSymbols)
  ]);

  // Format stocks for the UI
  const formattedStocks = stockQuotes.map(q => ({
    symbol: q.symbol,
    name: q.company_name,
    price: q.last_price,
    change: q.change,
    pct: q.percent_change,
    high52w: q.high52w,
    low52w: q.low52w,
    volume: q.volume
  }));

  // Sort logically for each category
  const sortedByChange = [...formattedStocks].sort((a, b) => b.pct - a.pct);
  const sortedByVolume = [...formattedStocks].sort((a, b) => (b.volume || 0) - (a.volume || 0));
  const sortedBy52wHigh = [...formattedStocks].sort((a, b) => {
    // Closest to 52w high ratio
    const ratioA = a.price && a.high52w ? a.price / a.high52w : 0;
    const ratioB = b.price && b.high52w ? b.price / b.high52w : 0;
    return ratioB - ratioA;
  });

  const gainers = sortedByChange.slice(0, 4);
  const losers = sortedByChange.slice().reverse().slice(0, 4);
  const volumeShockers = sortedByVolume.slice(0, 4);
  const high52w = sortedBy52wHigh.slice(0, 4);

  // Format sectors
  const sectors = indexQuotes.map(q => ({
    name: sectorNames[`^${q.symbol}`] || q.company_name || q.symbol,
    change: q.percent_change
  }));

  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="flex flex-col mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Markets Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time data and actionable insights across segments.</p>
      </div>

      <StocksClientDashboard 
        isLoggedIn={!!session?.user}
        gainers={gainers}
        losers={losers}
        high52w={high52w}
        volumeShockers={volumeShockers}
        sectors={sectors}
      />
    </section>
  );
}
