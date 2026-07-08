import Link from "next/link";
import { UserX } from "lucide-react";

export default function DashboardProfileNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <UserX className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Record Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We could not find your identity profile record in the database. Please contact administration or complete onboarding.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Return to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium shadow-2xs transition-colors hover:bg-muted hover:text-foreground"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
