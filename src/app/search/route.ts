import { NextRequest, NextResponse } from "next/server";
import { IPO_METADATA_MAP } from "@/lib/ipo-data";

const KNOWN_STOCKS: Record<string, string> = {
  "maruti": "MARUTI.NS",
  "reliance": "RELIANCE.NS",
  "tcs": "TCS.NS",
  "hdfc": "HDFCBANK.NS",
  "hdfcbank": "HDFCBANK.NS",
  "hdfc bank": "HDFCBANK.NS",
  "infy": "INFY.NS",
  "infosys": "INFY.NS",
  "itc": "ITC.NS",
  "sbi": "SBIN.NS",
  "sbin": "SBIN.NS",
  "state bank": "SBIN.NS",
  "icici": "ICICIBANK.NS",
  "wipro": "WIPRO.NS",
  "bajaj": "BAJFINANCE.NS",
  "bajfinance": "BAJFINANCE.NS",
  "tata": "TATAMOTORS.NS",
  "tatamotors": "TATAMOTORS.NS",
  "l&t": "LT.NS",
  "lt": "LT.NS",
  "m&m": "M&M.NS",
  "mahindra": "M&M.NS",
  "axis": "AXISBANK.NS",
  "axisbank": "AXISBANK.NS",
  "asian": "ASIANPAINT.NS",
  "asianpaint": "ASIANPAINT.NS",
  "sun": "SUNPHARMA.NS",
  "sunpharma": "SUNPHARMA.NS",
  "nifty": "^NSEI",
  "banknifty": "^NSEBANK",
  "sensex": "^BSESN"
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase().trim();

  if (!query) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 1. Check if it's a known stock
  for (const [key, symbol] of Object.entries(KNOWN_STOCKS)) {
    if (query.includes(key)) {
      return NextResponse.redirect(new URL(`/stocks/${symbol}`, request.url));
    }
  }

  // 2. Check if it's an IPO
  for (const slug of Object.keys(IPO_METADATA_MAP)) {
    if (slug.replace(/-/g, " ").includes(query) || query.includes(slug.replace(/-/g, " "))) {
      return NextResponse.redirect(new URL(`/ipos/${slug}`, request.url));
    }
  }

  // 3. Fallback: assume they entered a stock symbol natively, e.g. ZOMATO -> ZOMATO.NS
  const ticker = query.toUpperCase();
  const isIndianFormat = ticker.endsWith(".NS") || ticker.endsWith(".BO") || ticker.startsWith("^");
  const finalTicker = isIndianFormat ? ticker : `${ticker}.NS`;

  return NextResponse.redirect(new URL(`/stocks/${finalTicker}`, request.url));
}
