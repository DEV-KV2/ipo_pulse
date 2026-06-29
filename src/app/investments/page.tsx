import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InvestmentsPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Investments</h1>
      <div className="bg-card p-12 rounded-lg border shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-2">No Investments Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          You haven't made any investments yet. Once you start investing in IPOs or stocks, they will appear here.
        </p>
      </div>
    </div>
  );
}
