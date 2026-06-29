import { getCompanies, getIPOs } from "../actions/ipo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyncButton } from "./sync-button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const ipos = await getIPOs();
  const companies = await getCompanies();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage IPOs, Companies, and Platform Data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total IPOs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ipos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent IPOs</CardTitle>
            <CardDescription>A list of recently added IPOs in the database.</CardDescription>
          </div>
          <div className="flex gap-2">
            <SyncButton />
            <Button>Add New IPO</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Open Date</TableHead>
                <TableHead>Issue Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ipos.map((ipo) => (
                <TableRow key={ipo.id}>
                  <TableCell className="font-medium">{ipo.company.name}</TableCell>
                  <TableCell>{ipo.slug}</TableCell>
                  <TableCell>
                    <Badge variant={ipo.status === "OPEN" ? "default" : "secondary"}>
                      {ipo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ipo.openDate ? new Date(ipo.openDate).toLocaleDateString() : "TBA"}</TableCell>
                  <TableCell>{ipo.issueSize ? `₹${ipo.issueSize} Cr` : "TBA"}</TableCell>
                </TableRow>
              ))}
              {ipos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No IPOs found. Click "Add New IPO" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
