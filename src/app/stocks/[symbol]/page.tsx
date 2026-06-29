import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Share2, BookmarkPlus, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getLiveQuotes } from "@/lib/yahoo-finance";

export const dynamic = "force-dynamic";

export default async function StockDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  
  const cleanSymbol = symbol.toUpperCase().replace(/%20/g, ' ');
  const quotes = await getLiveQuotes([cleanSymbol]);
  
  if (!quotes || quotes.length === 0) {
    return notFound();
  }
  
  const quote = quotes[0];
  
  const isPositive = quote.change >= 0;
  const currentPrice = quote.last_price;
  const change = quote.change;
  const changePct = quote.percent_change;
  
  const scoreColor = isPositive ? "text-green-500" : "text-amber-500";
  const badgeColor = isPositive 
    ? "text-green-500 border-green-500/30 bg-green-500/5 hover:bg-green-500/10" 
    : "text-amber-500 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10";

  const marketCap = quote.market_cap ? (quote.market_cap / 10000000).toFixed(0) : "N/A";
  const peRatio = quote.pe_ratio ? quote.pe_ratio.toFixed(2) : "N/A";
  const fiftyTwoHigh = quote.high52w ? quote.high52w.toFixed(2) : "N/A";
  const fiftyTwoLow = quote.low52w ? quote.low52w.toFixed(2) : "N/A";
  const divYield: string = "N/A";
  const roe: string = "N/A";
  const bookValue: string = "N/A";
  const faceValue: string = "10.00";

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-bold text-xl">
              {cleanSymbol.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold">{cleanSymbol}</h1>
              <p className="text-muted-foreground mt-1 text-lg">National Stock Exchange (NSE)</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold">₹{currentPrice.toFixed(2)}</h2>
          </div>
          <div className={`flex items-center gap-1 font-medium mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change).toFixed(2)} ({Math.abs(changePct).toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button variant="outline" size="sm">
          <BookmarkPlus className="mr-2 h-4 w-4" /> Watchlist
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button size="sm" className={isPositive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
          {isPositive ? "Buy" : "Sell"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-4">
        {/* Key Metrics */}
        <Card className="md:col-span-2 bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div><span className="text-muted-foreground block mb-1">Market Cap</span> <span className="font-semibold text-lg">{marketCap !== "N/A" ? `₹${marketCap} Cr` : "N/A"}</span></div>
            <div><span className="text-muted-foreground block mb-1">P/E Ratio</span> <span className="font-semibold text-lg">{peRatio}</span></div>
            <div><span className="text-muted-foreground block mb-1">52W High</span> <span className="font-semibold text-lg">{fiftyTwoHigh !== "N/A" ? `₹${fiftyTwoHigh}` : "N/A"}</span></div>
            <div><span className="text-muted-foreground block mb-1">52W Low</span> <span className="font-semibold text-lg">{fiftyTwoLow !== "N/A" ? `₹${fiftyTwoLow}` : "N/A"}</span></div>
            <div><span className="text-muted-foreground block mb-1">Div Yield</span> <span className="font-semibold text-lg">{divYield}</span></div>
            <div><span className="text-muted-foreground block mb-1">ROE</span> <span className="font-semibold text-lg">{roe}</span></div>
            <div><span className="text-muted-foreground block mb-1">Book Value</span> <span className="font-semibold text-lg">{bookValue}</span></div>
            <div><span className="text-muted-foreground block mb-1">Face Value</span> <span className="font-semibold text-lg">{faceValue !== "N/A" ? `₹${faceValue}` : "N/A"}</span></div>
          </CardContent>
        </Card>

        {/* AI Insight Widget */}
        <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-primary hover:bg-primary border-0">AI Insight</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-primary">Pulse Technicals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Technical Rating</p>
              <h3 className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? 'Bullish' : 'Bearish'}
              </h3>
            </div>
            <div className="pt-4 border-t border-border/30">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">RSI (14)</span>
                <span className="font-medium">{isPositive ? '64.5 (Overbought)' : '32.1 (Oversold)'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">MACD</span>
                <span className="font-medium">{isPositive ? 'Positive Crossover' : 'Negative Crossover'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle>Price Action</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center flex-col text-muted-foreground bg-accent/20 rounded-lg mx-6 mb-6">
          <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
          <p>Interactive Candlestick Chart rendering area.</p>
          <p className="text-sm">Powered by TradingView</p>
        </CardContent>
      </Card>
      
      {/* Company Overview & Financials */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {cleanSymbol} is a leading player in the Indian market, operating across diverse segments. The company has maintained a strong market presence with robust operational efficiency and a solid track record of growth and profitability.
            </p>
            <div className="grid gap-4 mt-4">
              <div>
                <h4 className="font-semibold mb-1">Promoter Holding</h4>
                <div className="w-full bg-accent rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>65.0%</span>
                  <span>Promoter</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-primary/20 relative overflow-hidden">
          <CardHeader>
            <CardTitle>AI SWOT Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-green-500">S</span>trengths</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Consistent revenue growth over 5 quarters</li>
                <li>High promoter holding pledge-free</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-border/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-red-500">W</span>eaknesses</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Trading at high P/E multiples</li>
                <li>Muted institutional buying this quarter</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
