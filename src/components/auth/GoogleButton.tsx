"use client";

import Image from "next/image";

export default function GoogleButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-rm-glass-border)] bg-white/5 py-3 font-medium text-[var(--color-rm-text-primary)] transition hover:bg-[var(--color-rm-gold)]/20 hover:border-[var(--color-rm-gold)]/50"
    >
      <Image
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        width={20}
        height={20}
        className="h-5 w-5"
        alt="Google"
      />
      Continue with Google
    </button>
  );
}