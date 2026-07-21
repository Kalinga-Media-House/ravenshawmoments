import React from "react";
import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NewsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-24 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-[var(--color-rm-gold)]/10 text-[var(--color-rm-gold)] rounded-2xl mb-6 border border-[var(--color-rm-gold)]/20 shadow-[0_0_30px_rgba(217,164,65,0.15)]">
        <SearchX className="w-12 h-12" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-3xl md:text-4xl font-extrabold rm-heading-primary mb-4">
        Publication Not Found
      </h2>
      
      <p className="text-[1.05rem] rm-text-body max-w-lg mb-10 font-medium">
        We couldn't find the news, story, or publication you're looking for. It may have been removed, archived, or the link might be incorrect.
      </p>
      
      <Link 
        href="/news"
        className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[var(--color-rm-gold)] to-[#E8B854] text-[#12070B] font-bold rounded-xl hover:shadow-[0_10px_25px_rgba(217,164,65,0.3)] hover:-translate-y-1 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to News Directory
      </Link>
    </div>
  );
}
