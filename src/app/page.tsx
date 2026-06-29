import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCards } from "@/components/home/featured-cards";
import { LiveIpoTable } from "@/components/home/live-ipo-table";

import { NewsSection } from "@/components/home/news-section";
import { StockRecommendationWidget } from "@/components/home/stock-recommendation-widget";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection activeTab="ipos" />

      <div id="dashboard" className="scroll-mt-8">
        {session?.user && <FeaturedCards />}
        
        <div className="container mx-auto px-4 mt-8 mb-20 flex flex-col gap-12">
          {/* Main Focus: Full-width IPO Dashboard */}
          <div className="w-full">
            <LiveIpoTable />
          </div>
          
          {/* Lower Section: AI Recommendations, Market Trend, and News */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NewsSection isLoggedIn={!!session?.user} />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <StockRecommendationWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-12">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">IPO Pulse AI</span>
              <span className="text-xs text-muted-foreground">© 2026. All rights reserved.</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md text-center md:text-right">
              Disclaimer: IPO investments carry risks. Data is for informational purposes only. Always consult a SEBI-registered advisor before investing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
