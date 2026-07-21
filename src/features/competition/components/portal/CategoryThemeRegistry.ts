import React from "react";
import {
  Palette,
  Video,
  Camera,
  Film,
  BookOpen,
  Feather,
  PenTool,
  MessageSquare,
  HelpCircle,
  Brush,
  Music,
  UserPlus,
  Mic,
  Smartphone,
  Briefcase,
  Gamepad2,
  Code,
  Theater,
  Monitor,
  Award,
  Trophy,
  Sparkles,
  Star,
  Bookmark,
  Compass,
  Lightbulb,
  Layers,
  Presentation,
  Newspaper,
  BookMarked,
  Globe,
  Radio,
  FileText
} from "lucide-react";
import { CategoryTheme } from "../../types/categoryPortal";

const APPROVED_PORTAL_THEME: CategoryTheme = {
  iconName: "Award",
  primaryColor: "#4A0E17",
  accentColor: "#D4AF37",
  backgroundColor: "#2B070E",
  borderColor: "rgba(212, 175, 55, 0.25)",
  isDarkTheme: true
};

const SEMANTIC_COLOR_MAP: Record<string, Partial<CategoryTheme>> = {
  "graphic-design": { backgroundColor: "#F3EEFF", accentColor: "#7C4DCC", borderColor: "#DDD0F7" },
  "video-editing": { backgroundColor: "#FFF0F4", accentColor: "#C84D72", borderColor: "#F4CEDA" },
  "photography": { backgroundColor: "#EDF6FF", accentColor: "#3977B9", borderColor: "#CDE3F7" },
  "videography": { backgroundColor: "#EAF9F7", accentColor: "#21877D", borderColor: "#C6EAE5" },
  "short-story-odia": { backgroundColor: "#FFF3E8", accentColor: "#C96B2C", borderColor: "#F3D8BF" },
  "poetry-odia": { backgroundColor: "#FFF0F7", accentColor: "#B94F82", borderColor: "#F0CDDF" },
  "essay-writing": { backgroundColor: "#EDF9F1", accentColor: "#39885A", borderColor: "#CDE8D6" },
  "debate": { backgroundColor: "#FAEEF1", accentColor: "#8A1735", borderColor: "#EACBD3" },
  "quiz": { backgroundColor: "#FFF8DF", accentColor: "#C58A13", borderColor: "#F1DDA1" },
  "painting": { backgroundColor: "#FFF0EB", accentColor: "#C85F43", borderColor: "#F1CFC4" },
  "music": { backgroundColor: "#EEF0FF", accentColor: "#5B5FC7", borderColor: "#D2D5F5" },
  "dance": { backgroundColor: "#F7EEFC", accentColor: "#9652B5", borderColor: "#E4CEEF" }
};

const SEMANTIC_ICON_MAP: Record<string, string> = {
  // 12 Curated Categories
  "graphic-design": "Palette",
  "video-editing": "Video",
  "photography": "Camera",
  "videography": "Film",
  "short-story-odia": "BookOpen",
  "poetry-odia": "Feather",
  "essay-writing": "PenTool",
  "debate": "MessageSquare",
  "quiz": "HelpCircle",
  "painting": "Brush",
  "music": "Music",
  "dance": "UserPlus",

  // Semantic mappings for remaining known categories
  "anchoring": "Mic",
  "app-development": "Smartphone",
  "business-plan": "Briefcase",
  "chess": "Gamepad2",
  "coding": "Code",
  "creative-writing": "PenTool",
  "drama-skit-play": "Theater",
  "web-design": "Monitor",
  "elocution": "Mic",
  "extempore": "Presentation",
  "mono-acting": "Theater",
  "mimicry": "Mic",
  "stand-up-comedy": "Mic",
  "creative-writing-english": "PenTool",
  "short-story-english": "BookOpen",
  "poetry-english": "Feather",
  "journalism-news-writing": "Newspaper",
  "book-review": "BookMarked",
  "hackathon": "Code",
  "ui-ux-design": "Monitor",
  "science-exhibition": "Lightbulb",
  "rostrum": "Presentation",
  "paper-presentation": "FileText",
  "case-study": "Briefcase",
  "model-united-nations-mun": "Globe",
  "podcast-creation": "Radio",
  "short-film-making": "Film",
  "digital-art": "Palette",
  "sketching": "Brush",
  "poster-making": "Palette",
  "classical-vocal": "Music",
  "light-vocal": "Music",
  "instrumental": "Music",
  "classical-dance": "UserPlus",
  "folk-dance": "UserPlus",
  "contemporary-dance": "UserPlus"
};

const ALLOWLISTED_ICONS: Record<string, React.ElementType> = {
  Palette,
  Video,
  Camera,
  Film,
  BookOpen,
  Feather,
  PenTool,
  MessageSquare,
  HelpCircle,
  Brush,
  Music,
  UserPlus,
  Mic,
  Smartphone,
  Briefcase,
  Gamepad2,
  Code,
  Theater,
  Monitor,
  Award,
  Trophy,
  Sparkles,
  Star,
  Bookmark,
  Compass,
  Lightbulb,
  Layers,
  Presentation,
  Newspaper,
  BookMarked,
  Globe,
  Radio,
  FileText
};

export function getCategoryPortalTheme(slug: string): CategoryTheme {
  const normalizedSlug = slug.toLowerCase().trim();
  const iconName = SEMANTIC_ICON_MAP[normalizedSlug] || "Award";
  const customColors = SEMANTIC_COLOR_MAP[normalizedSlug] || {};
  
  return {
    ...APPROVED_PORTAL_THEME,
    iconName,
    ...customColors,
    isDarkTheme: !customColors.backgroundColor
  };
}

export function renderCategoryPortalIcon(iconName: string, className: string = "w-6 h-6"): React.ReactElement {
  const IconComponent = ALLOWLISTED_ICONS[iconName] || Award;
  return React.createElement(IconComponent, { className });
}
