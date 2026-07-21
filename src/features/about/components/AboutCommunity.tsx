import React from "react";
import { BookOpen, GraduationCap, Library, KeyRound, Key, Tent } from "lucide-react";

const participants = [
  {
    icon: BookOpen,
    title: "Students",
    description:
      "Create a profile, preserve photographs, share memories, discover events, participate in competitions, celebrate achievements, and remain connected with your department, batch, hostel, and organizations.",
  },
  {
    icon: GraduationCap,
    title: "Alumni",
    description:
      "Preserve your journey, reconnect with earlier chapters of Ravenshaw life, share memories, celebrate achievements, and remain part of the community across generations.",
  },
  {
    icon: Library,
    title: "Teachers",
    description:
      "Preserve approved academic and institutional journeys, connect with departments, and remain part of the stories shaped through teaching and mentorship.",
  },
  {
    icon: KeyRound,
    title: "Department CRs",
    description:
      "Help represent the department, preserve approved department memories, share events, photographs, achievements, announcements, and stories, and support the creation of student and teacher profiles where authorized.",
  },
  {
    icon: Key,
    title: "Hostel BMCs",
    description:
      "Help preserve approved hostel life by sharing events, celebrations, photographs, achievements, memories, announcements, and hostel stories, and support profile creation where authorized.",
  },
  {
    icon: Tent,
    title: "Organizations",
    description:
      "Preserve approved activities, events, service, leadership, achievements, photographs, and community contributions.",
  },
];

export const AboutCommunity: React.FC = () => {
  return (
    <section
      aria-labelledby="about-community-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2
            id="about-community-heading"
            className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight"
          >
            A Place for Every Ravenshaw Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {participants.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="bg-white shadow-sm p-6 rounded-2xl border border-[#8F0028]/10 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#8F0028]/10 flex items-center justify-center text-[#171214]">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#8F0028]">
                  {role.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#756A6E] leading-relaxed font-medium">
                  {role.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
