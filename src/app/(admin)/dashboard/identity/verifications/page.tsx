import { getVerificationQueue, approveIdentity, rejectIdentity } from '@/features/identity/actions/identity.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function AdminVerificationsPage() {
  const queue = await getVerificationQueue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Identity Verification Queue</h1>
        <p className="text-gray-500">Review and approve requests for digital identities.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests ({queue.length})</CardTitle>
          <CardDescription>Verify user documents and issue digital IDs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queue.length === 0 && <p className="text-sm text-gray-500">No pending requests.</p>}
            {queue.map((req: any) => (
              <div key={req.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {req.profiles?.avatar_url && (
                      <img src={req.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{req.profiles?.full_name} <span className="text-sm font-normal text-gray-500">({req.profiles?.email})</span></h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{req.identity_type.replace('_', ' ')}</Badge>
                      <span className="text-xs text-gray-500">{new Date(req.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/identity/verifications/${req.id}`}>
                    <Button variant="outline" size="sm">Review Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
