import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type InnerPageHeroProps = {
  title: string;
  highlightedText?: string;
  description?: string;
  quote?: string;
  eyebrow?: string;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  backgroundImage: string;
  backgroundPosition?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  compact?: boolean; // For utility/legal pages to reduce height
  children?: React.ReactNode; // For page-specific extra content
  overlayGradient?: string; // For overriding the default cinematic overlays
};

export const InnerPageHero: React.FC<InnerPageHeroProps> = ({
  title,
  highlightedText,
  description,
  quote,
  eyebrow,
  breadcrumbs,
  backgroundImage,
  backgroundPosition = "center",
  primaryAction,
  secondaryAction,
  compact = false,
  children,
  overlayGradient,
}) => {
  return (
    <section
      className={`relative isolate w-full overflow-hidden flex flex-col justify-center -mt-[72px] sm:-mt-[76px] min-[1150px]:-mt-20 ${
        compact 
          ? "min-h-[280px] sm:min-h-[320px] md:min-h-[350px] pt-24 pb-12" 
          : "min-h-[500px] md:min-h-[520px] lg:min-h-[560px] pt-32 pb-16 md:pt-40 md:pb-24"
      }`}
    >
      {/* Background Image with Slow Scale Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-hero-scale"
          style={{ objectPosition: backgroundPosition }}
        />
      </div>

      {/* Cinematic Black Overlays for Text Contrast and Luxury Readability */}
      {overlayGradient ? (
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{ background: overlayGradient }} 
        />
      ) : (
        <>
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.42))"
            }}
          />
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.55) 60%, rgba(0, 0, 0, 0.35))"
            }}
          />
        </>
      )}

      {/* Content Container with Navbar Padding Adjustment */}
      <div className="pt-[72px] sm:pt-[76px] min-[1150px]:pt-20 w-full flex flex-col items-center">
        <div className="container relative z-10 mx-auto px-5 md:px-8 lg:px-10 max-w-7xl animate-hero-fade-in w-full">
          <div className="flex flex-col max-w-3xl">
            
            {/* Breadcrumb Navigation */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
                <ol className="flex items-center flex-wrap gap-y-2 text-[0.85rem] sm:text-[0.9rem] font-medium text-[#E9B936]/80">
                  {breadcrumbs.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={crumb.label}>
                        <li>
                          {crumb.href ? (
                            <Link
                              href={crumb.href}
                              className="text-[#E9B936] hover:text-[#FFFFFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B936] rounded-sm px-1 -mx-1"
                            >
                              {crumb.label}
                            </Link>
                          ) : (
                            <span className={isLast ? "text-[#FFFFFF]" : "text-[#E9B936]"} aria-current={isLast ? "page" : undefined}>
                              {crumb.label}
                            </span>
                          )}
                        </li>
                        {!isLast && (
                          <li className="px-2" aria-hidden="true">
                            <ChevronRight className="w-4 h-4 text-[#E9B936]/50" />
                          </li>
                        )}
                      </React.Fragment>
                    );
                  })}
                </ol>
              </nav>
            )}

            {/* Eyebrow */}
            {eyebrow && (
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="w-8 h-[2px] bg-[#E9B936]" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold tracking-[0.15em] text-[#E9B936] uppercase">
                  {eyebrow}
                </span>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#FFFFFF] leading-[1.05] tracking-tight mb-6">
              {title}{" "}
              {highlightedText && (
                <span className="text-[#E9B936]">{highlightedText}</span>
              )}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-base md:text-lg lg:text-xl text-[#F8F3F4] leading-relaxed font-medium mb-6 md:mb-8 max-w-2xl">
                {description}
              </p>
            )}

            {/* Emotional Quote */}
            {quote && (
              <p className="text-[1.05rem] sm:text-lg text-[#E9B936] leading-relaxed font-serif italic max-w-2xl border-l-2 border-[#E9B936]/40 pl-4 mb-6 md:mb-8">
                {quote}
              </p>
            )}

            {/* Actions */}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 mb-6">
                {primaryAction && (
                  <Link
                    href={primaryAction.href}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#A90032] text-[#FFFFFF] font-bold rounded-xl hover:bg-[#E9B936] hover:text-[#30000C] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B936] focus-visible:ring-offset-2 focus-visible:ring-offset-[#4A0012] hover:-translate-y-1 hover:shadow-lg"
                  >
                    {primaryAction.label}
                  </Link>
                )}
                {secondaryAction && (
                  <Link
                    href={secondaryAction.href}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-transparent border-2 border-[#E9B936]/60 text-[#E9B936] font-bold rounded-xl hover:border-[#E9B936] hover:bg-[#E9B936]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B936] focus-visible:ring-offset-2 focus-visible:ring-offset-[#4A0012] hover:-translate-y-1"
                  >
                    {secondaryAction.label}
                  </Link>
                )}
              </div>
            )}
            
            {/* Custom Children */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
