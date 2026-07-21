import React from 'react';
import { Breadcrumb } from './breadcrumb';

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, children, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5E6EA]">{title}</h1>
          {description && (
            <p className="text-sm text-[#8B7078] mt-1">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
