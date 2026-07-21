export type CompetitionCategoryType = 
  | 'debate' 
  | 'culture' 
  | 'photography' 
  | 'design' 
  | 'music' 
  | 'dance' 
  | 'quiz' 
  | 'poetry' 
  | 'writing' 
  | 'sports' 
  | 'innovation' 
  | 'general';

export const competitionFallbackImages: Record<CompetitionCategoryType, string> = {
  debate: "/images/competitions/debate-default.webp",
  culture: "/images/competitions/culture-default.webp",
  photography: "/images/competitions/photography-default.webp",
  design: "/images/competitions/design-default.webp",
  music: "/images/competitions/music-default.webp",
  dance: "/images/competitions/dance-default.webp",
  quiz: "/images/competitions/quiz-default.webp",
  poetry: "/images/competitions/poetry-default.webp",
  writing: "/images/competitions/writing-default.webp",
  sports: "/images/competitions/sports-default.webp",
  innovation: "/images/competitions/innovation-default.webp",
  general: "/images/competitions/general-default.webp"
};

export const GENERIC_COMPETITION_FALLBACK = "/images/competitions/hero-competition.webp";

export function getCompetitionFallbackImage(category: string | undefined | null): string {
  if (!category) return GENERIC_COMPETITION_FALLBACK;
  
  const normalized = category.toLowerCase().trim();
  
  if (normalized.includes("debate")) return competitionFallbackImages.debate;
  if (normalized.includes("cultur")) return competitionFallbackImages.culture;
  if (normalized.includes("photo")) return competitionFallbackImages.photography;
  if (normalized.includes("design") || normalized.includes("art")) return competitionFallbackImages.design;
  if (normalized.includes("music") || normalized.includes("sing")) return competitionFallbackImages.music;
  if (normalized.includes("dance")) return competitionFallbackImages.dance;
  if (normalized.includes("quiz")) return competitionFallbackImages.quiz;
  if (normalized.includes("poet")) return competitionFallbackImages.poetry;
  if (normalized.includes("writ") || normalized.includes("essay")) return competitionFallbackImages.writing;
  if (normalized.includes("sport") || normalized.includes("athlet")) return competitionFallbackImages.sports;
  if (normalized.includes("innov") || normalized.includes("tech") || normalized.includes("science")) return competitionFallbackImages.innovation;
  if (normalized.includes("general")) return competitionFallbackImages.general;
  
  return GENERIC_COMPETITION_FALLBACK;
}
