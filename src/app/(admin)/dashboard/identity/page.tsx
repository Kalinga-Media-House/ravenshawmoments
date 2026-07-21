import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function IdentityDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Identity & Access Center</h1>
        <p className="text-gray-500">Manage digital identities, verification requests, and access logs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Pending</div>
            <p className="text-xs text-muted-foreground">+3 since last hour</p>
            <Link href="/dashboard/identity/verifications" className="inline-block mt-2">
              <Button variant="link" className="px-0">Review Requests →</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active ID Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">Across all user types</p>
            <Link href="/dashboard/identity/cards" className="inline-block mt-2">
              <Button variant="link" className="px-0">Manage Cards →</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Logs (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">Scans & Logins</p>
            <Link href="/dashboard/identity/access-logs" className="inline-block mt-2">
              <Button variant="link" className="px-0">View Logs →</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Failed Scans / Untrusted Devices</p>
            <Link href="/dashboard/identity/access-logs" className="inline-block mt-2">
              <Button variant="link" className="px-0 text-red-600">Investigate →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
