import React from "react";
import Link from "next/link";
import { 
  Leaf, FlaskConical, Atom, LineChart, Wallet, Cpu, Landmark, 
  BookOpen, Globe, Compass, TrendingUp, GraduationCap, Layers, 
  Languages, Server, Radio, Feather, Lightbulb, Scale, Brain, 
  Scroll, Users, Dna, Briefcase, Code2, ArrowRight 
} from "lucide-react";
import { DepartmentDirectoryItem } from "../types/directory";
import { cn } from "@/lib/utils";

interface DepartmentDirectoryCardProps {
  department: DepartmentDirectoryItem;
}

// Map slug to high-end distinct Lucide icons
const DEPARTMENT_ICON_MAP: Record<string, React.ElementType> = {
  "botany": Leaf,
  "chemistry": FlaskConical,
  "physics": Atom,
  "statistics": LineChart,
  "commerce": Wallet,
  "computer-science": Cpu,
  "history": Landmark,
  "english": BookOpen,
  "geography": Globe,
  "mathematics": Compass,
  "economics": TrendingUp,
  "education": GraduationCap,
  "geology": Layers,
  "hindi": Languages,
  "information-technology-management": Server,
  "journalism-mass-communication": Radio,
  "odia": Feather,
  "philosophy": Lightbulb,
  "political-science": Scale,
  "psychology": Brain,
  "sanskrit": Scroll,
  "sociology": Users,
  "zoology": Dna,
  "business-administration": Briefcase,
  "computer-application": Code2,
};

