import React from "react";
import { OrganizationAchievement } from "@/types/organization";

export const OrganizationAchievements = ({ achievements }: { achievements: OrganizationAchievement[] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      <ul className="space-y-4">
        {achievements.map(a => (
          <li key={a.id} className="p-4 border rounded-lg">
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-gray-600">{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
