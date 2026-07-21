import { getMyDevices } from '@/features/identity/actions/identity.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LaptopIcon, SmartphoneIcon, MapPinIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function DevicesPage() {
  const devices = await getMyDevices();

  return (
    <div className="container py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Devices</h1>
        <p className="text-gray-500 mt-2">View and manage devices logged into your account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Devices</CardTitle>
          <CardDescription>If you see a device you do not recognize, remove it immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.length === 0 && <p className="text-sm text-gray-500">No devices found.</p>}
            {devices.map((device: any) => (
              <div key={device.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="mt-1 p-2 bg-gray-100 rounded-full">
                    {device.os?.toLowerCase().includes('ios') || device.os?.toLowerCase().includes('android') ? (
                      <SmartphoneIcon className="w-5 h-5 text-gray-700" />
                    ) : (
                      <LaptopIcon className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {device.os || 'Unknown OS'} - {device.browser || 'Unknown Browser'}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {device.ip_address} {device.country ? `(${device.country})` : ''}
                      </span>
                      <span>Last active: {formatDistanceToNow(new Date(device.last_used_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <Button variant="destructive" size="sm">Remove</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