export const DepartmentDirectoryCard = ({ department }: DepartmentDirectoryCardProps) => {
  const rawName = department.name;
  const displayName = rawName.toLowerCase().startsWith("department") 
    ? rawName 
    : `Department of ${rawName}`;

  const IconComponent = DEPARTMENT_ICON_MAP[department.slug] || (department.icon ? null : Landmark);

  const getCategory = (slug: string) => {
    const categories = {
      science: ["botany", "chemistry", "computer-science", "mathematics", "physics", "statistics", "zoology", "geology"],
      commerce: ["commerce", "business-administration"],
      technology: ["computer-application", "information-technology-management"],
      languages: ["odia", "hindi", "sanskrit", "english"],
      professional: ["economics", "education", "journalism-mass-communication"],
      arts: ["history", "philosophy", "psychology", "sociology"],
    };
    for (const [category, slugs] of Object.entries(categories)) {
      if (slugs.includes(slug)) return category;
    }
    return "arts";
  };

  const getTheme = (category: string) => {
    switch (category) {
      case "science":
        return {
          gradient: "from-[#0F3A52] via-[#175B7E] to-[#2B82B5]",
          accentText: "text-[#60A5FA]", // Sky Blue
          accentGlow: "hover:shadow-[0_25px_70px_rgba(15,58,82,0.4)]",
          borderHover: "hover:border-[#60A5FA]/50",
          iconBg: "bg-black/30 border-[#60A5FA]/30",
          iconColor: "text-[#D4AF37]", // Sky Blue + Gold accent
          deco: (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full opacity-[0.06]">
              <path d="M50 15 L80 30 L80 70 L50 85 L20 70 L20 30 Z" />
              <circle cx="50" cy="50" r="10" />
            </svg>
          ),
        };
      case "commerce":
        return {
          gradient: "from-[#1E4D39] via-[#2F7056] to-[#4E9A77]",
          accentText: "text-[#D4AF37]", // Gold
          accentGlow: "hover:shadow-[0_25px_70px_rgba(30,77,57,0.4)]",
          borderHover: "hover:border-[#D4AF37]/50",
          iconBg: "bg-black/30 border-[#D4AF37]/30",
          iconColor: "text-[#D4AF37]",
          deco: (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full opacity-[0.06]">
              <path d="M20 80 V50 M50 80 V30 M80 80 V10" />
              <path d="M10 85 H90" />
            </svg>
          ),
        };
      case "technology":
        return {
          gradient: "from-[#1B2340] via-[#2C3F73] to-[#4D67B8]",
          accentText: "text-[#3B82F6]", // Electric Blue
          accentGlow: "hover:shadow-[0_25px_70px_rgba(27,35,64,0.4)]",
          borderHover: "hover:border-[#3B82F6]/50",
          iconBg: "bg-black/30 border-[#3B82F6]/30",
          iconColor: "text-[#3B82F6]",
          deco: (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full opacity-[0.05]">
              <circle cx="20" cy="20" r="4"/><circle cx="80" cy="50" r="4"/><circle cx="40" cy="80" r="4"/>
              <path d="M24 20 H50 L76 50 M44 80 L55 65" />
            </svg>
          ),
        };
      case "languages":
        return {
          gradient: "from-[#5C3B00] via-[#876000] to-[#B88A17]",
          accentText: "text-[#FFFFF0]", // Ivory
          accentGlow: "hover:shadow-[0_25px_70px_rgba(92,59,0,0.4)]",
          borderHover: "hover:border-[#FFFFF0]/50",
          iconBg: "bg-black/30 border-[#FFFFF0]/30",
          iconColor: "text-[#FFFFF0]",
          deco: (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full opacity-[0.05]">
              <path d="M20 50 Q 50 10 80 50 T 20 50" />
              <path d="M40 30 L60 70" />
            </svg>
          ),
        };
      case "professional":
        return {
          gradient: "from-[#4A2346] via-[#6A3567] to-[#925090]",
          accentText: "text-[#E8D499]", // Soft Gold
          accentGlow: "hover:shadow-[0_25px_70px_rgba(74,35,70,0.4)]",
          borderHover: "hover:border-[#E8D499]/50",
          iconBg: "bg-black/30 border-[#E8D499]/30",
          iconColor: "text-[#E8D499]",
          deco: (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full opacity-[0.06]">
              <circle cx="50" cy="50" r="30" />
              <ellipse cx="50" cy="50" rx="30" ry="10" />
              <path d="M50 20 V80" />
            </svg>
          ),
        };
      case "arts":
      default:
        return {
          gradient: "from-[#5B001B] via-[#7A1432] to-[#A3254D]",
          accentText: "text-[#D4AF37]", // Gold
          accentGlow: "hover:shadow-[0_25px_70px_rgba(91,0,27,0.4)]",
          borderHover: "hover:border-[#D4AF37]/50",
          iconBg: "bg-black/30 border-[#D4AF37]/30",
          iconColor: "text-[#D4AF37]",
          deco: (
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full opacity-[0.05]">
              <path d="M30 20 Q 50 40 70 20 M30 40 Q 50 60 70 40 M30 60 Q 50 80 70 60" />
            </svg>
          ),
        };
    }
  };

  const category = getCategory(department.slug);
  const theme = getTheme(category);

  return (
    <Link 
      href={department.href}
      className={cn(
        "group relative flex flex-col justify-between w-full overflow-hidden isolate",
        "h-[108px] sm:h-[155px] md:h-[165px] lg:h-[175px]",
        "rounded-[24px] p-4 sm:p-5",
        "bg-gradient-to-br backdrop-blur-xl",
        theme.gradient,
        "border border-white/10",
        theme.borderHover,
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_25px_70px_rgba(0,0,0,0.20)]",
        theme.accentGlow,
        "transition-all duration-500 ease-out",
        "hover:scale-[1.03] hover:-translate-y-2 hover:brightness-105",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1B1C]"
      )}
    >
      {/* Radial soft lighting & Academic Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)] z-[-1] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-[-1] pointer-events-none" />
      
      <div className="absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 w-24 h-24 sm:w-36 sm:h-36 text-white pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 z-[-1]">
        {theme.deco}
      </div>

      {/* Top Row: Circular Glass Badge & Glowing Arrow */}
      <div className="flex items-center justify-between z-10 w-full">
        {/* Glass Icon Container */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${theme.iconBg} border flex items-center justify-center ${theme.iconColor} shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:border-white/40 shrink-0`}>
          {IconComponent ? (
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 stroke-[1.5]" />
          ) : department.icon ? (
            React.cloneElement(department.icon as React.ReactElement<any>, { 
              className: 'w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 stroke-[1.5]' 
            })
          ) : (
            <Landmark className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 stroke-[1.5]" />
          )}
        </div>

        {/* Glowing Arrow Indicator */}
        <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-white/20 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-500 shrink-0`}>
          <ArrowRight className={`w-4 h-4 ${theme.accentText} transform transition-transform duration-500 group-hover:translate-x-1`} />
        </div>
      </div>

      {/* Bottom Area: Department Name */}
      <div className="z-10 mt-auto pt-1 sm:pt-2">
        <h3 className="text-[14px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-semibold text-white group-hover:text-white/95 transition-colors duration-300 leading-snug tracking-tight line-clamp-2">
          {displayName}
        </h3>
      </div>
    </Link>
  );
};
