"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, UsersRound, BookOpenCheck, Landmark, Building2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CommunityRole {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const COMMUNITY_ROLES: CommunityRole[] = [
  {
    id: "role-students",
    title: "Students",
    description: "Preserve your journey, discover events, celebrate achievements, share memories, and stay connected with your community.",
    icon: <GraduationCap className="w-5 h-5 text-[#F4BE32]" aria-hidden="true" />
  },
  {
    id: "role-alumni",
    title: "Alumni",
    description: "Reconnect with your batch, revisit memories, share your journey, celebrate milestones, and inspire future generations.",
    icon: <UsersRound className="w-5 h-5 text-[#F4BE32]" aria-hidden="true" />
  },
  {
    id: "role-teachers",
    title: "Teachers",
    description: "Preserve academic journeys, celebrate departmental history, share achievements, and remain connected with generations of students.",
    icon: <BookOpenCheck className="w-5 h-5 text-[#F4BE32]" aria-hidden="true" />
  },
  {
    id: "role-crs",
    title: "Department CRs",
    description: "Represent your department, create student and teacher profiles, share events, preserve memories, and celebrate achievements.",
    icon: <Landmark className="w-5 h-5 text-[#F4BE32]" aria-hidden="true" />
  },
  {
    id: "role-bmc",
    title: "Hostel BMC Members",
    description: "Represent hostel communities, create hostel profiles, preserve traditions, share celebrations, post events, and keep hostel memories alive.",
    icon: <Building2 className="w-5 h-5 text-[#F4BE32]" aria-hidden="true" />
  }
];

export const JoinCommunitySection = () => {
  const revealRef = useScrollReveal({ selector: ".rm-reveal", staggerDelay: 100 });

  return (
    <section 
      ref={revealRef as React.RefObject<HTMLDivElement>}
      className="relative w-full z-20 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #3A000F 0%, #590018 40%, #760021 72%, #4A0014 100%)",
        height: "auto",
        minHeight: "auto",
      }}
    >
      <style>{`
        .story-cta-section-wrapper {
          padding-top: clamp(48px, 6vw, 72px);
          padding-bottom: clamp(48px, 6vw, 72px);
        }
        
        /* Entrance Animation for Content & Cards */
        .rm-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 600ms ease-out, transform 600ms ease-out;
        }
        .rm-reveal-active.rm-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        /* Subtle Background Glow */
        .bg-glow-anim {
          animation: slowPulse 12s ease-in-out infinite alternate;
        }
        @keyframes slowPulse {
          0% { transform: scale(1) translate(0, 0); opacity: 0.04; }
          100% { transform: scale(1.05) translate(15px, 15px); opacity: 0.08; }
        }

        /* Primary Button Hover */
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(244, 190, 50, 0.25);
        }
        .btn-primary:hover svg {
          transform: translateX(4px);
        }

        /* Secondary Button Hover */
        .btn-secondary:hover {
          background: #FFFFFF;
          color: #3A000F;
          transform: translateY(-3px);
        }

        /* Feature Card Design & Hover */
        .feature-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          transition: transform 300ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 300ms cubic-bezier(0.25, 1, 0.5, 1), border-color 300ms ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .feature-card:hover {
            transform: translateY(-6px) scale(1.015);
            border-color: rgba(244, 190, 50, 0.4);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 0 20px rgba(244, 190, 50, 0.1);
          }
          .feature-card:hover .feature-icon {
            transform: translateY(-2px);
          }
        }
        .feature-icon {
          transition: transform 300ms cubic-bezier(0.25, 1, 0.5, 1);
        }
      `}</style>

      {/* Decorative Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft maroon/gold glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(244,190,50,0.15)_0%,transparent_70%)] blur-[80px] bg-glow-anim" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(169,0,50,0.4)_0%,transparent_70%)] blur-[100px] bg-glow-anim" style={{ animationDelay: '-5s' }} />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/noise.png')] mix-blend-overlay" />
      </div>

      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1200px] story-cta-section-wrapper">
        
        {/* Main Content Area */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24 rm-reveal">
          
          <h2 className="text-[clamp(32px,4.2vw,62px)] font-[800] leading-[1.1] md:leading-[1.05] mb-8 tracking-tight text-balance max-w-[900px] mx-auto text-[#FFFFFF]">
            Your Ravenshaw Journey <br className="hidden md:block" />
            <span className="text-[#F4BE32]">Deserves to Live Forever</span>
          </h2>
          
          <p className="text-[clamp(15px,1.5vw,17px)] leading-[1.7] max-w-[760px] mb-8 sm:mb-10 text-[rgba(255,255,255,0.82)] mx-auto">
            Every friendship, achievement, celebration, classroom memory, hostel story, and shared experience becomes part of Ravenshaw&apos;s living legacy. Create your profile, reconnect with your community, preserve the moments that shaped you, and leave your story for generations to come.
          </p>

          <p className="text-[clamp(16px,1.8vw,20px)] leading-[1.55] font-serif italic font-[500] max-w-[720px] mb-12 text-[#F6C94C] mx-auto">
            “Years may pass and paths may change, but the memories we created at Ravenshaw will always bring us home.”
          </p>

          {/* Primary and Secondary Actions */}
          <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 max-w-[340px] sm:max-w-none mx-auto">
            <Link 
              href="/register"
              className="btn-primary flex items-center justify-center w-full sm:w-auto bg-[#F4BE32] text-[#3A000F] px-7 h-[50px] rounded-full text-[15px] sm:text-[16px] font-[700] tracking-wide transition-all duration-280 shadow-[0_4px_12px_rgba(244,190,50,0.15)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(244,190,50,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#590018]"
            >
              <span className="whitespace-nowrap">Join Ravenshaw Moments</span>
              <ArrowRight className="w-[18px] h-[18px] ml-2 transition-transform duration-280" strokeWidth={2.5} aria-hidden="true" />
            </Link>
            
            <Link 
              href="/departments"
              className="btn-secondary flex items-center justify-center w-full sm:w-auto bg-transparent border-[1.5px] border-[rgba(255,255,255,0.3)] text-[#FFFFFF] px-7 h-[50px] rounded-full text-[15px] sm:text-[16px] font-[700] tracking-wide transition-all duration-280 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(255,255,255,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#590018]"
            >
              <span className="whitespace-nowrap">Explore the Community</span>
            </Link>
          </div>

          {/* Returning User Action */}
          <div className="text-[14px] text-[rgba(255,255,255,0.72)] mt-2">
            Already part of Ravenshaw Moments?{" "}
            <Link 
              href="/login" 
              className="text-[#FFFFFF] font-[600] hover:underline decoration-[rgba(255,255,255,0.4)] underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(255,255,255,0.55)] rounded-sm px-1 py-0.5 -mx-1"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid (Restored) */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mx-auto">
          {COMMUNITY_ROLES.map((role, index) => (
            <div
              key={role.id}
              className="feature-card rm-reveal flex flex-col p-6 sm:p-7 flex-grow basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1.5rem)] xl:basis-[calc(20%-1.6rem)] xl:min-w-[220px]"
              style={{ transitionDelay: `${80 + (index * 100)}ms` }}
            >
              <div className="feature-icon flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(244,190,50,0.15)] mb-5 shrink-0">
                {role.icon}
              </div>
              <h3 className="text-[1.1rem] font-[800] text-[#FFFFFF] mb-3 tracking-tight">
                {role.title}
              </h3>
              <p className="text-[0.85rem] leading-relaxed font-medium text-[rgba(255,255,255,0.75)]">
                {role.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
