import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export function FeaturedCards() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Trending IPO */}
        <Link href="/ipos/csm-technologies">
          <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">TRENDING</span>
              </div>
              <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">CSM Technologies</h3>
              <p className="text-xs text-muted-foreground mb-3">₹107 - ₹113 · Lot: 130 · Mainboard</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/15">Open</Badge>
                <span className="text-sm font-semibold text-green-500">GMP: +₹4 (3.5%)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Closing Soon */}
        <Link href="/ipos/crazy-snacks">
          <Card className="group relative overflow-hidden border-border/50 hover:border-orange-500/30 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">CLOSING SOON</span>
              </div>
              <h3 className="font-bold text-base mb-1 group-hover:text-orange-500 transition-colors">Crazy Snacks Ltd</h3>
              <p className="text-xs text-muted-foreground mb-3">₹39 - ₹42 · Lot: 3000 · SME</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/15">Closes Jun 30</Badge>
                <span className="text-sm font-semibold text-muted-foreground">GMP: Neutral</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Highest GMP */}
        <Link href="/ipos/kratikal-tech">
          <Card className="group relative overflow-hidden border-border/50 hover:border-green-500/30 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl" />
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">HIGHEST GMP</span>
              </div>
              <h3 className="font-bold text-base mb-1 group-hover:text-green-500 transition-colors">Kratikal Tech</h3>
              <p className="text-xs text-muted-foreground mb-3">₹128 - ₹135 · Lot: 1000 · SME</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/15">Upcoming</Badge>
                <span className="text-sm font-semibold text-green-500">GMP: +₹15 (11.1%)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* AI Score Card */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-cyan-500/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary">AI INSIGHTS</span>
            </div>
            <h3 className="font-bold text-base mb-1">IPO Pulse Score</h3>
            <p className="text-xs text-muted-foreground mb-3">AI-powered analysis of 20 active IPOs</p>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-primary">87</div>
              <div className="text-xs text-muted-foreground leading-tight">
                Average market<br />sentiment score
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
