import { StocksDashboard } from "@/components/home/stocks-dashboard";

export default function StocksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="mt-8">
        <StocksDashboard />
      </div>
    </div>
  );
}
