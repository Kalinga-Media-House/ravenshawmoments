import { AccessLogRepository } from '@/features/identity/repositories/AccessLogRepository';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function AdminAccessLogsPage() {
  const logs = await AccessLogRepository.getAllLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security & Access Logs</h1>
        <p className="text-gray-500">System-wide audit trail of QR scans and logins.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Top 500 recent events.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Event Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Device Info</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs?.map((log: any) => (
                  <tr key={log.id} className="border-b">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {log.profiles?.full_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 capitalize">{log.log_type.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={log.success ? 'default' : 'destructive'}>
                        {log.success ? 'Success' : 'Failed'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {log.identity_devices ? `${log.identity_devices.os} / ${log.identity_devices.browser}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ip_address || 'N/A'}</td>
                  </tr>
                ))}
                {!logs?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No logs found.</td>
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
