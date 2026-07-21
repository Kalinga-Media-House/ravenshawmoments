"use client";

import React from "react";
import Link from "next/link";
import { Shield, HeartHandshake, Trophy, Music, BookOpen, Users, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ORGANIZATIONS = [
  {
    id: "ncc",
    label: "SERVICE & LEADERSHIP",
    shortName: "NCC",
    title: "National Cadet Corps",
    description: "Building discipline, leadership, courage, service, and friendships through experiences that remain for life.",
    href: "/organizations/ncc",
    buttonText: "Explore NCC",
    icon: Shield,
    hasLogo: false,
  },
  {
    id: "nss",
    label: "SOCIAL RESPONSIBILITY",
    shortName: "NSS",
    title: "National Service Scheme",
    description: "Connecting students through community service, social responsibility, meaningful action, and memories created while serving together.",
    href: "/organizations/nss",
    buttonText: "Explore NSS",
    icon: HeartHandshake,
    hasLogo: false,
  },
  {
    id: "sports",
    label: "ATHLETICS",
    shortName: "SPORTS",
    title: "Sports Community",
    description: "Celebrating teamwork, determination, sporting achievements, campus competitions, and the friendships created beyond the field.",
    href: "/organizations/sports",
    buttonText: "Explore Sports",
    icon: Trophy,
    hasLogo: false,
  },
  {
    id: "cultural",
    label: "ARTS & TRADITIONS",
    shortName: "CULTURE",
    title: "Cultural Community",
    description: "A space where creativity, music, dance, theatre, art, traditions, and unforgettable performances bring Ravenshawvians together.",
    href: "/organizations/cultural",
    buttonText: "Explore Culture",
    icon: Music,
    hasLogo: false,
  },
  {
    id: "literary",
    label: "IDEAS & EXPRESSION",
    shortName: "LITERARY",
    title: "Literary Community",
    description: "Encouraging ideas, writing, debate, expression, creativity, and conversations that inspire generations of students.",
    href: "/organizations/literary",
    buttonText: "Explore Literary",
    icon: BookOpen,
    hasLogo: false,
  },
  {
    id: "more",
    label: "STUDENT LIFE",
    shortName: "ALL GROUPS",
    title: "More Campus Communities",
    description: "Discover student clubs, societies, associations, volunteering groups, creative communities, and the people shaping campus life.",
    href: "/organizations",
    buttonText: "Explore All",
    icon: Users,
    hasLogo: false,
  }
];

export const OrganizationsShowcaseSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section className="campus-communities-section relative w-full overflow-hidden bg-transparent z-20" style={{ padding: 'clamp(34px, 4vw, 56px) clamp(18px, 4vw, 40px)' }} ref={revealRef as React.RefObject<HTMLElement>}>
      
      {/* Background Ambience Layer */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,var(--color-rm-gold)_0%,transparent_70%)] pointer-events-none opacity-5" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,var(--color-rm-bg-wine)_0%,transparent_70%)] pointer-events-none opacity-20" />

      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mx-auto rm-reveal" style={{ maxWidth: '720px', marginBottom: 'clamp(28px, 3vw, 38px)' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '14px' }}>
            <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-rm-gold)]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-[var(--color-rm-gold)] uppercase">
              Campus Communities
            </span>
            <span className="w-6 sm:w-8 h-[2px] bg-[var(--color-rm-gold)]" />
          </div>
          
          <h2 className="font-extrabold rm-heading-primary tracking-tight text-balance" style={{ fontSize: 'clamp(38px, 4vw, 54px)', lineHeight: '1.05', marginBottom: '18px' }}>
            <span className="text-black">Where Passions</span> <br className="hidden md:block" /><span className="heading-highlight">Become Communities</span>
          </h2>
          
          <p className="rm-text-body font-medium" style={{ fontSize: 'clamp(14px, 1.2vw, 17px)', lineHeight: '1.65', marginInline: 'auto', margin: 0 }}>
            Beyond classrooms, students discover their voices, build friendships, develop leadership, serve society, and create unforgettable experiences through communities that become an important part of their Ravenshaw journey.
          </p>
        </div>

        <style>{`
          .community-grid {
            width: 100%;
            max-width: 1080px;
            margin-inline: auto;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
            min-width: 0;
            box-sizing: border-box;
          }
          .community-card {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-width: 0;
            height: 245px;
            padding: 20px;
            overflow: hidden;
            border-radius: 16px;
            background: linear-gradient(145deg, rgba(126, 0, 36, 0.92), rgba(92, 0, 27, 0.96));
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 10px 28px rgba(76, 0, 22, 0.14);
            box-sizing: border-box;
            text-decoration: none;
            transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease, border-color 350ms ease;
          }
          .community-card-content {
            min-width: 0;
          }
          .community-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 18px 40px rgba(55, 0, 17, 0.25);
            border-color: rgba(244, 196, 48, 0.35);
          }
          .community-icon-container {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          .community-icon-container svg {
            width: 27px;
            height: 27px;
            color: #f4c430;
          }
          .community-category {
            position: absolute;
            top: 20px;
            right: 20px;
            max-width: 155px;
            padding: 4px 9px;
            border-radius: 999px;
            font-size: 9px;
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            white-space: normal;
            text-align: center;
            background: rgba(233, 185, 54, 0.15);
            border: 1px solid rgba(233, 185, 54, 0.45);
            color: #F4CB58;
          }
          .community-card-title {
            margin-top: 17px;
            color: #ffffff;
            font-size: clamp(18px, 1.4vw, 21px);
            line-height: 1.15;
            font-weight: 800;
            margin-bottom: 0;
          }
          .community-subtitle {
            margin-top: 3px;
            color: rgba(255, 255, 255, 0.92);
            font-size: 12px;
            line-height: 1.35;
            font-weight: 600;
            margin-bottom: 0;
          }
          .community-description {
            margin-top: 13px;
            color: rgba(255, 255, 255, 0.76);
            font-size: 12px;
            line-height: 1.55;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            margin-bottom: 0;
          }
          .community-card-link {
            margin-top: auto;
            padding-top: 13px;
            color: #f4c430;
            font-size: 12px;
            line-height: 1.2;
            font-weight: 700;
            display: flex;
            align-items: center;
            transition: color 350ms ease;
          }
          .community-card:hover .community-card-link {
            color: #ffffff;
          }
          .community-card-link svg {
            width: 18px;
            height: 18px;
            margin-left: 6px;
            transition: transform 350ms ease;
          }
          .community-card:hover .community-card-link svg {
            transform: translateX(4px);
          }
          
          /* Large Desktop */
          @media (min-width: 1441px) {
            .community-grid {
              max-width: 1100px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 18px;
            }
            .community-card {
              height: 240px;
            }
          }

          /* Laptop */
          @media (min-width: 1024px) and (max-width: 1440px) {
            .community-grid {
              max-width: 1040px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 14px;
            }
            .community-card {
              height: 225px;
              padding: 18px;
            }
            .community-icon-container {
              width: 43px;
              height: 43px;
            }
            .community-icon-container svg {
              width: 24px;
              height: 24px;
            }
            .community-card-title {
              margin-top: 13px;
              font-size: 18px;
            }
            .community-description {
              margin-top: 9px;
              font-size: 11.5px;
              line-height: 1.45;
            }
            .community-card-link {
              padding-top: 10px;
              font-size: 11.5px;
            }
          }

          /* Tablet */
          @media (min-width: 768px) and (max-width: 1023px) {
            .community-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              max-width: 720px;
              gap: 15px;
            }
            .community-card {
              height: 230px;
            }
          }

          /* Mobile */
          @media (max-width: 767px) {
            .community-grid {
              grid-template-columns: 1fr;
              width: 100%;
              gap: 14px;
            }
            .community-card {
              width: 100%;
              height: auto;
              min-height: 220px;
              padding: 18px;
              border-radius: 14px;
            }
          }
        `}</style>

        {/* Organizations Grid */}
        <div className="community-grid">
          {ORGANIZATIONS.map((org, index) => (
            <div
              key={org.id}
              className="rm-reveal flex flex-col min-w-0"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link 
                href={org.href}
                className="community-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B936] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F9F6F0]"
              >
                {/* Header: Logo and Badge */}
                <div className="flex items-start justify-between min-w-0">
                  <div className="community-icon-container flex-shrink-0">
                    <org.icon strokeWidth={1.5} />
                  </div>
                  
                  <span className="community-category">
                    {org.label}
                  </span>
                </div>

                {/* Text Content */}
                <div className="community-card-content flex flex-col flex-grow">
                  <h3 className="community-card-title">
                    {org.shortName}
                  </h3>
                  <h4 className="community-subtitle">
                    {org.title}
                  </h4>
                  <p className="community-description">
                    {org.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="community-card-link">
                  <span>
                    {org.buttonText}
                  </span>
                  <ArrowRight strokeWidth={2.5} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

