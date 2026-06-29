import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIPODetails } from "@/app/actions/ipo";
import { notFound } from "next/navigation";
import { Share2, BookmarkPlus, Download } from "lucide-react";
import { SubscriptionChart } from "@/components/ipo/subscription-chart";
import { AIChat } from "@/components/ipo/ai-chat";
import { IpoActions } from "@/components/ipo/ipo-actions";
import { AIReportWidget } from "@/components/ipo/ai-report-widget";

export const dynamic = "force-dynamic";

// Next.js 15 App router expects params as a Promise for dynamic routes
export default async function IPODetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const ipo = await getIPODetails(slug);

  if (!ipo) {
    notFound();
  }

  const latestGmp = ipo.gmpHistory?.[0]?.gmp || 0;
  const estimatedPrice = (ipo.priceBandHigh || 0) + latestGmp;
  const gainPercent = ipo.priceBandHigh ? ((latestGmp / ipo.priceBandHigh) * 100).toFixed(2) : 0;


  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{ipo.company.name} IPO</h1>
            <Badge variant={ipo.status === "OPEN" ? "default" : "secondary"} className="text-sm">
              {ipo.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">{ipo.company.sector} | Issue Size: ₹{ipo.issueSize} Cr</p>
        </div>
        <div className="flex items-center gap-2">
        <IpoActions ipoName={ipo.company.name} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* IPO Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>IPO Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Price Band:</span> <span className="font-medium">₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh}</span></div>
            <div><span className="text-muted-foreground">Lot Size:</span> <span className="font-medium">{ipo.lotSize} Shares</span></div>
            <div><span className="text-muted-foreground">Face Value:</span> <span className="font-medium">₹{ipo.faceValue}</span></div>
            <div><span className="text-muted-foreground">Issue Type:</span> <span className="font-medium">{ipo.issueType}</span></div>
            <div><span className="text-muted-foreground">Listing At:</span> <span className="font-medium">{ipo.exchange}</span></div>
            <div><span className="text-muted-foreground">Registrar:</span> <span className="font-medium">{ipo.registrar || "N/A"}</span></div>
          </CardContent>
        </Card>

        {/* Live GMP Widget */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Live GMP Widget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-muted-foreground">Current GMP</p>
                <h3 className="text-3xl font-bold text-green-500">₹{latestGmp}</h3>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/10">+{gainPercent}%</Badge>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Listing Price</span>
                <span className="font-medium">₹{estimatedPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Live Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionChart data={ipo.subscriptions} />
          </CardContent>
        </Card>

        {/* Timelines */}
        <Card>
          <CardHeader>
            <CardTitle>IPO Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open Date</span>
              <span className="font-medium">{ipo.openDate ? new Date(ipo.openDate).toLocaleDateString() : "TBA"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Close Date</span>
              <span className="font-medium">{ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString() : "TBA"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Basis of Allotment</span>
              <span className="font-medium">{ipo.basisOfAllotmentDate ? new Date(ipo.basisOfAllotmentDate).toLocaleDateString() : "TBA"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Refunds Initiated</span>
              <span className="font-medium">{ipo.refundInitiatedDate ? new Date(ipo.refundInitiatedDate).toLocaleDateString() : "TBA"}</span>
            </div>
            <div className="flex justify-between text-primary font-medium">
              <span>Listing Date</span>
              <span>{ipo.listingDate ? new Date(ipo.listingDate).toLocaleDateString() : "TBA"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Company Overview & Financials */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{ipo.company.about}</p>
            <div className="grid gap-4 mt-4">
              <div>
                <h4 className="font-semibold mb-1">Business Model</h4>
                <p className="text-sm text-muted-foreground">{ipo.company.businessModel || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Competitive Landscape</h4>
                <p className="text-sm text-muted-foreground">{ipo.company.competitiveLandscape || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time AI Insight */}
        <AIReportWidget 
          ipoContext={{ 
            name: ipo.company.name, 
            sector: ipo.company.sector, 
            status: ipo.status, 
            priceBandLow: ipo.priceBandLow, 
            priceBandHigh: ipo.priceBandHigh, 
            issueSize: ipo.issueSize, 
            gmp: latestGmp, 
            gainPct: gainPercent 
          }} 
        />
      </div>
      
      {/* Company Financials */}
      {ipo.company.financials && ipo.company.financials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Company Financials (₹ in Crores)</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Period</th>
                  <th className="px-4 py-3 font-medium text-right">Revenue</th>
                  <th className="px-4 py-3 font-medium text-right">Profit After Tax</th>
                  <th className="px-4 py-3 font-medium text-right">Net Worth</th>
                  <th className="px-4 py-3 font-medium text-right">EPS (₹)</th>
                  <th className="px-4 py-3 font-medium text-right">ROE (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {ipo.company.financials.map((fin: any, i: number) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{fin.year}</td>
                    <td className="px-4 py-3 text-right">{fin.revenue}</td>
                    <td className="px-4 py-3 text-right text-green-500">{fin.profit}</td>
                    <td className="px-4 py-3 text-right">{fin.netWorth}</td>
                    <td className="px-4 py-3 text-right">{fin.eps}</td>
                    <td className="px-4 py-3 text-right">{fin.roe}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      
      {/* AI Chat Interface */}
      <div className="mt-8">
        <AIChat ipo={ipo} />
      </div>
    </div>
  );
}
