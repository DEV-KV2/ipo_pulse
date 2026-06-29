"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export function MarketCard({ name, value, change, pct, up, badge }: {
  name: string;
  value: string;
  change: string;
  pct: string;
  up: boolean;
  badge?: boolean;
}) {
  const isIndex = name.includes("NIFTY") || name.includes("SENSEX") || name.includes("VIX") || name.includes("IPO");
  const domain = getDomainFromName(name);
  const initials = name.substring(0, 2).toUpperCase();

  if (badge) {
    return (
      <div className="flex flex-col px-5 py-4 rounded-xl bg-card border shadow-sm min-w-[140px] hover:shadow-md transition-shadow">
        <span className="text-xs text-muted-foreground font-medium mb-1 truncate max-w-[120px]" title={name}>{name}</span>
        <span className="text-xl font-bold text-foreground mb-1">{value}</span>
        <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-[#00d09c]" : "text-[#eb5b3c]"}`}>
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change} {pct && `(${pct}%)`}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 rounded-xl bg-card border shadow-sm w-full hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center gap-3 mb-3">
        {!isIndex && (
          <Avatar className="h-8 w-8 ring-1 ring-border shadow-sm">
            <AvatarImage src={`https://logo.clearbit.com/${domain}`} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        )}
        {isIndex && (
           <Avatar className="h-8 w-8 ring-1 ring-border shadow-sm">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        )}
        <span className="text-sm font-semibold text-foreground truncate">{name}</span>
      </div>
      
      <div className="flex flex-col mt-auto">
        <span className="text-xl font-bold tabular-nums text-foreground">{value}</span>
        <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${up ? "text-[#00d09c]" : "text-[#eb5b3c]"}`}>
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change} {pct && `(${pct}%)`}
        </div>
      </div>
    </div>
  );
}
