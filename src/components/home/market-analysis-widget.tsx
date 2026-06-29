"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, TrendingUp, TrendingDown, Minus, RefreshCw, Lock } from "lucide-react";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { Button } from "@/components/ui/button";

interface MarketAnalysis {
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED";
  summary: string;
  keyTakeaways: string[];
}

export function MarketAnalysisWidget({ newsContext, isLoggedIn = false }: { newsContext: any[], isLoggedIn?: boolean }) {
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch("/api/market-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newsContext: newsContext.slice(0, 5) }), // send only top 5 headlines to save tokens
        });
        
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
        } else {
          setAnalysis({
            sentiment: "NEUTRAL",
            summary: "⚠️ AI configuration missing. Please add GEMINI_API_KEY to your .env file to enable live AI market analysis.",
            keyTakeaways: ["Configure GEMINI_API_KEY", "Restart development server"]
          } as MarketAnalysis);
        }
      } catch (err) {
        console.error("Failed to fetch market analysis", err);
        setAnalysis({
            sentiment: "NEUTRAL",
            summary: "⚠️ AI service temporarily unavailable.",
            keyTakeaways: []
        } as MarketAnalysis);
      } finally {
        setLoading(false);
      }
    }
    
    if (newsContext && newsContext.length > 0) {
      fetchAnalysis();
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, [newsContext]);

  if (loading) {
    return (
      <Card className="border-border/50 bg-card overflow-hidden">
        <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            AI Generating Market Analysis...
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-4">
          <Skeleton className="h-16 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const sentimentConfig = {
    BULLISH: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: TrendingUp },
    BEARISH: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: TrendingDown },
    NEUTRAL: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Minus },
    MIXED: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Sparkles }
  };

  const config = sentimentConfig[analysis.sentiment] || sentimentConfig.NEUTRAL;
  const Icon = config.icon;

  return (
    <Card className="border-border/50 bg-card overflow-hidden h-full shadow-sm">
      <CardHeader className="pb-3 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Market Trend Today
        </CardTitle>
        <Badge className={`${config.bg} ${config.color} ${config.border} border hover:${config.bg}`}>
          <Icon className="w-3 h-3 mr-1" />
          {analysis.sentiment}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Market Analysis Today</h4>
          <p className="text-sm leading-relaxed text-card-foreground font-medium">
            {analysis.summary}
          </p>
        </div>
        <div className="relative mt-2">
          {!isLoggedIn && (
            <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-background/60 flex flex-col items-center justify-center p-4 text-center rounded-lg border border-border/50">
              <Lock className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-3">Sign in to unlock key takeaways</p>
              <SignInModal>
                <Button size="sm" variant="default" className="h-8">
                  Sign In
                </Button>
              </SignInModal>
            </div>
          )}
          <div className={!isLoggedIn ? "opacity-30 pointer-events-none select-none blur-[2px]" : ""}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Takeaways</h4>
            <ul className="space-y-2">
              {analysis.keyTakeaways.map((point, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
