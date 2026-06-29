import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getIPOs } from "@/app/actions/ipo";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GMPTrackerPage() {
  const ipos = await getIPOs();
  
  // Map and sort by estimated gain percentage descending
  const mappedIpos = ipos.map((ipo: any) => {
    const latestGmp = ipo.gmpHistory?.[0]?.gmp || 0;
    const priceBandHigh = ipo.priceBandHigh || 0;
    const estPrice = priceBandHigh + latestGmp;
    const gainPct = priceBandHigh ? ((latestGmp / priceBandHigh) * 100) : 0;
    
    return {
      ...ipo,
      latestGmp,
      estPrice,
      gainPct,
    };
  }).sort((a, b) => b.gainPct - a.gainPct);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-500">Live Grey Market Premium</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">GMP Tracker</h1>
          <p className="text-muted-foreground mt-2">Expected listing price and premium rates updated hourly based on grey market transactions.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Quick Stats */}
        <Card className="bg-card/30 border-border/50 backdrop-blur-sm lg:col-span-1 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Top Gainer Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mappedIpos.length > 0 && (
              <div>
                <h3 className="text-xl font-bold truncate">{mappedIpos[0].company?.name || mappedIpos[0].name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-green-500">+{mappedIpos[0].gainPct.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">GMP: ₹{mappedIpos[0].latestGmp}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Table */}
        <Card className="bg-card/30 border-border/50 backdrop-blur-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Live GMP Estimations
            </CardTitle>
            <CardDescription>Estimated listing gains computed using the latest grey market premiums.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Board</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Band</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current GMP</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Listing Price</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Gain %</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedIpos.map((ipo: any) => (
                    <TableRow key={ipo.id || ipo.slug} className="border-border/20 hover:bg-accent/40 transition-colors">
                      <TableCell className="font-semibold py-4">
                        <Link href={`/ipos/${ipo.slug}`} className="hover:text-primary transition-colors">
                          {ipo.company?.name || ipo.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded ${ipo.board === "SME" ? "bg-blue-500/5 text-blue-400 border-blue-500/20" : "bg-primary/5 text-primary border-primary/20"}`}>
                          {ipo.board}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums font-medium">
                        {ipo.priceBandLow === ipo.priceBandHigh 
                          ? `₹${ipo.priceBandHigh}` 
                          : ipo.priceBandLow 
                            ? `₹${ipo.priceBandLow} - ₹${ipo.priceBandHigh}` 
                            : `₹${ipo.priceBandHigh}`}
                      </TableCell>
                      <TableCell className="font-bold text-green-500 tabular-nums">
                        {ipo.latestGmp > 0 ? `₹${ipo.latestGmp}` : "—"}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        ₹{ipo.estPrice}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {ipo.latestGmp > 0 ? (
                          <span className="flex items-center gap-0.5 text-green-500 font-bold text-sm">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            +{ipo.gainPct.toFixed(1)}%
                          </span>
                        ) : ipo.latestGmp < 0 ? (
                          <span className="flex items-center gap-0.5 text-red-500 font-bold text-sm">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {ipo.gainPct.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-muted-foreground text-sm">
                            <Minus className="w-3.5 h-3.5" />
                            0.0%
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
