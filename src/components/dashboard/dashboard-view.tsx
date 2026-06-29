"use client";

import { TradingChart } from "./trading-chart";
import { OptionChain } from "./option-chain";
import { Watchlist, WatchlistItem } from "./watchlist";
import { useState, useEffect } from "react";
import { getWatchlistQuotes } from "@/app/actions/market";

export function DashboardView() {
  const [activeSymbol, setActiveSymbol] = useState("NIFTY 50");
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getWatchlistQuotes();
        if (data && data.length > 0) {
          setWatchlistItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch watchlist quotes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const activeItem = watchlistItems.find(i => i.symbol === activeSymbol) || { price: 24315.20, change: 112.45, pct: 0.46 };
  const isUp = activeItem.change >= 0;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0e1117] text-slate-300">
      {/* Left Sidebar - Watchlist */}
      <div className="w-64 border-r border-slate-800 bg-[#131722] flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-3 border-b border-slate-800 font-semibold text-white">Watchlist</div>
        {loading && watchlistItems.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">Loading live data...</div>
        ) : (
          <Watchlist activeSymbol={activeSymbol} items={watchlistItems} onSelect={setActiveSymbol} />
        )}
      </div>

      {/* Main Content - Chart */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0e1117]">
        <div className="h-14 border-b border-slate-800 flex items-center px-4 font-semibold text-lg text-white gap-4">
          {activeSymbol}
          <div className="flex gap-2 items-baseline">
            <span className={`text-xl tracking-tight ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {activeItem.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-sm flex items-center font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isUp ? '+' : ''}{activeItem.change.toFixed(2)} ({Math.abs(activeItem.pct).toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex-1 relative">
          <TradingChart symbol={activeSymbol} />
        </div>
      </div>

      {/* Right Sidebar - Options / Details */}
      <div className="w-80 border-l border-slate-800 bg-[#131722] flex-shrink-0 flex flex-col hidden lg:flex">
        <div className="p-3 border-b border-slate-800 font-semibold text-white flex justify-between items-center">
          Option Chain
          <span className="text-[10px] font-medium text-slate-300 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Exp: 27 Jun</span>
        </div>
        <OptionChain symbol={activeSymbol} />
      </div>
    </div>
  );
}
