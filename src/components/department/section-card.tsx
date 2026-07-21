import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function SectionCard({
  title,
  description,
  children,
  actions,
  collapsible = false,
  defaultExpanded = true,
  className,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={cn("bg-[#1A1214] border-[#2D1F23]", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="space-y-1">
          <CardTitle className="text-[#F5E6EA]">{title}</CardTitle>
          {description && <CardDescription className="text-[#8B7078]">{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {collapsible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      {(!collapsible || isExpanded) && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
