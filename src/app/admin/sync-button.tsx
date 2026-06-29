"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { syncScrapedData } from "../actions/ipo";
import { RefreshCw } from "lucide-react";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{success?: boolean, message?: string} | null>(null);

  const handleSync = () => {
    startTransition(async () => {
      const res = await syncScrapedData();
      if (res) {
        setResult({ success: res.success, message: res.success ? `Successfully synced ${res.count} IPOs` : res.message });
        setTimeout(() => setResult(null), 5000);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {result && (
        <span className={`text-sm ${result.success ? "text-green-500" : "text-red-500"}`}>
          {result.message}
        </span>
      )}
      <Button onClick={handleSync} disabled={isPending} variant="secondary">
        <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Syncing..." : "Sync Real-Time Data"}
      </Button>
    </div>
  );
}
