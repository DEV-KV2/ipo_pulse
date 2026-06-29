import { LiveIpoTable } from "@/components/home/live-ipo-table";
import { getIPOs } from "@/app/actions/ipo";

export const dynamic = "force-dynamic";

export default async function IPOsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams?.q.toLowerCase() : "";

  let rawIpos = await getIPOs();
  
  if (q) {
    rawIpos = rawIpos.filter((ipo) => {
      const name = ipo.company?.name || ipo.name || "Unknown Company";
      return name.toLowerCase().includes(q) || ipo.slug.includes(q);
    });
  }
  
  const mappedIpos = rawIpos.map(ipo => {
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
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-muted/10 py-8 border-b border-border/50">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight">All Live & Upcoming IPOs</h1>
          <p className="text-muted-foreground mt-2">Browse the complete, real-time database of Mainboard and SME IPOs.</p>
        </div>
      </div>
      <LiveIpoTable ipos={mappedIpos} />
    </div>
  );
}
