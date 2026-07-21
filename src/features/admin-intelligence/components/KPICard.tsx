import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function KPICard({ title, value, icon: Icon, trend, description }: KPICardProps) {
  return (
    <Card className="border-[#F5F5DC] bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-[#800000]" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#800000]">{value}</div>
        {(trend || description) && (
          <div className="mt-1 flex items-center text-xs">
            {trend && (
              <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="ml-2 text-gray-500">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
