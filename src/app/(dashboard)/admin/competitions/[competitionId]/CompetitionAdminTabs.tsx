"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Info, 
  Users, 
  Gavel, 
  Award, 
  Megaphone, 
  BarChart, 
  Medal 
} from "lucide-react";

export function CompetitionAdminTabs({ competitionId }: { competitionId: string }) {
  const pathname = usePathname();
  const baseUrl = `/admin/competitions/${competitionId}`;
  
  const tabs = [
    { label: "Overview", href: baseUrl, icon: Info, exact: true },
    { label: "Registrations & Teams", href: `${baseUrl}/registrations`, icon: Users },
    { label: "Judges & Criteria", href: `${baseUrl}/judges`, icon: Gavel },
    { label: "Leaderboard", href: `${baseUrl}/leaderboard`, icon: BarChart },
    { label: "Results & Awards", href: `${baseUrl}/results`, icon: Medal },
    { label: "Certificates", href: `${baseUrl}/certificates`, icon: Award },
    { label: "Announcements", href: `${baseUrl}/announcements`, icon: Megaphone },
    { label: "Sponsors", href: `${baseUrl}/sponsors`, icon: Award },
  ];

  return (
    <div className="border-b border-stone-200">
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.exact 
            ? pathname === tab.href 
            : pathname.startsWith(tab.href);
            
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${isActive
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
                }
              `}
            >
              <tab.icon
                className={`
                  mr-2 w-5 h-5
                  ${isActive ? "text-stone-900" : "text-stone-400 group-hover:text-stone-500"}
                `}
                aria-hidden="true"
              />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
