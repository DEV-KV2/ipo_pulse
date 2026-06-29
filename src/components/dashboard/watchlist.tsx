"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  pct: number;
}

export function Watchlist({ activeSymbol, items, onSelect }: { activeSymbol: string, items: WatchlistItem[], onSelect: (s: string) => void }) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col">
        {items.map((item) => {
          const isUp = item.change >= 0;
          return (
            <button
              key={item.symbol}
              onClick={() => onSelect(item.symbol)}
              className={`flex justify-between items-center p-3 border-b border-slate-800/50 hover:bg-[#2a2e39] transition-colors text-left ${activeSymbol === item.symbol ? 'bg-[#2a2e39] border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'}`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-200 text-[13px]">{item.symbol}</span>
                <span className="text-[10px] text-slate-500 font-medium">NSE</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[13px] font-medium tracking-tight ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-[10px] flex items-center font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {Math.abs(item.pct).toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
