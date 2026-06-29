import { auth } from "@/lib/auth";
import { MutualFundsClientDashboard } from "./mutual-funds-client-dashboard";
import { getLiveQuotes } from "@/lib/yahoo-finance";

const mfConfig = [
  { id: "0P0000YWL1.BO", name: "Quant Small Cap Fund", fundHouse: "Quant", category: "Equity" as const, subCategory: "Small Cap", risk: "Very High" as const },
  { id: "0P0000XW8F.BO", name: "Parag Parikh Flexi Cap", fundHouse: "PPFAS", category: "Equity" as const, subCategory: "Flexi Cap", risk: "High" as const },
  { id: "0P0000XVIK.BO", name: "Nippon India Small Cap", fundHouse: "Nippon India", category: "Equity" as const, subCategory: "Small Cap", risk: "Very High" as const },
  { id: "0P0000UUBB.BO", name: "HDFC Balanced Advantage", fundHouse: "HDFC", category: "Hybrid" as const, subCategory: "Dynamic Asset", risk: "High" as const },
  { id: "0P0000XU33.BO", name: "SBI Liquid Fund", fundHouse: "SBI", category: "Debt" as const, subCategory: "Liquid", risk: "Low" as const },
  { id: "0P0000YWFJ.BO", name: "ICICI Pru Nifty 50 Index", fundHouse: "ICICI Prudential", category: "Index" as const, subCategory: "Large Cap", risk: "High" as const },
  { id: "0P0000XWZA.BO", name: "Motilal Oswal Midcap", fundHouse: "Motilal Oswal", category: "Equity" as const, subCategory: "Mid Cap", risk: "Very High" as const },
  { id: "0P0000XVOJ.BO", name: "Kotak Corporate Bond", fundHouse: "Kotak", category: "Debt" as const, subCategory: "Corporate Bond", risk: "Moderate" as const },
];

export async function MutualFundsDashboard() {
  const session = await auth();

  const symbols = mfConfig.map(c => c.id);
  const quotes = await getLiveQuotes(symbols);

  const detailedFunds = mfConfig.map(config => {
    // getLiveQuotes strips the .BO
    const q = quotes.find(q => q.symbol === config.id.split('.')[0]);
    return {
      ...config,
      aum: q && q.market_cap ? `₹${(q.market_cap / 10000000).toLocaleString('en-IN')} Cr` : "N/A",
      nav: q && q.last_price ? `₹${q.last_price.toFixed(2)}` : "N/A",
      dailyChange: q && q.percent_change ? `${q.percent_change > 0 ? "+" : ""}${q.percent_change.toFixed(2)}%` : "0.00%",
    };
  });

  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="flex flex-col mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Mutual Funds Dashboard</h2>
        <p className="text-muted-foreground mt-1">Discover top performing funds for your portfolio.</p>
      </div>

      <MutualFundsClientDashboard 
        isLoggedIn={!!session?.user}
        funds={detailedFunds}
      />
    </section>
  );
}
