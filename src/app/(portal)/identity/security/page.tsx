import { createClient } from '@/lib/supabase/server';
import { AccessLogRepository } from '@/features/identity/repositories/AccessLogRepository';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ShieldCheckIcon, ShieldAlertIcon } from 'lucide-react';

export default async function SecurityLogsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const logs = await AccessLogRepository.getUserLogs(user.id);

  return (
    <div className="container py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security & Access Logs</h1>
        <p className="text-gray-500 mt-2">A history of when and where your identity was used.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Includes logins and physical QR scans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
            {logs.map((log: any) => (
              <div key={log.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="mt-1">
                    {log.success ? (
                      <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                    ) : (
                      <ShieldAlertIcon className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="capitalize">{log.log_type.replace('_', ' ')}</span>
                      {!log.success && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Failed</span>}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                      <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                      {log.identity_devices && (
                        <span>Device: {log.identity_devices.os} - {log.identity_devices.browser}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
