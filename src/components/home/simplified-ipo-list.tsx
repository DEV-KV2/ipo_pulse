"use client";

import { Calendar, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface IpoData {
  name: string;
  price: string;
  closeDate: string;
}

export function SimplifiedIpoList() {
  const [ipos, setIpos] = useState<IpoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIpos() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setIpos(json.data.slice(0, 4));
        } else {
          throw new Error("No data");
        }
      } catch (e) {
        console.error("Failed to load IPOs", e);
      } finally {
        setLoading(false);
      }
    }
    fetchIpos();
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> 
          Live Active IPOs
        </h2>
      </div>

      <div className="space-y-4 relative">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl bg-muted/50" />
          ))
        ) : ipos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No active IPOs found.</div>
        ) : (
          ipos.map((ipo, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col gap-1 max-w-[65%]">
                <span className="font-semibold text-foreground truncate">{ipo.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Closes {ipo.closeDate}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-1">
                <span className="text-sm font-bold text-foreground text-right">{ipo.price}</span>
                <span className="text-[10px] text-muted-foreground">Issue Price</span>
              </div>
            </div>
          ))
        )}

        {/* Premium Overlay for Logged-Out Users */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent flex flex-col items-center justify-end pb-4 pt-12">
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <p className="font-semibold text-foreground text-sm max-w-[280px]">
              Sign in to see Live GMP, Subscription Status & AI Ratings
            </p>
            <SignInModal />
          </div>
        </div>
      </div>
    </div>
  );
}
