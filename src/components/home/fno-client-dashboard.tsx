"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { SignInModal } from "@/components/auth/sign-in-modal";

export type IndexData = {
  symbol: string;
  price: number;
  change: number;
  pct: number;
};

type FnoClientDashboardProps = {
  isLoggedIn: boolean;
  indices: IndexData[];
};

export function FnoClientDashboard({ isLoggedIn, indices }: FnoClientDashboardProps) {

  const renderIndexCard = (index: IndexData) => {
    const isUp = index.change >= 0;
    
    const CardContentUI = (
      <CardContent className="p-5 flex flex-col gap-4 cursor-pointer group hover:bg-muted/30 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-lg group-hover:text-primary transition-colors">{index.symbol}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg tabular-nums">₹{index.price.toFixed(2)}</div>
            <div className={`text-sm font-medium tabular-nums flex items-center justify-end gap-1 ${isUp ? "text-green-500" : "text-red-500"}`}>
              {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(index.change).toFixed(2)} ({Math.abs(index.pct)}%)
            </div>
          </div>
        </div>
      </CardContent>
    );

    if (!isLoggedIn) {
      return (
        <SignInModal key={index.symbol}>
          <Card className="border-border/50 bg-card/30 text-left w-full h-full">
            {CardContentUI}
          </Card>
        </SignInModal>
      );
    }

    return (
      <Link key={index.symbol} href="/terminal" className="block w-full h-full">
        <Card className="border-border/50 bg-card/30 w-full h-full">
          {CardContentUI}
        </Card>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Indices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indices.map(renderIndexCard)}
      </div>
      
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl border-border/50 bg-card/10">
        <p>Live Options Chain and Advanced F&O data (PCR, OI) require a premium broker API integration. </p>
      </div>
    </div>
  );
}
