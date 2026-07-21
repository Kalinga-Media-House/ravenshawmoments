import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-6 p-6 text-muted-foreground">
      <div className="relative w-16 h-16 animate-pulse">
        <Image
          src="/logo.webp"
          alt="Loading..."
          fill
          className="object-contain"
          sizes="64px"
          priority
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" aria-label="Loading..." />
        <p className="text-xs font-medium tracking-wide uppercase">Loading...</p>
      </div>
    </div>
  );
}
