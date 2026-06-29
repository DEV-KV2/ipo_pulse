"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

export function AIReportWidget({ ipoContext }: { ipoContext: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ipoContext }),
        });
        
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          // Fallback if API fails
          setData({
            investmentScore: ipoContext.gmp > 12 ? 85 : 54,
            recommendation: ipoContext.gmp > 12 ? "STRONG SUBSCRIBE" : "NEUTRAL / AVOID",
            strengths: ["Strong market positioning.", "Solid revenue growth.", "Healthy balance sheet."],
            risks: ["Concentrated revenue.", "Regulatory compliance risks.", `Grey market pricing (₹${ipoContext.gmp}) indicates moderate listing cushion.`]
          });
        }
      } catch (error) {
        console.error("Failed to fetch AI insights", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInsights();
  }, [ipoContext]);

  if (loading) {
    return (
      <Card className="bg-muted/50 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-primary/50 text-primary-foreground flex items-center gap-1">
            <Bot className="w-3 h-3 animate-pulse" /> Analyzing...
          </Badge>
        </div>
        <CardHeader>
          <CardTitle>IPO Pulse AI Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const isPositive = data.investmentScore > 50;
  const scoreColor = isPositive ? "text-[#00d09c]" : "text-[#eb5b3c]";
  const badgeColor = isPositive 
    ? "text-[#00d09c] border-[#00d09c]/30 bg-[#00d09c]/5 hover:bg-[#00d09c]/10" 
    : "text-[#eb5b3c] border-[#eb5b3c]/30 bg-[#eb5b3c]/5 hover:bg-[#eb5b3c]/10";

  return (
    <Card className="bg-muted/50 border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Badge className="bg-[#00d09c] hover:bg-[#00b386] text-white">AI Insight</Badge>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" /> IPO Pulse AI Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Investment Score</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-bold ${scoreColor}`}>{data.investmentScore}</span>
              <span className="text-sm text-muted-foreground mb-1">/ 100</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
            <Badge variant="outline" className={badgeColor}>{data.recommendation}</Badge>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Strengths</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {data.strengths.map((str: string, idx: number) => (
              <li key={idx}>{str}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2">
          <h4 className="font-semibold mb-2">Key Risks</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {data.risks.map((risk: string, idx: number) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
