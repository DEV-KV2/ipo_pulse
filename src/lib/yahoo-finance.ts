import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export interface MarketData {
  symbol: string;
  company_name: string;
  last_price: number;
  change: number;
  percent_change: number;
  volume: number;
  market_cap: number;
  pe_ratio: number;
  sector: string;
  high52w: number;
  low52w: number;
}

/**
 * Fetch real-time market data for a list of symbols
 */
export async function getLiveQuotes(symbols: string[]): Promise<MarketData[]> {
  if (!symbols || symbols.length === 0) return [];
  
  try {
    const quotes = (await yahooFinance.quote(symbols)) as any[];
    return quotes.map((q: any) => ({
      symbol: q.symbol.split('.')[0],
      company_name: q.longName || q.shortName || q.symbol,
      last_price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      percent_change: q.regularMarketChangePercent || 0,
      volume: q.regularMarketVolume || 0,
      market_cap: q.marketCap || 0,
      pe_ratio: q.forwardPE || q.trailingPE || 0,
      sector: "Market",
      high52w: q.fiftyTwoWeekHigh || 0,
      low52w: q.fiftyTwoWeekLow || 0
    }));
  } catch (error) {
    console.error("Live API fetch failed:", error);
    return [];
  }
}

/**
 * Fetch a single quote with more details
 */
export async function getSingleQuote(symbol: string) {
  try {
    const q = (await yahooFinance.quote(symbol)) as any;
    return {
      symbol: q.symbol.split('.')[0],
      longName: q.longName || q.shortName || q.symbol,
      regularMarketPrice: q.regularMarketPrice || 0,
      regularMarketChange: q.regularMarketChange || 0,
      regularMarketChangePercent: q.regularMarketChangePercent || 0,
      ytdReturn: q.ytdReturn || 0
    };
  } catch (error) {
    console.error("Live API fetch failed:", error);
    return null;
  }
}

/**
 * Fetch real-time market news
 */
export async function getMarketNews(query: string = "India stock market") {
  try {
    const result = await yahooFinance.search(query, { newsCount: 6 }) as any;
    return result.news || [];
  } catch (error) {
    console.error("Live news fetch failed:", error);
    return [];
  }
}
