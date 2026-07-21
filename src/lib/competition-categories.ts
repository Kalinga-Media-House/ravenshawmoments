export type CompetitionCategoryGroup = {
  group: string;
  categories: string[];
};

export const COMPETITION_CATEGORY_GROUPS: CompetitionCategoryGroup[] = [
  {
    group: "LITERARY & SPEAKING",
    categories: [
      "Debate",
      "Quiz",
      "Essay Writing",
      "Creative Writing",
      "Short Story Writing",
      "Poetry",
      "Speech",
      "Extempore",
      "Elocution",
      "Public Speaking",
      "Anchoring",
      "Model United Nations (MUN)",
    ],
  },
  {
    group: "ART & DESIGN",
    categories: [
      "Painting",
      "Drawing",
      "Sketching",
      "Poster Making",
      "Digital Art",
      "Graphic Design",
      "Rangoli",
      "Photography",
    ],
  },
  {
    group: "MUSIC & PERFORMING ARTS",
    categories: [
      "Singing",
      "Instrumental Music",
      "Dance",
      "Theatre",
      "Mono Acting",
      "Stand-up Comedy",
      "Mimicry",
    ],
  },
  {
    group: "TECHNOLOGY & INNOVATION",
    categories: [
      "Coding",
      "Hackathon",
      "Web Development",
      "App Development",
      "UI/UX Design",
      "Science & Innovation",
      "Robotics",
      "Business Plan",
      "Entrepreneurship",
    ],
  },
  {
    group: "MEDIA & CONTENT CREATION",
    categories: [
      "Film Making",
      "Short Film",
      "Videography",
      "Video Editing",
      "Reel Making",
      "Documentary",
      "Podcast",
    ],
  },
  {
    group: "KNOWLEDGE, CULTURE & SOCIAL",
    categories: [
      "General Knowledge",
      "Literature",
      "Culture & Heritage",
      "History",
      "Environment",
      "Social Awareness",
    ],
  },
  {
    group: "SPORTS & GAMING",
    categories: ["Sports", "Esports", "Chess"],
  },
];

export const ALL_COMPETITION_CATEGORIES = COMPETITION_CATEGORY_GROUPS.flatMap(
  (group) => group.categories
);
