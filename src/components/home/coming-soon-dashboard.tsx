import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function ComingSoonDashboard({ title }: { title: string }) {
  return (
    <section className="container px-4 md:px-6 py-8">
      <Card className="border-border/50 bg-card/30 flex items-center justify-center min-h-[400px]">
        <CardContent className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title} Dashboard</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We are working hard to bring you the best {title.toLowerCase()} trading experience. Stay tuned for advanced analytics, screeners, and direct investments.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
