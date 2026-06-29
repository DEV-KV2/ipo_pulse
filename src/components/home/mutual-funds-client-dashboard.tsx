"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Zap, Building2, Search, Filter } from "lucide-react";
import Link from "next/link";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FundData = {
  id: string;
  name: string;
  fundHouse: string;
  category: "Equity" | "Debt" | "Hybrid" | "Index";
  subCategory: string;
  aum: string;
  nav: string;
  dailyChange: string;
  risk: "Low" | "Moderate" | "High" | "Very High";
};

type MutualFundsClientDashboardProps = {
  isLoggedIn: boolean;
  funds: FundData[];
};

export function MutualFundsClientDashboard({ isLoggedIn, funds }: MutualFundsClientDashboardProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Equity", "Debt", "Hybrid", "Index"];

  const filteredFunds = funds.filter(fund => {
    const matchesCategory = activeCategory === "All" || fund.category === activeCategory;
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "Low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Moderate": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "High": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Very High": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const renderFundRow = (fund: FundData) => {
    const isUp = !fund.dailyChange.startsWith("-") && fund.dailyChange !== "N/A" && fund.dailyChange !== "0.00%";
    
    const RowContent = (
      <div className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0 cursor-pointer group">
        
        {/* Name and Basic Info */}
        <div className="col-span-12 md:col-span-5 flex items-start gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-md bg-accent text-lg font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
            {fund.fundHouse.charAt(0)}
          </div>
          <div className="flex flex-col text-left">
            <div className="font-semibold text-[15px] group-hover:text-primary transition-colors line-clamp-1">{fund.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 border-border/50">{fund.subCategory}</Badge>
              <Badge variant="outline" className={`text-[10px] font-normal px-1.5 py-0 ${getRiskColor(fund.risk)}`}>{fund.risk} Risk</Badge>
            </div>
          </div>
        </div>

        {/* Min SIP & AUM */}
        <div className="hidden md:flex col-span-3 flex-col text-left">
          <div className="text-sm font-medium text-muted-foreground">AUM: {fund.aum}</div>
        </div>

        {/* Returns */}
        <div className="col-span-8 md:col-span-3 flex justify-between md:justify-end gap-6 text-right">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">NAV</span>
            <span className="text-sm font-semibold tabular-nums">{fund.nav}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">1D Change</span>
            <span className={`text-sm font-semibold tabular-nums ${isUp ? "text-green-500" : (fund.dailyChange.startsWith("-") ? "text-red-500" : "")}`}>{fund.dailyChange}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="col-span-4 md:col-span-1 flex justify-end opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="h-8 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">Invest</Button>
        </div>
      </div>
    );

    if (!isLoggedIn) {
      return (
        <SignInModal key={fund.id}>
          <button className="w-full text-left">{RowContent}</button>
        </SignInModal>
      );
    }

    return (
      <Link key={fund.id} href={`/mutual-funds/${fund.id}`} className="block w-full">
        {RowContent}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Quick Collections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "High Returns", subtitle: "Top performers in 3Y", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Tax Saving", subtitle: "ELSS Funds", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Start with ₹500", subtitle: "Beginner SIPs", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
          { title: "Top Companies", subtitle: "Large Cap Funds", icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((collection, i) => (
          <Card key={i} className="border-border/50 bg-card/30 hover:bg-accent/20 cursor-pointer transition-colors group">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${collection.bg}`}>
                <collection.icon className={`w-5 h-5 ${collection.color}`} />
              </div>
              <div>
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">{collection.title}</div>
                <div className="hidden sm:block text-[11px] text-muted-foreground mt-0.5">{collection.subtitle}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Container */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-card/40">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-border/30 bg-muted/10 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-card/50 text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search mutual funds..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-card border-border/50 text-sm"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-5">Fund Name</div>
          <div className="col-span-3">AUM</div>
          <div className="col-span-3 flex justify-between pr-4">
            <span>NAV</span>
            <span>1D Change</span>
          </div>
          <div className="col-span-1 text-right pr-4"><Filter className="w-3.5 h-3.5 inline-block" /></div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col min-h-[400px]">
          {filteredFunds.length > 0 ? (
            filteredFunds.map(fund => renderFundRow(fund))
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mb-4 opacity-20" />
              <p>No funds found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
