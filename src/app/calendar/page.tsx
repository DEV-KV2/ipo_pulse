import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIPOs } from "@/app/actions/ipo";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignInModal } from "@/components/auth/sign-in-modal";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const session = await auth();
  const ipos = await getIPOs();
  
  // Sort: Open first, then Upcoming, then Closed
  const sortedIpos = [...ipos].sort((a, b) => {
    const statusOrder: Record<string, number> = { OPEN: 0, UPCOMING: 1, CLOSED: 2, LISTED: 3 };
    return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4.5 h-4.5 text-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">IPO Timeline & Events</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">IPO Calendar</h1>
        <p className="text-muted-foreground mt-2">Track important dates for subscription, allotment, refund, and listing across all Mainboard & SME offerings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedIpos.map((ipo: any) => {
          const isSme = ipo.board === "SME";
          const statusColors: Record<string, string> = {
            OPEN: "border-t-green-500 shadow-green-500/5",
            UPCOMING: "border-t-blue-500 shadow-blue-500/5",
            CLOSED: "border-t-muted-foreground/30",
            LISTED: "border-t-primary"
          };
          const borderStyle = statusColors[ipo.status] || "border-t-border";

          return (
            <Card key={ipo.id || ipo.slug} className={`flex flex-col bg-card/30 border border-border/50 border-t-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-card/40 ${borderStyle}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold leading-tight line-clamp-1">
                      {session?.user ? (
                        <Link href={`/ipos/${ipo.slug}`} className="hover:text-primary transition-colors">
                          {ipo.company?.name || ipo.name}
                        </Link>
                      ) : (
                        <SignInModal>
                          <button className="hover:text-primary transition-colors text-left cursor-pointer">
                            {ipo.company?.name || ipo.name}
                          </button>
                        </SignInModal>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      {isSme ? "SME IPO" : "Mainboard IPO"}
                    </CardDescription>
                  </div>
                  {ipo.status === "OPEN" ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/15 text-[10px] px-2 py-0">
                      Open
                    </Badge>
                  ) : ipo.status === "UPCOMING" ? (
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/15 text-[10px] px-2 py-0">
                      Upcoming
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0">
                      {ipo.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col justify-end text-sm">
                <div className="flex justify-between border-b border-border/20 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" /> Open Date
                  </span>
                  <span className="font-semibold text-xs tabular-nums">
                    {ipo.openDate ? new Date(ipo.openDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-red-400" /> Close Date
                  </span>
                  <span className="font-semibold text-xs tabular-nums">
                    {ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> Allotment Date
                  </span>
                  <span className="font-semibold text-xs tabular-nums">
                    {ipo.basisOfAllotmentDate ? new Date(ipo.basisOfAllotmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
                  </span>
                </div>
                <div className="flex justify-between text-primary font-semibold pt-1">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5" /> Listing Date
                  </span>
                  <span className="text-xs tabular-nums">
                    {ipo.listingDate ? new Date(ipo.listingDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
                  </span>
                </div>
                <div className="pt-2">
                  {session?.user ? (
                    <Link href={`/ipos/${ipo.slug}`} className="w-full text-center py-2 rounded-lg bg-accent/30 hover:bg-primary/10 border border-border/30 hover:border-primary/20 text-xs font-semibold flex items-center justify-center gap-1 group transition-all text-muted-foreground hover:text-primary">
                      View Full Timelines & AI Review <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ) : (
                    <SignInModal>
                      <button className="w-full text-center py-2 rounded-lg bg-accent/30 hover:bg-primary/10 border border-border/30 hover:border-primary/20 text-xs font-semibold flex items-center justify-center gap-1 group transition-all text-muted-foreground hover:text-primary">
                        View Full Timelines & AI Review <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </SignInModal>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
