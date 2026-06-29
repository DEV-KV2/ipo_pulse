import { Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getMarketNews } from "@/lib/yahoo-finance";
import { MarketAnalysisWidget } from "./market-analysis-widget";

function getTimeAgo(timestamp: any) {
  if (!timestamp) return "Recently";
  
  let timeMs = timestamp;
  if (timestamp instanceof Date) {
    timeMs = timestamp.getTime();
  } else if (typeof timestamp === 'string') {
    timeMs = new Date(timestamp).getTime();
  } else if (typeof timestamp === 'number') {
    timeMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  }

  const diff = Math.floor((Date.now() - timeMs) / 1000);
  
  if (diff < 0) return "Just now";
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export async function NewsSection({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const newsItems = await getMarketNews("NIFTY");

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">AI Market Analysis</h2>
      </div>

      {newsItems.length > 0 && (
        <div className="w-full flex-1">
          <MarketAnalysisWidget newsContext={newsItems} isLoggedIn={isLoggedIn} />
        </div>
      )}
    </div>
  );
}

