import { IdentityRepository } from '@/features/identity/repositories/IdentityRepository';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function AdminCardsPage() {
  const identities = await IdentityRepository.getAllIdentities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Identities & Cards</h1>
        <p className="text-gray-500">Manage all issued digital identities.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identities Database ({identities?.length || 0})</CardTitle>
          <CardDescription>View status, issue date, and expiry.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">ID Number</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {identities?.map((id: any) => (
                  <tr key={id.id} className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {id.profiles?.full_name}
                      <div className="text-xs text-gray-500 font-normal">{id.profiles?.email}</div>
                    </td>
                    <td className="px-4 py-3">{id.identity_number}</td>
                    <td className="px-4 py-3 capitalize">{id.identity_type.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={id.status === 'active' ? 'default' : 'secondary'}>
                        {id.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{new Date(id.expiry_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </td>
                  </tr>
                ))}
                {!identities?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No identities found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
