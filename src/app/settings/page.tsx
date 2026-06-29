import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <div className="bg-card p-6 rounded-lg border shadow-sm max-w-2xl">
        <p className="text-muted-foreground mb-4">
          Settings configuration is coming soon. 
        </p>
        <p className="text-sm text-muted-foreground">
          Currently, you can manage your email address and basic profile information from the Profile tab.
        </p>
      </div>
    </div>
  );
}
