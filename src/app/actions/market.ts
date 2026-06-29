"use server";

import { getLiveQuotes } from "@/lib/yahoo-finance";

export async function getWatchlistQuotes() {
  const symbols = [
    "^NSEI", // NIFTY 50
    "^BSESN", // SENSEX
    "^NSEBANK", // BANKNIFTY
    "RELIANCE.NS",
    "HDFCBANK.NS",
    "INFY.NS",
    "TCS.NS",
    "ITC.NS",
    "SBIN.NS",
    "BHARTIARTL.NS",
    "BAJFINANCE.NS"
  ];
  const quotes = await getLiveQuotes(symbols);
  
  // Map yahoo finance symbols to our display names
  const symbolMap: Record<string, string> = {
    "^NSEI": "NIFTY 50",
    "^BSESN": "SENSEX",
    "^NSEBANK": "BANKNIFTY",
    "RELIANCE": "RELIANCE",
    "HDFCBANK": "HDFCBANK",
    "INFY": "INFY",
    "TCS": "TCS",
    "ITC": "ITC",
    "SBIN": "SBIN",
    "BHARTIARTL": "BHARTIARTL",
    "BAJFINANCE": "BAJFINANCE"
  };

  return quotes.map((q) => {
    const displaySymbol = symbolMap[q.symbol] || q.symbol;
    return {
      symbol: displaySymbol,
      price: q.last_price,
      change: q.change,
      pct: q.percent_change,
    };
  });
}
