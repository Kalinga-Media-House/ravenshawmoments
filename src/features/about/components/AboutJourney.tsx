import React from "react";
import { Camera, Save, Network, RefreshCcw, Sparkles } from "lucide-react";

const journeyStages = [
  {
    icon: Camera,
    title: "1. Experience",
    description:
      "A moment is created in a classroom, department, hostel, organization, event, competition, or friendship.",
  },
  {
    icon: Save,
    title: "2. Preserve",
    description:
      "The photograph, memory, achievement, event, or story is added to Ravenshaw Moments.",
  },
  {
    icon: Network,
    title: "3. Connect",
    description:
      "The moment becomes connected with the people, department, batch, hostel, organization, and year that shaped it.",
  },
  {
    icon: RefreshCcw,
    title: "4. Rediscover",
    description:
      "Years later, Ravenshawvians can return and rediscover a chapter of life that might otherwise have been forgotten.",
  },
  {
    icon: Sparkles,
    title: "5. Inspire",
    description:
      "Preserved journeys help future generations understand the people, experiences, and stories that continue shaping Ravenshaw.",
  },
];

export const AboutJourney: React.FC = () => {
  return (
    <section
      aria-labelledby="about-journey-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2
            id="about-journey-heading"
            className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight"
          >
            From a Moment to a Legacy
          </h2>
          <p className="text-sm text-[#8F0028] font-bold tracking-wider uppercase">
            Designed for long-term preservation
          </p>
        </div>

        <div className="relative">
          {/* Timeline connecting line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-[28px] left-[40px] right-[40px] h-[2px] bg-white" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {journeyStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.title} className="relative flex flex-col gap-4">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFFDF8] border-2 border-[#E8B83F]/40 flex items-center justify-center text-[#8F0028] shrink-0 shadow-lg">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-black text-[#171214] mt-1 lg:mt-0">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#756A6E] leading-relaxed font-medium pl-[4.5rem] lg:pl-0">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
