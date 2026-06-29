import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Share2, BookmarkPlus, PieChart, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MutualFundDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const cleanName = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(/%20/g, ' ');
  const category = "Equity - Small Cap";
  const navPrice = 145.25 + (Math.random() * 50);
  const aum = 12000 + (Math.random() * 5000);
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{cleanName}</h1>
              <p className="text-muted-foreground mt-1 text-lg">{category} • Very High Risk</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" /> Watchlist
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
              Start SIP
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-4">
        {/* Key Metrics */}
        <Card className="md:col-span-2 bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle>Fund Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div><span className="text-muted-foreground block mb-1">Current NAV</span> <span className="font-semibold text-lg text-foreground">₹{navPrice.toFixed(2)}</span></div>
            <div><span className="text-muted-foreground block mb-1">Fund Size (AUM)</span> <span className="font-semibold text-lg text-foreground">₹{aum.toFixed(0)} Cr</span></div>
            <div><span className="text-muted-foreground block mb-1">Expense Ratio</span> <span className="font-semibold text-lg text-foreground">{(0.5 + Math.random() * 0.5).toFixed(2)}%</span></div>
            <div><span className="text-muted-foreground block mb-1">Min. SIP Amount</span> <span className="font-semibold text-lg text-foreground">₹500</span></div>
            <div><span className="text-muted-foreground block mb-1">1Y Return</span> <span className="font-semibold text-lg text-green-500">{(20 + Math.random() * 20).toFixed(2)}%</span></div>
            <div><span className="text-muted-foreground block mb-1">3Y Return (Ann.)</span> <span className="font-semibold text-lg text-green-500">{(15 + Math.random() * 15).toFixed(2)}%</span></div>
            <div><span className="text-muted-foreground block mb-1">5Y Return (Ann.)</span> <span className="font-semibold text-lg text-green-500">{(12 + Math.random() * 10).toFixed(2)}%</span></div>
            <div><span className="text-muted-foreground block mb-1">Lock-in Period</span> <span className="font-semibold text-lg text-foreground">None</span></div>
          </CardContent>
        </Card>

        {/* AI Insight Widget */}
        <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-primary hover:bg-primary border-0">AI Insight</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-primary">Pulse Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-8 h-8 text-green-500" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={star <= 4 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">AI Recommendation</p>
              <h3 className="text-xl font-bold text-green-500">Top 10% in Category</h3>
            </div>
            <div className="pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground">Consistently beats the Nifty Smallcap 250 TRI benchmark over 3-year rolling periods with lower downside capture.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <CardTitle>Returns Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center flex-col text-muted-foreground bg-accent/20 rounded-lg mx-6 mb-6">
          <PieChart className="w-12 h-12 mb-4 opacity-50" />
          <p>Interactive Performance vs Benchmark Chart</p>
        </CardContent>
      </Card>
    </div>
  );
}
