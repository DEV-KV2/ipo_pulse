import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata = {
  title: "Pro Terminal | IPO Pulse",
  description: "Advanced TradingView terminal for indices and options.",
};

export default function TerminalPage() {
  return (
    <div className="w-full h-full bg-[#0e1117]">
      <DashboardView />
    </div>
  );
}
