import { getMyIdentity } from '@/features/identity/actions/identity.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer, PageHeader, PageGrid } from '@/features/shared/components/PageLayout';
import { StatusBadge } from '@/features/shared/components/StatusBadge';
import Link from 'next/link';
import { Shield, Smartphone, History, Award, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default async function IdentityPage() {
  const identity = await getMyIdentity();

  return (
    <PageContainer size="xl">
      <PageHeader
        title="Digital Identity Center"
        subtitle="Manage your official Ravenshaw digital identity, security devices, and verification status."
        badge={
          identity ? (
            <StatusBadge
              status={identity.status === 'active' ? 'verified' : 'pending'}
              label={identity.status === 'active' ? 'Verified Credential' : identity.status.toUpperCase()}
            />
          ) : (
            <StatusBadge status="unverified" label="Unverified" />
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Identity Status Card */}
        <Card className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <span>Credential Status</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your official university identity verification and membership details.
                </p>
              </div>
              {identity && (
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Award className="size-6" />
                </div>
              )}
            </div>

            {identity ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Identity Type
                  </span>
                  <p className="text-base font-bold text-foreground capitalize flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>{identity.identity_type.replace('_', ' ')}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Identity Number
                  </span>
                  <p className="text-base font-bold font-mono text-foreground">
                    {identity.identity_number}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1 sm:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status & Validity
                  </span>
                  <div className="flex items-center justify-between">
                    <StatusBadge
                      status={identity.status === 'active' ? 'verified' : 'pending'}
                      label={identity.status.toUpperCase()}
                    />
                    <span className="text-xs text-muted-foreground">
                      Valid thru {new Date(identity.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-border/80 bg-muted/30 text-center space-y-4">
                <div className="size-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="size-7" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-semibold text-foreground">No Verified Identity Found</h3>
                  <p className="text-sm text-muted-foreground">
                    You currently do not have an active university digital credential. Submit a verification request to unlock campus access and ID passes.
                  </p>
                </div>
                <Button variant="primary" className="rounded-xl">
                  Request Verification
                </Button>
              </div>
            )}
          </div>

          {identity && identity.status === 'active' && (
            <div className="pt-4 border-t border-border/60">
              <Link href="/identity/card" className="block w-full">
                <Button variant="primary" className="w-full sm:w-auto gap-2 py-6 text-base font-semibold rounded-xl">
                  <Award className="size-5" />
                  <span>Launch Digital ID Card Pass</span>
                  <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Sidebar Actions & Security Center */}
        <div className="space-y-6">
          <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Security & Devices</h3>
                <p className="text-xs text-muted-foreground">Manage trusted devices and sessions</p>
              </div>
            </div>
            <Link href="/identity/devices" className="block w-full">
              <Button variant="outline" className="w-full justify-between rounded-xl">
                <span>Manage Devices</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Button>
            </Link>
          </Card>

          <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <History className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Access Logs</h3>
                <p className="text-xs text-muted-foreground">View recent campus scan history</p>
              </div>
            </div>
            <Link href="/identity/security" className="block w-full">
              <Button variant="outline" className="w-full justify-between rounded-xl">
                <span>View Security Logs</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
