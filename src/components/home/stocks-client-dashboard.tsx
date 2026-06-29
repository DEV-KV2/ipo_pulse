"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, BarChart2 } from "lucide-react";
import Link from "next/link";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { Button } from "@/components/ui/button";

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  pct: number;
  volume?: number;
  high52w?: number;
  low52w?: number;
};

type StocksClientDashboardProps = {
  isLoggedIn: boolean;
  gainers: StockData[];
  losers: StockData[];
  high52w: StockData[];
  volumeShockers: StockData[];
  sectors: { name: string; change: number }[];
};

// Helper to get domain for clearbit
function getDomainFromName(name: string) {
  const map: Record<string, string> = {
    "Reliance Industries": "ril.com",
    "Tata Consultancy Services": "tcs.com",
    "HDFC Bank": "hdfcbank.com",
    "Infosys": "infosys.com",
    "ITC Ltd": "itcportal.com",
    "State Bank of India": "onlinesbi.sbi",
    "ICICI Bank": "icicibank.com",
    "Wipro": "wipro.com",
    "Bajaj Finance": "bajajfinserv.in",
    "Tata Motors": "tatamotors.com",
    "Larsen & Toubro": "larsentoubro.com",
    "Mahindra & Mahindra": "mahindra.com",
    "Axis Bank": "axisbank.com",
    "Maruti Suzuki": "marutisuzuki.com",
    "Asian Paints": "asianpaints.com",
    "Sun Pharma": "sunpharma.com",
  };
  return map[name] || `${name.split(' ')[0].toLowerCase()}.com`;
}

export function StocksClientDashboard({ 
  isLoggedIn, 
  gainers, 
  losers, 
  high52w, 
  volumeShockers,
  sectors 
}: StocksClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "high52w" | "volume">("gainers");

  const getActiveData = () => {
    switch (activeTab) {
      case "gainers": return gainers;
      case "losers": return losers;
      case "high52w": return high52w;
      case "volume": return volumeShockers;
    }
  };

  const activeData = getActiveData();

  const renderStockRow = (stock: StockData) => {
    const isUp = stock.change >= 0;
    const domain = getDomainFromName(stock.name);
    const initials = stock.symbol.substring(0, 2).toUpperCase();
    
    // Calculate 52w range position if available
    const has52w = stock.high52w && stock.low52w;
    const rangePosition = has52w 
      ? Math.max(0, Math.min(100, ((stock.price - stock.low52w!) / (stock.high52w! - stock.low52w!)) * 100))
      : 50;

    const RowContent = (
      <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0 cursor-pointer group">
        <div className="flex items-center gap-4 w-[40%]">
          <Avatar className="h-10 w-10 ring-1 ring-border shadow-sm">
            <AvatarImage src={`https://logo.clearbit.com/${domain}`} alt={stock.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="font-semibold text-[15px] group-hover:text-primary transition-colors">{stock.name}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">{stock.symbol}</div>
          </div>
        </div>
        
        {/* 52W Range (hidden on small screens) */}
        <div className="hidden md:flex flex-col items-center justify-center w-[25%] px-4">
          {has52w ? (
            <div className="w-full flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground tabular-nums">{stock.low52w}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full relative overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-primary/30"
                  style={{ width: `${rangePosition}%` }}
                />
                <div 
                  className="absolute top-0 bottom-0 w-1.5 bg-primary rounded-full -ml-[3px]"
                  style={{ left: `${rangePosition}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">{stock.high52w}</span>
            </div>
          ) : (
            <div className="w-full h-1.5 bg-muted/50 rounded-full" />
          )}
        </div>

        <div className="text-right w-[35%] md:w-[20%]">
          <div className="font-medium tabular-nums text-[15px]">₹{stock.price.toFixed(2)}</div>
          <div className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-1 ${isUp ? "text-[#00d09c]" : "text-[#eb5b3c]"}`}>
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.pct)}%)
          </div>
        </div>
        
        {/* Hover Actions */}
        <div className="hidden lg:flex items-center justify-end gap-2 w-[15%] opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="h-8 bg-[#00d09c] hover:bg-[#00b386] text-white text-xs px-4 font-bold tracking-wide rounded-sm">BUY</Button>
        </div>
      </div>
    );

    if (!isLoggedIn) {
      return (
        <SignInModal key={stock.symbol}>
          <button className="w-full text-left">{RowContent}</button>
        </SignInModal>
      );
    }

    return (
      <Link key={stock.symbol} href={`/stocks/${stock.symbol.toLowerCase()}`} className="block w-full">
        {RowContent}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Sectors Carousel */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Sectors</h3>
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide">
          {sectors.map(sector => (
            <div key={sector.name} className="flex-shrink-0 snap-start">
              <Card className="border-border/50 bg-card/30 hover:bg-accent/20 cursor-pointer transition-colors min-w-[160px]">
                <CardContent className="p-4">
                  <div className="text-sm font-medium mb-2">{sector.name}</div>
                  <div className={`flex items-center text-sm font-bold ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {sector.change >= 0 ? '+' : ''}{sector.change}%
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Main Stock Table Container */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-card/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 border-b border-border/30 bg-muted/10 gap-4">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            <button 
              onClick={() => setActiveTab("gainers")}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "gainers" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Top Gainers
            </button>
            <button 
              onClick={() => setActiveTab("losers")}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "losers" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Top Losers
            </button>
            <button 
              onClick={() => setActiveTab("high52w")}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "high52w" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              52W High
            </button>
            <button 
              onClick={() => setActiveTab("volume")}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "volume" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Most Active
            </button>
          </div>
          <div className="px-4 pb-2 sm:pb-0 flex items-center">
             <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
               <Activity className="w-3 h-3 mr-1 animate-pulse" /> Live
             </Badge>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/5 border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="w-[40%]">Company</div>
          <div className="hidden md:block w-[25%] text-center">52W Range</div>
          <div className="w-[35%] md:w-[20%] text-right">Price</div>
          <div className="hidden lg:block w-[15%] text-right pr-4">Action</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {activeData.map(stock => renderStockRow(stock))}
        </div>
      </Card>
    </div>
  );
}
