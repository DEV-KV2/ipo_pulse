import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-card p-6 rounded-lg border shadow-sm max-w-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="text-lg">{session.user?.name || "Not provided"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{session.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
