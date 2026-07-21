import React from "react";
import { BookOpenText } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniStoryProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniStory: React.FC<AlumniStoryProps> = ({ alumnus }) => {
  const storyText = alumnus.ravenshawStory || alumnus.bio;

  if (!storyText || typeof storyText !== "string" || storyText.trim().length === 0) {
    return null;
  }

  const paragraphs = storyText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <section aria-labelledby="alumni-story-heading" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rm-glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <BookOpenText className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-story-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              My Ravenshaw Story
            </h2>
            <p className="text-xs text-white/70">
              Personal reflections and memories across generations.
            </p>
          </div>
        </div>

        <div className="max-w-3xl space-y-4 text-sm sm:text-base text-white/85 leading-relaxed">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-7">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
