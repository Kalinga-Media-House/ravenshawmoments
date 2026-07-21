"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, BookOpen, Clock, CalendarDays } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Types
export interface EditorialItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentType: "Campus News" | "Stories" | "Publications";
  category: string;
  publishedAt: string; // ISO string
  authorName: string;
  authorType: string;
  image?: string;
  imageAlt?: string;
  featured: boolean;
  href: string;
  readingTime: string;
  publicationFormat?: string;
}

// Temporary homepage editorial data. Replace with approved Supabase news, story, and publication records when the content-management module is connected.
const TEMPORARY_EDITORIAL_DATA: EditorialItem[] = [
  {
    id: "edit-1",
    slug: "a-new-chapter",
    contentType: "Campus News",
    category: "Campus Life",
    title: "A New Chapter of Campus Stories",
    excerpt: "Discover the celebrations, ideas, activities, and shared experiences that continue shaping life across the Ravenshaw community.",
    publishedAt: "2026-07-15T10:00:00Z",
    authorName: "Ravenshaw Moments Editorial",
    authorType: "Community Editorial",
    readingTime: "3 min read",
    featured: true,
    href: "/news",
  },
  {
    id: "edit-2",
    slug: "friendships-beyond",
    contentType: "Stories",
    category: "Student Voices",
    title: "The Friendships We Carry Beyond College",
    excerpt: "Some friendships begin inside classrooms, departments, hostels, and campus corridors, then remain part of our lives long after graduation.",
    publishedAt: "2026-07-10T14:30:00Z",
    authorName: "Ravenshaw Moments Community",
    authorType: "Community Story",
    readingTime: "4 min read",
    featured: false,
    href: "/stories",
  },
  {
    id: "edit-3",
    slug: "ideas-creativity",
    contentType: "Publications",
    category: "Student Publication",
    title: "Ideas, Creativity and Voices From Campus",
    excerpt: "Explore writing, art, research, reflections, and creative expression contributed by members of the Ravenshaw community.",
    publishedAt: "2026-06-25T09:00:00Z",
    authorName: "Student Publication Community",
    authorType: "Publication",
    readingTime: "5 min read",
    publicationFormat: "Digital Publication",
    featured: false,
    href: "/publications",
  },
  {
    id: "edit-4",
    slug: "departments-opportunities",
    contentType: "Campus News",
    category: "Department Updates",
    title: "Departments Creating New Opportunities",
    excerpt: "Academic activities, student initiatives, seminars, collaborations, and achievements continue creating meaningful opportunities across departments.",
    publishedAt: "2026-06-15T11:15:00Z",
    authorName: "Ravenshaw Moments Editorial",
    authorType: "Community Editorial",
    readingTime: "3 min read",
    featured: false,
    href: "/news",
  },
  {
    id: "edit-5",
    slug: "hostel-life-home",
    contentType: "Stories",
    category: "Hostel Stories",
    title: "The Memories That Made Hostel Life Home",
    excerpt: "Shared meals, celebrations, conversations, friendships, and traditions transform hostel life into memories that remain forever.",
    publishedAt: "2026-05-20T16:45:00Z",
    authorName: "Hostel Community",
    authorType: "Community Story",
    readingTime: "4 min read",
    featured: false,
    href: "/stories",
  }
];

type FilterType = "Latest" | "Campus News" | "Stories" | "Publications";

const FILTERS: FilterType[] = ["Latest", "Campus News", "Stories", "Publications"];

