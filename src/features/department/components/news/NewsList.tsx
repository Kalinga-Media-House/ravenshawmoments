// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/news/NewsList.tsx
// Purpose   : Grid showcase layout for departmental news bulletins
// =============================================================================

import React from "react";
import { DepartmentNews } from "@/types/department";
import { NewsCard } from "./NewsCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface NewsListProps {
  newsList: DepartmentNews[];
  onSelectNews?: (news: DepartmentNews) => void;
}

export const NewsList: React.FC<NewsListProps> = ({ newsList, onSelectNews }) => {
  if (newsList.length === 0) {
    return (
      <EmptyDepartmentState
        title="No News Available"
        description="There are currently no published news articles or bulletins for this department."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {newsList.map((news) => (
        <NewsCard
          key={news.id}
          news={news}
          onClick={() => onSelectNews?.(news)}
        />
      ))}
    </div>
  );
};
