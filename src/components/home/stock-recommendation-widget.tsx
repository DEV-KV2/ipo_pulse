"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, TrendingUp, Target, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { Button } from "@/components/ui/button";

interface AIRecommendation {
  trendingUp?: string[];
  topPick?: {
    symbol: string;
    name: string;
    reason: string;
  };
  message?: string;
}

export function StockRecommendationWidget() {
  const [session, setSession] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Stocks");
  const categories = ["Stocks", "IPOs", "Funds", "ETFs"];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchRecommendation() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock-recommendations?category=${activeCategory}`);
        if (res.ok) {
          const data = await res.json();
          setRecommendation(data);
        } else {
          setRecommendation({ message: "⚠️ AI configuration missing. Please add GEMINI_API_KEY to your .env file to enable live AI recommendations." });
        }
      } catch (err) {
        console.error("Failed to fetch stock recommendations", err);
        setRecommendation({ message: "⚠️ AI service temporarily unavailable." });
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendation();
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 h-full min-h-[400px]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            AI Recommendations
          </h2>
        </div>
        
        <Card className="border-border/50 bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border/50 bg-muted/20">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-6 flex flex-col gap-4 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recommendation) return null;

  if (recommendation.message) {
    return (
      <div className="flex flex-col gap-6 h-full min-h-[400px]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Recommendations
          </h2>
        </div>
        
        <Card className="border-border/50 bg-card overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-border/50 bg-muted/20">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-6 flex-1">
            <p className="text-sm text-muted-foreground">{recommendation.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-[400px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Recommendations
        </h2>
      </div>

      <Card className="border-primary/20 bg-card overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-primary/10 bg-primary/5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <CardContent className="p-6 flex flex-col gap-5 flex-1">
          {recommendation.trendingUp && recommendation.trendingUp.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending Up Today
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.trendingUp.map((stock, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                    {stock}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="relative mt-2">
            {!session && (
              <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-background/60 flex flex-col items-center justify-center p-4 text-center rounded-xl border border-border/50">
                <Lock className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-3">Sign in to unlock AI top picks</p>
                <SignInModal>
                  <Button size="sm" variant="default" className="h-8">
                    Sign In
                  </Button>
                </SignInModal>
              </div>
            )}
            <div className={!session ? "opacity-30 pointer-events-none select-none blur-[2px]" : ""}>
              {recommendation.topPick && (
                <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    AI Top Pick: BUY
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{recommendation.topPick.name}</span>
                    <Badge className="bg-primary text-primary-foreground">
                      {recommendation.topPick.symbol}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {recommendation.topPick.reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
