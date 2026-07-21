import { requireAuth } from "@/auth/guards/require-auth";
import Link from "next/link";
import { Suspense } from "react";

export default async function DepartmentDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/department/dashboard" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Department Admin CMS</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/department/dashboard" className="text-sm font-medium transition-colors hover:text-foreground/80">Dashboard</Link>
              <Link href="/department/settings" className="text-sm font-medium transition-colors hover:text-foreground/80">Settings</Link>
              <Link href="/department/faculty" className="text-sm font-medium transition-colors hover:text-foreground/80">Faculty</Link>
              <Link href="/department/students" className="text-sm font-medium transition-colors hover:text-foreground/80">Students</Link>
              <Link href="/department/programs" className="text-sm font-medium transition-colors hover:text-foreground/80">Programs</Link>
              <Link href="/department/gallery" className="text-sm font-medium transition-colors hover:text-foreground/80">Gallery</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <nav className="grid items-start gap-2">
            <Link href="/department/content" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Content</Link>
            <Link href="/department/achievements" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Achievements</Link>
            <Link href="/department/media" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Media</Link>
            <Link href="/department/verification" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Verifications</Link>
            <Link href="/department/analytics" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">Analytics</Link>
            <Link href="/department/seo" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">SEO</Link>
          </nav>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

