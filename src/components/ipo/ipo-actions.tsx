"use client";

import { Button } from "@/components/ui/button";
import { Share2, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { useState } from "react";

export function IpoActions({ ipoName }: { ipoName: string }) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const handleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    // Note: using native alert/prompt as fallback if toast is not imported
    if (!isWatchlisted) {
      alert(`Added ${ipoName} to your watchlist!`);
    } else {
      alert(`Removed ${ipoName} from your watchlist.`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleApply = () => {
    alert("Redirecting to your broker's IPO application portal...");
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={isWatchlisted ? "default" : "outline"} 
        size="sm" 
        onClick={handleWatchlist}
      >
        {isWatchlisted ? (
          <><BookmarkCheck className="mr-2 h-4 w-4" /> Saved</>
        ) : (
          <><BookmarkPlus className="mr-2 h-4 w-4" /> Watchlist</>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" /> Share
      </Button>
      <Button size="sm" onClick={handleApply} className="bg-green-500 hover:bg-green-600 text-white">
        Apply Now
      </Button>
    </div>
  );
}
