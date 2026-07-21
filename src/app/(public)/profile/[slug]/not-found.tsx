import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center container max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6 rounded-3xl border border-[var(--color-rm-gold)]/30 bg-black/60 backdrop-blur-md p-8 shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-rm-maroon)] text-[var(--color-rm-gold)] border border-[var(--color-rm-gold)]/40">
          <UserX className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Profile Not Found
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            The profile you are looking for may be unavailable or is not currently
            shared publicly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/alumni"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[var(--color-rm-gold)] shadow transition-colors hover:bg-[var(--color-rm-maroon)]/80"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Community</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          >
            Explore Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
