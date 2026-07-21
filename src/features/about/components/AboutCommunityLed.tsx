import React from "react";
import { Users } from "lucide-react";

export const AboutCommunityLed: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#8F0028]/5 border-y border-[#8F0028]/10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#8F0028]/10 border border-[#E8B83F]/30 mx-auto flex items-center justify-center text-[#8F0028]">
             <Users className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#171214] tracking-tight">
            Preserved by the People Who Lived It
          </h2>
          <div className="space-y-4 text-sm text-[#756A6E] leading-relaxed font-medium">
            <p>
              Ravenshaw&apos;s story cannot be preserved by one person or one page. It lives across thousands of photographs, friendships, departments, hostels, events, achievements, and personal experiences.
            </p>
            <p>
              Ravenshaw Moments grows through the people who choose to preserve and share their approved stories responsibly.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#756A6E] font-medium max-w-3xl mx-auto pt-4">
          <li className="flex items-start gap-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>Students preserve their journeys</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>Alumni reconnect generations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>Teachers preserve academic connections</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>CRs support department representation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>BMCs support hostel representation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>Organizations preserve activities and contributions</span>
          </li>
          <li className="flex items-start gap-2 sm:col-span-2">
            <span className="text-[#8F0028] mt-1">•</span>
            <span>Administrators support moderation, safety, accuracy, and platform integrity</span>
          </li>
        </ul>
      </div>
    </section>
  );
};
