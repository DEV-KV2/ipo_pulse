import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignInModal } from "@/components/auth/sign-in-modal";

import { getIPOs } from "@/app/actions/ipo";

export async function LiveIpoTable({ ipos: passedIpos }: { ipos?: any[] }) {
  const session = await auth();
  
  let displayIpos = passedIpos;
  if (!displayIpos) {
    const rawIpos = await getIPOs();
    displayIpos = rawIpos.map(ipo => {
      const latestGmp = ipo.gmpHistory?.[0]?.gmp || 0;
      const priceBandHigh = ipo.priceBandHigh || 0;
      const gainPercent = priceBandHigh ? ((latestGmp / priceBandHigh) * 100).toFixed(1) : "0.0";
      
      return {
        slug: ipo.slug,
        name: ipo.company?.name || ipo.name || "Unknown Company",
        sector: ipo.company?.sector || (ipo.board === "SME" ? "SME" : "Mainboard"),
        price: ipo.priceBandLow === ipo.priceBandHigh 
          ? `₹${ipo.priceBandHigh}` 
          : ipo.priceBandLow 
            ? `₹${ipo.priceBandLow}-₹${ipo.priceBandHigh}` 
            : `₹${ipo.priceBandHigh}`,
        board: ipo.board,
        status: ipo.status,
        gmp: latestGmp,
        gmpPct: parseFloat(gainPercent),
        open: ipo.openDate ? new Date(ipo.openDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBA",
        close: ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBA",
        lot: ipo.lotSize || 0
      };
    }).slice(0, 10);
  }

  const openCount = displayIpos.filter(i => i.status === "OPEN").length;
  const upcomingCount = displayIpos.filter(i => i.status === "UPCOMING").length;

  return (
    <section className="container px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live IPO Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time data · {openCount} Open · {upcomingCount} Upcoming</p>
        </div>
        {!passedIpos && (
          <Link href="/ipos" className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-1 border-border/50 hover:border-primary/30 hover:bg-primary/5"}>
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-border/50 overflow-x-auto bg-card/30">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border/30 bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Lot</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">GMP (Est. Gain)</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Open</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Close</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayIpos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No IPOs found matching your criteria. Try adjusting your search.
                </td>
              </tr>
            ) : (
              displayIpos.map((ipo, i) => (
                <tr key={ipo.slug} className={`hover:bg-accent/50 transition-colors cursor-pointer group ${i < displayIpos.length - 1 ? "border-b border-border/20" : ""}`}>
                  {/* Company */}
                  <td className="px-4 py-3.5">
                    <Link href={`/ipos/${ipo.slug}`} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-xs font-bold text-muted-foreground shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {ipo.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">{ipo.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-muted-foreground">{ipo.sector}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ipo.board === "SME" ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"}`}>{ipo.board}</span>
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5 text-sm font-medium tabular-nums whitespace-nowrap">{ipo.price}</td>

                  {/* Lot */}
                  <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums">{ipo.lot?.toLocaleString() || "—"}</td>

                  {/* GMP */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {ipo.gmp > 0 ? (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          <span className="text-sm font-semibold text-green-500 tabular-nums">₹{ipo.gmp}</span>
                          <span className="text-xs text-green-500/70 tabular-nums">({ipo.gmpPct}%)</span>
                        </>
                      ) : ipo.gmp < 0 ? (
                        <>
                          <ArrowDownRight className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="text-sm font-semibold text-red-500 tabular-nums">₹{Math.abs(ipo.gmp)}</span>
                          <span className="text-xs text-red-500/70 tabular-nums">({ipo.gmpPct}%)</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm text-muted-foreground">—</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Open */}
                  <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums whitespace-nowrap">{ipo.open}</td>

                  {/* Close */}
                  <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums whitespace-nowrap">{ipo.close}</td>

                  {/* Status */}
                  <td className="px-4 py-3.5 text-center">
                    {ipo.status === "OPEN" ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/15 text-[11px] px-2.5">
                        Open
                      </Badge>
                    ) : ipo.status === "UPCOMING" ? (
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/15 text-[11px] px-2.5">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[11px] px-2.5">
                        {ipo.status}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
