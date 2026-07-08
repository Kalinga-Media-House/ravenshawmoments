export default function GlobalLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 p-6 text-muted-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" aria-label="Loading..." />
      <p className="text-xs font-medium tracking-wide uppercase animate-pulse">Loading Ravenshaw Moments...</p>
    </div>
  );
}
