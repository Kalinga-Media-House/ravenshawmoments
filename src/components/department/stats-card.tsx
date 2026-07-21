import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("bg-[#1A1214] border-[#2D1F23] text-[#F5E6EA] relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C2D3E]/10 to-transparent pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <CardTitle className="text-sm font-medium text-[#8B7078]">{title}</CardTitle>
        {icon && <div className="text-[#8B7078]">{icon}</div>}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-[#8B7078] mt-1 flex items-center gap-1">
            {trendValue && (
              <span
                className={cn("flex items-center", {
                  'text-green-500': trend === 'up',
                  'text-red-500': trend === 'down',
                  'text-gray-500': trend === 'neutral',
                })}
              >
                {trend === 'up' && <ArrowUpIcon className="w-3 h-3 mr-1" />}
                {trend === 'down' && <ArrowDownIcon className="w-3 h-3 mr-1" />}
                {trend === 'neutral' && <ArrowRightIcon className="w-3 h-3 mr-1" />}
                {trendValue}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