export const NewsPublicationsSection = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Latest");
  const revealRef = useScrollReveal();

  // Memoized filtering logic
  const filteredData = useMemo(() => {
    if (activeFilter === "Latest") {
      return TEMPORARY_EDITORIAL_DATA;
    }
    return TEMPORARY_EDITORIAL_DATA.filter(item => item.contentType === activeFilter);
  }, [activeFilter]);

  const hasContent = filteredData.length > 0;
  
  // Helper for formatting date
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <section className="news-stories-section relative w-full bg-transparent z-20" style={{ padding: 'clamp(36px, 4vw, 58px) clamp(18px, 4vw, 40px)' }} ref={revealRef as React.RefObject<HTMLDivElement>}>
      <div className="container relative mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mx-auto rm-reveal" style={{ maxWidth: '760px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '14px' }}>
            <span className="w-6 sm:w-8 h-[2px] bg-[#5A0018]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-[#5A0018] uppercase">
              News, Stories and Publications
            </span>
            <span className="w-6 sm:w-8 h-[2px] bg-[#5A0018]" />
          </div>
          
          <h2 className="font-extrabold tracking-tight text-balance" style={{ fontSize: 'clamp(40px, 4.3vw, 58px)', lineHeight: '1.05', marginBottom: '18px', color: '#5A0018' }}>
            Stories From the <br className="hidden md:block" /><span style={{ color: '#A90032' }}>Heart of Ravenshaw</span>
          </h2>
          
          <p className="text-[#4F4548] font-medium" style={{ marginInline: 'auto', fontSize: 'clamp(14px, 1.2vw, 17px)', lineHeight: '1.6' }}>
            Discover campus updates, inspiring journeys, creative publications, department stories, hostel experiences, student voices, and moments shaping the Ravenshaw community.
          </p>
        </div>

        <style>{`
          .news-filter-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 9px;
            padding: 2px 2px 8px;
          }
          .news-filter-button {
            min-height: 40px;
            padding: 9px 20px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            transition: background 250ms ease, color 250ms ease, transform 250ms ease;
            background: #ffffff;
            color: #4d3b40;
            border: 1px solid rgba(101, 0, 30, 0.16);
            flex-shrink: 0;
            white-space: nowrap;
          }
          .news-filter-button.active {
            background: #65001e;
            color: #ffffff;
            border: 1px solid #65001e;
          }
          .news-stories-grid {
            width: 100%;
            max-width: 1120px;
            margin-inline: auto;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
            min-width: 0;
            box-sizing: border-box;
          }
          .news-story-card {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-width: 0;
            height: 255px;
            padding: 24px;
            overflow: hidden;
            border-radius: 18px;
            background: linear-gradient(145deg, #850027 0%, #69001f 52%, #4d0017 100%);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 12px 30px rgba(74, 0, 22, 0.15);
            box-sizing: border-box;
            transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease, border-color 350ms ease;
          }
          .news-story-card::before {
            content: "";
            position: absolute;
            width: 170px;
            height: 170px;
            top: -85px;
            right: -70px;
            border-radius: 50%;
            background: rgba(244, 196, 48, 0.08);
            filter: blur(4px);
            pointer-events: none;
          }
          .news-story-card:hover {
            transform: translateY(-6px);
            border-color: rgba(244, 196, 48, 0.42);
            box-shadow: 0 20px 45px rgba(62, 0, 18, 0.3);
          }
          .news-story-content {
            min-width: 0;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            position: relative;
            z-index: 1;
          }
          .news-story-category {
            display: inline-flex;
            align-items: center;
            width: fit-content;
            max-width: calc(100% - 55px);
            padding: 6px 11px;
            border-radius: 999px;
            background: rgba(244, 196, 48, 0.14);
            border: 1px solid rgba(244, 196, 48, 0.42);
            color: #f4c430;
            font-size: 10px;
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            white-space: normal;
            margin-bottom: 0;
          }
          .news-story-arrow {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 50%;
            color: #ffffff;
            background: rgba(255, 255, 255, 0.09);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 300ms ease, color 300ms ease, background 300ms ease;
            z-index: 10;
          }
          .news-story-card:hover .news-story-arrow {
            color: #4d0017;
            background: #f4c430;
            transform: translate(3px, -3px);
          }
          .news-story-title {
            margin-top: 22px;
            color: #ffffff;
            font-size: clamp(19px, 1.5vw, 23px);
            line-height: 1.22;
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 0;
          }
          .news-story-description {
            margin-top: 13px;
            color: rgba(255, 255, 255, 0.76);
            font-size: 13px;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            margin-bottom: 0;
          }
          .news-story-footer {
            margin-top: auto;
            padding-top: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.14);
            position: relative;
            z-index: 1;
          }
          .news-story-meta {
            color: rgba(255, 255, 255, 0.65);
            font-size: 11px;
            line-height: 1.3;
          }
          .news-story-link {
            color: #f4c430;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
          }

          /* Laptop */
          @media (min-width: 1024px) and (max-width: 1440px) {
            .news-stories-grid {
              max-width: 1040px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 15px;
            }
            .news-story-card {
              height: 225px;
              padding: 20px;
              border-radius: 15px;
            }
            .news-story-title {
              margin-top: 17px;
              font-size: 18px;
            }
            .news-story-description {
              margin-top: 10px;
              font-size: 12px;
              line-height: 1.5;
              -webkit-line-clamp: 2;
            }
            .news-story-arrow {
              width: 34px;
              height: 34px;
              top: 17px;
              right: 17px;
            }
          }
          
          /* Tablet */
          @media (min-width: 768px) and (max-width: 1023px) {
            .news-stories-grid {
              max-width: 720px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 15px;
            }
            .news-story-card {
              height: 235px;
              padding: 20px;
            }
          }

          /* Mobile */
          @media (max-width: 767px) {
            .news-filter-container {
              justify-content: flex-start;
              width: 100%;
              overflow-x: auto;
              scrollbar-width: none;
            }
            .news-filter-container::-webkit-scrollbar {
              display: none;
            }
            .news-stories-grid {
              width: 100%;
              grid-template-columns: 1fr;
              gap: 14px;
            }
            .news-story-card {
              width: 100%;
              height: auto;
              min-height: 220px;
              padding: 19px;
              border-radius: 14px;
            }
          }
        `}</style>

        {/* Filters */}
        <div className="news-filter-container mx-auto rm-reveal" style={{ transitionDelay: "100ms", marginTop: '27px', marginBottom: '34px' }}>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`news-filter-button focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9EA] ${
                activeFilter === filter ? 'active' : ''
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {!hasContent ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-12 bg-[#FFFFFF] border border-[rgba(90,0,24,0.14)] rounded-2xl text-center">
            <BookOpen className="w-12 h-12 text-[#A90032] mb-4 opacity-80" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-[#5A0018] mb-2">New Stories Are Being Written</h3>
            <p className="text-[#4F4548] mb-8 max-w-md font-medium">Campus news, community stories, creative voices, and publications will appear here as they are shared.</p>
            <Link 
              href="/gallery"
              className="inline-flex min-h-[44px] items-center justify-center bg-[#A90032] text-white px-6 py-3 rounded-full font-bold transition-all hover:bg-[#720020]"
            >
              Explore Ravenshaw Moments
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="news-stories-grid rm-reveal"
              style={{ transitionDelay: "200ms" }}
            >
              {filteredData.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="news-story-card focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFF9EA]"
                >
                  <div className="news-story-arrow">
                    <ArrowUpRight strokeWidth={2} />
                  </div>
                  
                  <div className="news-story-content">
                    <span className="news-story-category">
                      {item.category}
                    </span>
                    
                    <h3 className="news-story-title">
                      {item.title}
                    </h3>
                    
                    <p className="news-story-description">
                      {item.excerpt}
                    </p>
                    
                    <div className="news-story-footer">
                      <div className="flex flex-col gap-0.5">
                        <span className="news-story-meta font-[800]">{item.authorName}</span>
                        <div className="flex items-center gap-2 news-story-meta">
                          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                          <span className="w-[3px] h-[3px] rounded-full bg-white/40" />
                          <span>{item.readingTime}</span>
                        </div>
                      </div>
                      <span className="news-story-link">Read Story</span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom CTA Area */}
        <div className="flex flex-col items-center mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-[rgba(90,0,24,0.14)] rm-reveal" style={{ transitionDelay: "300ms" }}>
          <p className="text-[#4F4548] font-[500] text-center mb-6 max-w-lg">
            Every story adds another page to Ravenshaw&apos;s living legacy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link 
              href="/stories"
              className="flex items-center justify-center bg-[#FFFFFF] border-2 border-[#A90032] text-[#720020] px-8 py-3 rounded-full text-[1rem] font-[700] transition-all duration-300 hover:bg-[#A90032] hover:text-[#FFFFFF] hover:-translate-y-[2px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFF9EA]"
            >
              Explore All Stories
            </Link>
            
            <Link
              href="/publications"
              className="inline-flex min-h-[44px] items-center justify-center text-[#720020] font-[700] text-sm underline underline-offset-4 decoration-[#A90032]/40 hover:text-[#A90032] hover:decoration-[#A90032] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(232,182,63,0.55)] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFF9EA] rounded-md px-2"
            >
              View Publications
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
